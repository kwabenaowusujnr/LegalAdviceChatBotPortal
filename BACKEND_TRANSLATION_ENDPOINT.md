# Backend Translation Endpoint Implementation Plan

## Overview

This document outlines the implementation of a backend translation endpoint that will handle message translation on the server side, providing better security, caching, and legal terminology consistency.

---

## Current Frontend Implementation

The frontend currently has a "Translate to English" button that calls:
```typescript
this.translationService.translateToEnglish(textToTranslate, this.currentLanguage)
```

This needs to be replaced with a call to a backend endpoint.

---

## Proposed Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ANGULAR FRONTEND                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Message Card with Translate Button                           │    │
│  │ ┌─────────────────────────────────────────────────────────┐ │    │
│  │ │ POST /api/translation/translate                         │ │    │
│  │ │ { text: "...", sourceLanguage: "ak", targetLanguage:   │ │    │
│  │ │   "en", messageId: 123 }                               │ │    │
│  │ └─────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP POST
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     .NET BACKEND API                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │               TranslationController                          │    │
│  │                                                               │    │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐ │    │
│  │  │ 1. Validate  │──▶│ 2. Check     │──▶│ 3. Apply Legal   │ │    │
│  │  │ Request      │   │ Cache        │   │ Glossary         │ │    │
│  │  └──────────────┘   └──────────────┘   └────────┬─────────┘ │    │
│  │                                                  │           │    │
│  │  ┌──────────────┐   ┌──────────────────────────▼─────────┐  │    │
│  │  │ 6. Cache &   │◀──│ 4. Google Cloud Translation API    │  │    │
│  │  │ Return       │   │ 5. Apply Post-processing          │  │    │
│  │  └──────────────┘   └────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Translation Cache (Redis/Memory)                │    │
│  │  Key: "translate_ak_en_hash12345"                           │    │
│  │  Value: { translation: "...", timestamp: "..." }           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create Translation DTOs

```csharp
// DTOs/TranslationDto.cs
namespace NsemBot.DTOs
{
    public class TranslationRequestDto
    {
        [Required]
        public string Text { get; set; }
        
        [Required]
        public string SourceLanguage { get; set; }
        
        [Required] 
        public string TargetLanguage { get; set; }
        
        public int? MessageId { get; set; }
        
        public string Context { get; set; } = "general";
    }

    public class TranslationResponseDto
    {
        public string TranslatedText { get; set; }
        public string SourceText { get; set; }
        public string SourceLanguage { get; set; }
        public string TargetLanguage { get; set; }
        public bool FromCache { get; set; }
        public DateTime Timestamp { get; set; }
        public string Provider { get; set; } = "Google Translate";
    }

    public class SupportedLanguageDto
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string NativeName { get; set; }
        public bool IsSupported { get; set; }
    }
}
```

### Step 2: Create Translation Controller

```csharp
// Controllers/TranslationController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NsemBot.Services;
using NsemBot.DTOs;

namespace NsemBot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TranslationController : ControllerBase
    {
        private readonly ITranslationService _translationService;
        private readonly ILogger<TranslationController> _logger;

        public TranslationController(
            ITranslationService translationService,
            ILogger<TranslationController> logger)
        {
            _translationService = translationService;
            _logger = logger;
        }

        /// <summary>
        /// Translate text between supported languages
        /// </summary>
        [HttpPost("translate")]
        public async Task<ActionResult<TranslationResponseDto>> Translate(
            [FromBody] TranslationRequestDto request)
        {
            try
            {
                if (request.SourceLanguage == request.TargetLanguage)
                {
                    return Ok(new TranslationResponseDto
                    {
                        TranslatedText = request.Text,
                        SourceText = request.Text,
                        SourceLanguage = request.SourceLanguage,
                        TargetLanguage = request.TargetLanguage,
                        FromCache = false,
                        Timestamp = DateTime.UtcNow,
                        Provider = "No translation needed"
                    });
                }

                var result = await _translationService.TranslateAsync(
                    request.Text,
                    request.SourceLanguage,
                    request.TargetLanguage,
                    request.Context
                );

                _logger.LogInformation(
                    "Translation completed: {SourceLang} -> {TargetLang}, " +
                    "Characters: {CharCount}, FromCache: {FromCache}",
                    request.SourceLanguage,
                    request.TargetLanguage,
                    request.Text.Length,
                    result.FromCache
                );

                return Ok(new TranslationResponseDto
                {
                    TranslatedText = result.TranslatedText,
                    SourceText = request.Text,
                    SourceLanguage = request.SourceLanguage,
                    TargetLanguage = request.TargetLanguage,
                    FromCache = result.FromCache,
                    Timestamp = DateTime.UtcNow,
                    Provider = result.Provider
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid translation request");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Translation failed");
                return StatusCode(500, new { 
                    error = "Translation service temporarily unavailable" 
                });
            }
        }

        /// <summary>
        /// Get list of supported languages
        /// </summary>
        [HttpGet("languages")]
        public ActionResult<IEnumerable<SupportedLanguageDto>> GetSupportedLanguages()
        {
            var languages = _translationService.GetSupportedLanguages()
                .Select(lang => new SupportedLanguageDto
                {
                    Code = lang.Code,
                    Name = lang.Name,
                    NativeName = lang.NativeName,
                    IsSupported = true
                });

            return Ok(languages);
        }

        /// <summary>
        /// Check if translation service is configured and available
        /// </summary>
        [HttpGet("health")]
        public async Task<ActionResult> CheckHealth()
        {
            try
            {
                var isConfigured = _translationService.IsConfigured();
                if (!isConfigured)
                {
                    return StatusCode(503, new { 
                        error = "Translation service not configured" 
                    });
                }

                // Test with simple translation
                var testResult = await _translationService.TranslateAsync(
                    "Hello",
                    "en",
                    "ak",
                    "test"
                );

                return Ok(new { 
                    status = "healthy",
                    provider = testResult.Provider,
                    lastCheck = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Translation health check failed");
                return StatusCode(503, new { 
                    error = "Translation service unhealthy" 
                });
            }
        }
    }
}
```

### Step 3: Update Translation Service Interface

```csharp
// Services/ITranslationService.cs (Updated)
namespace NsemBot.Services
{
    public interface ITranslationService
    {
        Task<TranslationResult> TranslateAsync(
            string text, 
            string sourceLanguage, 
            string targetLanguage, 
            string context = "general");
        
        Task<string> TranslateToEnglishAsync(string text, string sourceLanguage);
        Task<string> TranslateFromEnglishAsync(string text, string targetLanguage);
        Task<string> DetectLanguageAsync(string text);
        IEnumerable<SupportedLanguage> GetSupportedLanguages();
        bool IsConfigured();
    }

    public class TranslationResult
    {
        public string TranslatedText { get; set; }
        public bool FromCache { get; set; }
        public string Provider { get; set; } = "Google Translate";
        public TimeSpan Duration { get; set; }
    }
}
```

### Step 4: Update Frontend Service

```typescript
// src/app/services/translation.service.ts (Updated methods)
export class TranslationService {
  private readonly API_BASE_URL = '/api/translation';

  constructor(private http: HttpClient) {}

  /**
   * Translate text using backend endpoint
   */
  translateText(
    text: string, 
    sourceLanguage: string, 
    targetLanguage: string,
    messageId?: number
  ): Observable<TranslationResponseDto> {
    const request: TranslationRequestDto = {
      text,
      sourceLanguage,
      targetLanguage,
      messageId,
      context: 'chat'
    };

    return this.http.post<TranslationResponseDto>(
      `${this.API_BASE_URL}/translate`, 
      request
    ).pipe(
      catchError(error => {
        console.error('Translation API error:', error);
        // Return fallback response
        return of({
          translatedText: text,
          sourceText: text,
          sourceLanguage,
          targetLanguage,
          fromCache: false,
          timestamp: new Date(),
          provider: 'Fallback'
        } as TranslationResponseDto);
      })
    );
  }

  /**
   * Legacy method for backward compatibility - now uses backend
   */
  translateToEnglish(text: string, sourceLanguage: string): Observable<string> {
    if (sourceLanguage === 'en' || !text.trim()) {
      return of(text);
    }

    return this.translateText(text, sourceLanguage, 'en')
      .pipe(map(response => response.translatedText));
  }

  /**
   * Get supported languages from backend
   */
  getSupportedLanguages(): Observable<SupportedLanguageDto[]> {
    return this.http.get<SupportedLanguageDto[]>(
      `${this.API_BASE_URL}/languages`
    );
  }

  /**
   * Check if translation service is healthy
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.API_BASE_URL}/health`);
  }
}

// DTOs for TypeScript
export interface TranslationRequestDto {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  messageId?: number;
  context?: string;
}

export interface TranslationResponseDto {
  translatedText: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  fromCache: boolean;
  timestamp: Date;
  provider: string;
}

export interface SupportedLanguageDto {
  code: string;
  name: string;
  nativeName: string;
  isSupported: boolean;
}
```

### Step 5: Update Message Component

```typescript
// src/app/shared/message-window/message-window.component.ts (Updated method)
toggleEnglishTranslation(): void {
  if (this.showingEnglish) {
    // Switch back to original
    this.showingEnglish = false;
    return;
  }

  if (this.englishTranslation) {
    // Already have translation, just toggle
    this.showingEnglish = true;
    return;
  }

  // Use backend translation endpoint
  this.isTranslating = true;
  const textToTranslate = this.message.response || '';

  this.translationService.translateText(
    textToTranslate,
    this.currentLanguage,
    'en',
    this.message.id
  ).subscribe({
    next: (response) => {
      this.englishTranslation = response.translatedText;
      this.showingEnglish = true;
      this.isTranslating = false;
      
      // Optional: Track translation analytics
      console.log(`Translation from ${response.sourceLanguage} to ${response.targetLanguage}`, {
        fromCache: response.fromCache,
        provider: response.provider
      });
    },
    error: (error) => {
      console.error('Backend translation failed:', error);
      this.isTranslating = false;
      // Show user-friendly error message
      this.englishTranslation = 'Translation temporarily unavailable';
      this.showingEnglish = true;
    }
  });
}
```

---

## Configuration Updates

### Backend Configuration

```json
// appsettings.json
{
  "GoogleCloud": {
    "TranslationApiKey": "YOUR_GOOGLE_CLOUD_API_KEY",
    "ProjectId": "your-project-id"
  },
  "TranslationSettings": {
    "CacheExpirationHours": 24,
    "EnableCaching": true,
    "MaxCacheSize": 10000,
    "RateLimitPerMinute": 100,
    "EnableAnalytics": true
  },
  "Cors": {
    "AllowedOrigins": ["https://localhost:4200", "https://nsembot.com"],
    "AllowedMethods": ["GET", "POST"],
    "AllowedHeaders": ["Content-Type", "Authorization"]
  }
}
```

### Service Registration

```csharp
// Program.cs
builder.Services.AddScoped<ITranslationService, GoogleTranslationService>();
builder.Services.AddMemoryCache();

// Add rate limiting
builder.Services.Configure<IpRateLimitOptions>(options =>
{
    options.EnableEndpointRateLimiting = true;
    options.StackBlockedRequests = false;
    options.HttpStatusCode = 429;
    options.RealIpHeader = "X-Real-IP";
    options.ClientIdHeader = "X-ClientId";
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "*/api/translation/*",
            Period = "1m",
            Limit = 20,
        }
    };
});
```

---

## Security Considerations

### Rate Limiting
```csharp
[EnableRateLimit(Period = "1m", Limit = 10)]
[HttpPost("translate")]
public async Task<ActionResult<TranslationResponseDto>> Translate(...)
```

### Input Validation
```csharp
public class TranslationRequestDto
{
    [Required]
    [StringLength(5000, MinimumLength = 1)]
    public string Text { get; set; }
    
    [Required]
    [RegularExpression("^(en|ak|gaa|ee|ha|dag)$")]
    public string SourceLanguage { get; set; }
    
    [Required]
    [RegularExpression("^(en|ak|gaa|ee|ha|dag)$")]
    public string TargetLanguage { get; set; }
}
```

### API Key Security
- Store in Azure Key Vault or environment variables
- Never log API keys
- Use different keys for dev/staging/production

---

## Caching Strategy

### Cache Keys
```csharp
private string GenerateCacheKey(string text, string source, string target, string context)
{
    var hash = SHA256.HashData(Encoding.UTF8.GetBytes(text));
    var hashString = Convert.ToHexString(hash)[..8];
    return $"translate_{source}_{target}_{context}_{hashString}";
}
```

### Cache Configuration
- **Absolute Expiration**: 24 hours
- **Sliding Expiration**: 1 hour
- **Max Size**: 10,000 entries
- **Cleanup**: Background service to remove expired entries

---

## Error Handling

### HTTP Status Codes
| Code | Scenario | Response |
|------|----------|----------|
| 200 | Success | TranslationResponseDto |
| 400 | Invalid request | { "error": "Invalid language code" } |
| 429 | Rate limit exceeded | { "error": "Too many requests" } |
| 503 | Service unavailable | { "error": "Translation service down" } |
| 500 | Server error | { "error": "Internal server error" } |

### Fallback Strategy
1. Return cached translation if available
2. Return original text with error flag
3. Log error for monitoring
4. Show user-friendly message in UI

---

## Testing

### Unit Tests
```csharp
[TestMethod]
public async Task Translate_ValidRequest_ReturnsTranslation()
{
    // Arrange
    var request = new TranslationRequestDto
    {
        Text = "Hello world",
        SourceLanguage = "en",
        TargetLanguage = "ak"
    };

    // Act
    var result = await _controller.Translate(request);

    // Assert
    Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
    var response = ((OkObjectResult)result.Result).Value as TranslationResponseDto;
    Assert.IsNotNull(response.TranslatedText);
}
```

### Integration Tests
```csharp
[TestMethod]
public async Task TranslationEndpoint_IntegrationTest()
{
    var client = _factory.CreateClient();
    var request = new
    {
        text = "What are my rights?",
        sourceLanguage = "en",
        targetLanguage = "ak"
    };

    var response = await client.PostAsJsonAsync("/api/translation/translate", request);
    
    Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
    var result = await response.Content.ReadFromJsonAsync<TranslationResponseDto>();
    Assert.IsNotNull(result.TranslatedText);
}
```

---

## Performance Metrics

### Key Metrics to Track
- Translation requests per minute
- Average response time
- Cache hit ratio
- API cost per translation
- Error rate
- Most translated languages

### Monitoring Dashboard
```csharp
// Controllers/TranslationController.cs (Add metrics)
using System.Diagnostics.Metrics;

private static readonly Meter _meter = new("NsemBot.Translation");
private static readonly Counter<long> _translationCounter = 
    _meter.CreateCounter<long>("translations_total");
private static readonly Histogram<double> _translationDuration = 
    _meter.CreateHistogram<double>("translation_duration_ms");
```

---

## Migration Plan

### Phase 1: Backend Implementation (Week 1)
- [ ] Create TranslationController
- [ ] Update TranslationService interface
- [ ] Add DTOs and validation
- [ ] Configure caching
- [ ] Write unit tests

### Phase 2: Frontend Integration (Week 2)
- [ ] Update TranslationService to use backend API
- [ ] Update message component
- [ ] Add error handling
- [ ] Test with different languages

### Phase 3: Testing & Deployment (Week 3)
- [ ] Integration testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Deploy to staging
- [ ] User acceptance testing

### Phase 4: Production & Monitoring (Week 4)
- [ ] Production deployment
- [ ] Monitor metrics
- [ ] Optimize cache settings
- [ ] Document API for future use

---

## API Documentation

### OpenAPI/Swagger Configuration
```csharp
// Program.cs
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "NsemBot Translation API", 
        Version = "v1",
        Description = "Translation service for Ghanaian local languages"
    });
    
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, 
        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
});
```

### Example API Calls
```bash
# Translate to English
curl -X POST https://nsembot.com/api/translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Mepɛ sɛ menim me hokwan",
    "sourceLanguage": "ak",
    "targetLanguage": "en",
    "context": "chat"
  }'

# Get supported languages
curl https://nsembot.com/api/translation/languages

# Health check
curl https://nsembot.com/api/translation/health
```

---

## Cost Estimation

### Google Cloud Translation API Pricing
- First 500K characters/month: **Free**
- 500K - 1B characters/month: **$20/million characters**
- 1B+ characters/month: **Contact Google**

### Estimated Monthly Costs (with backend caching)
| Users | Translations/Month | Characters | Cache Hit | Cost |
|-------|-------------------|------------|-----------|------|
| 100 | 2,000 | 1M | 80% | $4 |
| 500 | 10,000 | 5M | 85% | $15 |
| 1,000 | 20,000 | 10M | 90% | $20 |

*Cache significantly reduces API costs by 80-90%*

---

*Document Version: 1.0*
*Last Updated: March 2026*
*Status: Ready for Implementation*
