# Backend Implementation Plan: Ghanaian Local Language Support (Recommended)

## Overview

This document outlines the backend-based approach for implementing Ghanaian local language support (Twi, Ga, Ewe, Hausa, Dagbani) in NsemBot using Google Cloud Translation API. This is the **recommended approach** for production deployments.

---

## Architecture

Translation occurs on the .NET backend server, keeping the frontend simple and securing API credentials.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ANGULAR FRONTEND (Minimal Changes)               │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Language Selector ──▶ Sends { message, languageCode }       │    │
│  │                       to backend                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ POST /api/chat/send
                               │ { message: "...", language: "ak" }
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     .NET BACKEND                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 Translation Pipeline                         │    │
│  │                                                               │    │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐ │    │
│  │  │ 1. Receive   │──▶│ 2. Translate │──▶│ 3. Process with  │ │    │
│  │  │ message +    │   │ to English   │   │ Legal AI/LLM     │ │    │
│  │  │ lang code    │   │ (Google API) │   │                  │ │    │
│  │  └──────────────┘   └──────────────┘   └────────┬─────────┘ │    │
│  │                                                  │           │    │
│  │  ┌──────────────┐   ┌──────────────────────────▼─────────┐  │    │
│  │  │ 5. Return    │◀──│ 4. Translate response to user's    │  │    │
│  │  │ translated   │   │ language (with legal term glossary)│  │    │
│  │  │ response     │   │                                     │  │    │
│  │  └──────────────┘   └─────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Legal Term Glossary (Custom Dictionary)         │    │
│  │  Ensures consistent translation of legal terminology         │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Translation Cache (Redis/Memory)                │    │
│  │  Reduces API costs by caching common translations            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supported Languages

| Code | Language | Native Name | Google Translate Support |
|------|----------|-------------|--------------------------|
| `en` | English | English | ✅ Full |
| `ak` | Akan (Twi) | Akan | ✅ Supported |
| `gaa` | Ga | Gã | ⚠️ Limited |
| `ee` | Ewe | Eʋegbe | ✅ Supported |
| `ha` | Hausa | Hausa | ✅ Full |
| `dag` | Dagbani | Dagbanli | ⚠️ Limited |

---

## Backend Implementation

### Step 1: Install NuGet Packages

```bash
dotnet add package Google.Cloud.Translation.V2
dotnet add package Microsoft.Extensions.Caching.StackExchangeRedis
# Or for in-memory caching:
dotnet add package Microsoft.Extensions.Caching.Memory
```

### Step 2: Configuration

Add Google Cloud settings to `appsettings.json`:

```json
{
  "GoogleCloud": {
    "TranslationApiKey": "YOUR_GOOGLE_CLOUD_API_KEY",
    "ProjectId": "your-project-id"
  },
  "TranslationSettings": {
    "CacheExpirationHours": 24,
    "EnableCaching": true,
    "MaxCacheSize": 10000
  },
  "ConnectionStrings": {
    "Redis": "localhost:6379"
  }
}
```

### Step 3: Create Translation Service

```csharp
// Services/ITranslationService.cs
namespace NsemBot.Services
{
    public interface ITranslationService
    {
        Task<string> TranslateToEnglishAsync(string text, string sourceLanguage);
        Task<string> TranslateFromEnglishAsync(string text, string targetLanguage);
        Task<string> DetectLanguageAsync(string text);
        IEnumerable<SupportedLanguage> GetSupportedLanguages();
    }

    public class SupportedLanguage
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string NativeName { get; set; }
    }
}
```

```csharp
// Services/GoogleTranslationService.cs
using Google.Cloud.Translation.V2;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace NsemBot.Services
{
    public class GoogleTranslationService : ITranslationService
    {
        private readonly TranslationClient _client;
        private readonly IMemoryCache _cache;
        private readonly ILegalGlossaryService _glossary;
        private readonly ILogger<GoogleTranslationService> _logger;
        private readonly int _cacheExpirationHours;

        private static readonly List<SupportedLanguage> _supportedLanguages = new()
        {
            new() { Code = "en", Name = "English", NativeName = "English" },
            new() { Code = "ak", Name = "Akan (Twi)", NativeName = "Akan" },
            new() { Code = "gaa", Name = "Ga", NativeName = "Gã" },
            new() { Code = "ee", Name = "Ewe", NativeName = "Eʋegbe" },
            new() { Code = "ha", Name = "Hausa", NativeName = "Hausa" },
            new() { Code = "dag", Name = "Dagbani", NativeName = "Dagbanli" }
        };

        public GoogleTranslationService(
            IConfiguration config,
            IMemoryCache cache,
            ILegalGlossaryService glossary,
            ILogger<GoogleTranslationService> logger)
        {
            var apiKey = config["GoogleCloud:TranslationApiKey"];
            _client = TranslationClient.CreateFromApiKey(apiKey);
            _cache = cache;
            _glossary = glossary;
            _logger = logger;
            _cacheExpirationHours = config.GetValue<int>("TranslationSettings:CacheExpirationHours", 24);
        }

        public IEnumerable<SupportedLanguage> GetSupportedLanguages() => _supportedLanguages;

        public async Task<string> TranslateToEnglishAsync(string text, string sourceLanguage)
        {
            if (string.IsNullOrWhiteSpace(text) || sourceLanguage == "en")
                return text;

            if (!IsLanguageSupported(sourceLanguage))
            {
                _logger.LogWarning("Unsupported language: {Language}", sourceLanguage);
                return text;
            }

            var cacheKey = GenerateCacheKey(text, sourceLanguage, "en");

            if (_cache.TryGetValue(cacheKey, out string cachedTranslation))
            {
                _logger.LogDebug("Cache hit for translation: {CacheKey}", cacheKey);
                return cachedTranslation;
            }

            try
            {
                var response = await _client.TranslateTextAsync(
                    text,
                    targetLanguage: "en",
                    sourceLanguage: sourceLanguage
                );

                var translation = response.TranslatedText;

                // Cache the translation
                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(_cacheExpirationHours))
                    .SetSlidingExpiration(TimeSpan.FromHours(1));

                _cache.Set(cacheKey, translation, cacheOptions);

                _logger.LogInformation(
                    "Translated from {Source} to English: {CharCount} characters",
                    sourceLanguage, text.Length);

                return translation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Translation to English failed for language {Lang}", sourceLanguage);
                return text; // Return original on failure
            }
        }

        public async Task<string> TranslateFromEnglishAsync(string text, string targetLanguage)
        {
            if (string.IsNullOrWhiteSpace(text) || targetLanguage == "en")
                return text;

            if (!IsLanguageSupported(targetLanguage))
            {
                _logger.LogWarning("Unsupported target language: {Language}", targetLanguage);
                return text;
            }

            // Apply legal glossary before translation
            var textWithGlossary = _glossary.PreProcessForTranslation(text, targetLanguage);

            var cacheKey = GenerateCacheKey(textWithGlossary, "en", targetLanguage);

            if (_cache.TryGetValue(cacheKey, out string cachedTranslation))
            {
                return _glossary.PostProcessTranslation(cachedTranslation, targetLanguage);
            }

            try
            {
                var response = await _client.TranslateTextAsync(
                    textWithGlossary,
                    targetLanguage: targetLanguage,
                    sourceLanguage: "en"
                );

                var translation = _glossary.PostProcessTranslation(
                    response.TranslatedText, 
                    targetLanguage
                );

                var cacheOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromHours(_cacheExpirationHours))
                    .SetSlidingExpiration(TimeSpan.FromHours(1));

                _cache.Set(cacheKey, translation, cacheOptions);

                _logger.LogInformation(
                    "Translated from English to {Target}: {CharCount} characters",
                    targetLanguage, text.Length);

                return translation;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Translation from English failed for language {Lang}", targetLanguage);
                return text;
            }
        }

        public async Task<string> DetectLanguageAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "en";

            try
            {
                var detection = await _client.DetectLanguageAsync(text);
                var detected = detection.Language;

                return IsLanguageSupported(detected) ? detected : "en";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Language detection failed");
                return "en";
            }
        }

        private bool IsLanguageSupported(string code) =>
            _supportedLanguages.Any(l => l.Code == code);

        private string GenerateCacheKey(string text, string source, string target) =>
            $"trans_{source}_{target}_{text.GetHashCode():X8}";
    }
}
```

### Step 4: Create Legal Glossary Service

```csharp
// Services/ILegalGlossaryService.cs
namespace NsemBot.Services
{
    public interface ILegalGlossaryService
    {
        string PreProcessForTranslation(string text, string targetLanguage);
        string PostProcessTranslation(string text, string targetLanguage);
    }
}
```

```csharp
// Services/LegalGlossaryService.cs
using System.Text.RegularExpressions;

namespace NsemBot.Services
{
    public class LegalGlossaryService : ILegalGlossaryService
    {
        // Legal terms that should be consistently translated
        // Format: English term -> { language code -> translation }
        private static readonly Dictionary<string, Dictionary<string, string>> Glossary = new()
        {
            ["Constitution"] = new()
            {
                { "ak", "Ahyɛde Nhyehyɛe" },
                { "gaa", "Sɛɛlɔ Wolo" },
                { "ee", "Dukɔ ƒe Se" },
                { "ha", "Kundin Tsarin Mulki" }
            },
            ["constitutional"] = new()
            {
                { "ak", "ahyɛde nhyehyɛe" },
                { "ee", "dukɔ ƒe se" }
            },
            ["Labour Act"] = new()
            {
                { "ak", "Adwumayɛ Mmara" },
                { "gaa", "Dɔŋ Fɛɛmɔ Wolo" },
                { "ee", "Dɔwɔwɔ Se" },
                { "ha", "Dokar Aiki" }
            },
            ["fundamental rights"] = new()
            {
                { "ak", "ɛtene hokwan" },
                { "ee", "gomekpɔkpɔ titiawo" },
                { "ha", "hakkin ɗan adam" }
            },
            ["citizen"] = new()
            {
                { "ak", "ɔmannifo" },
                { "ee", "dukɔmetɔ" },
                { "ha", "ɗan ƙasa" }
            },
            ["court"] = new()
            {
                { "ak", "asɛnnibea" },
                { "gaa", "asaase shia" },
                { "ee", "ʋɔnu" },
                { "ha", "kotu" }
            },
            ["judge"] = new()
            {
                { "ak", "otemmufo" },
                { "ee", "ʋɔnudrɔ̃la" },
                { "ha", "alƙali" }
            },
            ["lawyer"] = new()
            {
                { "ak", "mmaranimfo" },
                { "gaa", "mlijinɛ" },
                { "ee", "sefiala" },
                { "ha", "lauya" }
            },
            ["plaintiff"] = new()
            {
                { "ak", "ɔbɔfo" },
                { "ee", "amanyitɔ" }
            },
            ["defendant"] = new()
            {
                { "ak", "ɔfotuafo" },
                { "ee", "amanyinu" }
            },
            ["evidence"] = new()
            {
                { "ak", "adansedie" },
                { "ee", "dalehe" },
                { "ha", "shaida" }
            },
            ["verdict"] = new()
            {
                { "ak", "atemmuda" },
                { "ee", "ʋɔnugbegbɔgbɔ" }
            },
            ["appeal"] = new()
            {
                { "ak", "mpɛɛbɔ" },
                { "ee", "ɖokuiwɔwɔ" },
                { "ha", "daukaka ƙara" }
            },
            ["Article"] = new()
            {
                { "ak", "Nkyerɛwde" },
                { "ee", "Akpa" },
                { "ha", "Sashe" }
            },
            ["Section"] = new()
            {
                { "ak", "Ɔfã" },
                { "ee", "Akpa" }
            },
            ["bail"] = new()
            {
                { "ak", "ahoboa" },
                { "ee", "aƒeɖoƒe" },
                { "ha", "beli" }
            },
            ["imprisonment"] = new()
            {
                { "ak", "ɔfiase" },
                { "ee", "gaxɔƒe" },
                { "ha", "ɗaurin kurkuku" }
            },
            ["fine"] = new()
            {
                { "ak", "mpontuo" },
                { "ee", "tɔxɛ" },
                { "ha", "tara" }
            },
            ["inheritance"] = new()
            {
                { "ak", "agyapadeɛ" },
                { "ee", "domenyinu" },
                { "ha", "gado" }
            },
            ["property"] = new()
            {
                { "ak", "agyapadeɛ" },
                { "ee", "nɔnɔme" },
                { "ha", "dukiya" }
            },
            ["marriage"] = new()
            {
                { "ak", "aware" },
                { "ee", "srɔ̃me" },
                { "ha", "aure" }
            },
            ["divorce"] = new()
            {
                { "ak", "awaregyae" },
                { "ee", "srɔ̃megblẽ" },
                { "ha", "saki" }
            }
        };

        // Placeholder format for protected terms
        private const string PlaceholderFormat = "[[LEGAL_{0}]]";

        public string PreProcessForTranslation(string text, string targetLanguage)
        {
            if (!Glossary.Values.Any(v => v.ContainsKey(targetLanguage)))
                return text;

            var result = text;
            var index = 0;

            foreach (var term in Glossary.Keys.OrderByDescending(k => k.Length))
            {
                if (Glossary[term].ContainsKey(targetLanguage))
                {
                    // Use case-insensitive replacement
                    var pattern = $@"\b{Regex.Escape(term)}\b";
                    var placeholder = string.Format(PlaceholderFormat, index++);
                    result = Regex.Replace(result, pattern, placeholder, RegexOptions.IgnoreCase);
                }
            }

            return result;
        }

        public string PostProcessTranslation(string text, string targetLanguage)
        {
            var result = text;
            var index = 0;

            foreach (var term in Glossary.Keys.OrderByDescending(k => k.Length))
            {
                if (Glossary[term].TryGetValue(targetLanguage, out var translation))
                {
                    var placeholder = string.Format(PlaceholderFormat, index++);
                    result = result.Replace(placeholder, translation);
                }
            }

            return result;
        }
    }
}
```

### Step 5: Update Chat Controller

```csharp
// Controllers/ChatController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using NsemBot.Services;
using NsemBot.DTOs;

namespace NsemBot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly ITranslationService _translationService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(
            IChatService chatService,
            ITranslationService translationService,
            ILogger<ChatController> logger)
        {
            _chatService = chatService;
            _translationService = translationService;
            _logger = logger;
        }

        /// <summary>
        /// Send a chat message with optional language translation
        /// </summary>
        [HttpPost("send")]
        public async Task<ActionResult<ChatResponseDto>> SendMessage(
            [FromBody] ChatMessageInputDto input)
        {
            try
            {
                var language = input.Language ?? "en";
                
                _logger.LogInformation(
                    "Processing message in language: {Language}, Session: {SessionId}",
                    language, input.SessionId);

                // Step 1: Translate user message to English (if needed)
                var englishMessage = await _translationService.TranslateToEnglishAsync(
                    input.Message,
                    language
                );

                // Step 2: Process with AI backend (existing logic)
                var response = await _chatService.ProcessMessageAsync(
                    englishMessage,
                    input.SessionId,
                    input.DocumentContext
                );

                // Step 3: Translate response back to user's language
                var translatedResponse = await _translationService.TranslateFromEnglishAsync(
                    response.Message,
                    language
                );

                return Ok(new ChatResponseDto
                {
                    Message = translatedResponse,
                    OriginalMessage = response.Message, // Keep English for reference
                    SessionId = response.SessionId,
                    Timestamp = DateTime.UtcNow,
                    Language = language
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing chat message");
                return StatusCode(500, new { error = "Failed to process message" });
            }
        }

        /// <summary>
        /// Get list of supported languages
        /// </summary>
        [HttpGet("languages")]
        public ActionResult<IEnumerable<SupportedLanguage>> GetSupportedLanguages()
        {
            return Ok(_translationService.GetSupportedLanguages());
        }

        /// <summary>
        /// Detect language of text
        /// </summary>
        [HttpPost("detect-language")]
        public async Task<ActionResult<LanguageDetectionResult>> DetectLanguage(
            [FromBody] DetectLanguageRequest request)
        {
            var language = await _translationService.DetectLanguageAsync(request.Text);
            return Ok(new LanguageDetectionResult { Language = language });
        }
    }
}
```

### Step 6: DTOs

```csharp
// DTOs/ChatDtos.cs
namespace NsemBot.DTOs
{
    public class ChatMessageInputDto
    {
        public string SessionId { get; set; }
        public string Message { get; set; }
        public string DocumentContext { get; set; }
        public string Language { get; set; } = "en";
    }

    public class ChatResponseDto
    {
        public string Message { get; set; }
        public string OriginalMessage { get; set; } // English version
        public string SessionId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Language { get; set; }
    }

    public class DetectLanguageRequest
    {
        public string Text { get; set; }
    }

    public class LanguageDetectionResult
    {
        public string Language { get; set; }
    }
}
```

### Step 7: Register Services

```csharp
// Program.cs
using NsemBot.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ILegalGlossaryService, LegalGlossaryService>();
builder.Services.AddScoped<ITranslationService, GoogleTranslationService>();

// Or with Redis for distributed caching:
// builder.Services.AddStackExchangeRedisCache(options =>
// {
//     options.Configuration = builder.Configuration.GetConnectionString("Redis");
// });

var app = builder.Build();
```

---

## Frontend Changes (Minimal)

### Step 1: Update API Client DTO

```typescript
// src/app/services/api-client.ts (add language field)
export class ChatMessageInputDto {
  sessionId?: string;
  message?: string;
  documentContext?: string;
  language?: string = 'en';  // Add this
}

export class ChatResponseDto {
  message?: string;
  originalMessage?: string;  // Add this - English version
  sessionId?: string;
  timestamp?: Date;
  language?: string;  // Add this
}
```

### Step 2: Update Chat API Service

```typescript
// src/app/services/chat-api.service.ts
sendMessage(
  message: string,
  documentContext?: string,
  language: string = 'en'
): Observable<ChatMessage> {
  const chatInput = new ChatMessageInputDto();
  chatInput.sessionId = this.currentSessionId!;
  chatInput.message = message;
  chatInput.documentContext = documentContext;
  chatInput.language = language;  // Add language to request

  return this.serviceProxy.sendMessage(chatInput).pipe(
    switchMap(() => this.getLatestBotResponse(this.currentSessionId!)),
    catchError((error) => {
      this.toastService.error("Failed to send message. Please try again.");
      return of(this.createErrorMessage());
    }),
  );
}

// Add method to get supported languages
getSupportedLanguages(): Observable<SupportedLanguage[]> {
  return this.http.get<SupportedLanguage[]>('/api/chat/languages');
}
```

### Step 3: Simple Language Selector Component

```typescript
// src/app/shared/language-selector/language-selector.component.ts
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select 
      [(ngModel)]="selectedLanguage" 
      (ngModelChange)="onLanguageChange($event)"
      class="px-3 py-2 border border-gray-300 rounded-lg text-sm
             focus:ring-2 focus:ring-primary-500 focus:border-transparent
             bg-white cursor-pointer">
      <option *ngFor="let lang of languages" [value]="lang.code">
        {{ lang.nativeName }}
      </option>
    </select>
  `
})
export class LanguageSelectorComponent implements OnInit {
  @Input() selectedLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  languages: SupportedLanguage[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ak', name: 'Akan (Twi)', nativeName: 'Akan' },
    { code: 'gaa', name: 'Ga', nativeName: 'Gã' },
    { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'dag', name: 'Dagbani', nativeName: 'Dagbanli' }
  ];

  ngOnInit(): void {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved) {
      this.selectedLanguage = saved;
      this.languageChange.emit(saved);
    }
  }

  onLanguageChange(langCode: string): void {
    this.languageChange.emit(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  }
}
```

### Step 4: Update Chat Component

```typescript
// src/app/pages/chat/chat.component.ts
selectedLanguage: string = 'en';

constructor(...) {
  this.selectedLanguage = localStorage.getItem('preferredLanguage') || 'en';
}

onLanguageChange(langCode: string): void {
  this.selectedLanguage = langCode;
}

onSendMessage(message: string): void {
  // ... existing validation ...

  const userMessage = new ChatMessage();
  userMessage.message = message;
  userMessage.isFromUser = true;
  this.messages.push(userMessage);

  this.isLoading = true;

  // Send with language code - backend handles translation
  this.chatApiService.sendMessage(message, this.selectedDocument?.id, this.selectedLanguage)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(response => {
      this.messages.push(response);
    });
}
```

---

## Legal Glossary Terms

The following legal terms have custom translations to ensure consistency:

| English | Twi (ak) | Ga (gaa) | Ewe (ee) | Hausa (ha) |
|---------|----------|----------|----------|------------|
| Constitution | Ahyɛde Nhyehyɛe | Sɛɛlɔ Wolo | Dukɔ ƒe Se | Kundin Tsarin Mulki |
| Labour Act | Adwumayɛ Mmara | Dɔŋ Fɛɛmɔ Wolo | Dɔwɔwɔ Se | Dokar Aiki |
| court | asɛnnibea | asaase shia | ʋɔnu | kotu |
| judge | otemmufo | - | ʋɔnudrɔ̃la | alƙali |
| lawyer | mmaranimfo | mlijinɛ | sefiala | lauya |
| evidence | adansedie | - | dalehe | shaida |
| citizen | ɔmannifo | - | dukɔmetɔ | ɗan ƙasa |
| inheritance | agyapadeɛ | - | domenyinu | gado |
| marriage | aware | - | srɔ̃me | aure |
| divorce | awaregyae | - | srɔ̃megblẽ | saki |

---

## Caching Strategy

### In-Memory Cache (Single Server)

```csharp
// Good for: Development, single-server deployments
builder.Services.AddMemoryCache();
```

### Redis Cache (Multi-Server / Production)

```csharp
// Good for: Production, load-balanced environments
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "NsemBot_";
});
```

### Cache Key Strategy

```
trans_{sourceLanguage}_{targetLanguage}_{contentHash}
Example: trans_en_ak_A1B2C3D4
```

### Cache Configuration

| Setting | Recommended Value | Description |
|---------|-------------------|-------------|
| Absolute Expiration | 24 hours | Maximum time in cache |
| Sliding Expiration | 1 hour | Extended if accessed |
| Max Cache Size | 10,000 entries | Prevents memory issues |

---

## API Cost Optimization

### Google Cloud Translation Pricing

| Tier | Price |
|------|-------|
| First 500K chars/month | Free |
| 500K - 1B chars/month | $20/million chars |
| 1B+ chars/month | Contact Google |

### Cost Reduction Strategies

1. **Caching** - Cache all translations (24h expiry)
2. **Batch requests** - Group multiple translations
3. **Skip English** - Don't translate en→en
4. **Compress whitespace** - Reduce character count
5. **Common phrases** - Pre-translate common legal phrases

### Estimated Monthly Costs

| Users | Messages/User | Avg Chars | Total Chars | Est. Cost |
|-------|---------------|-----------|-------------|-----------|
| 100 | 50 | 500 | 5M | $100 |
| 500 | 50 | 500 | 25M | $500 |
| 1000 | 50 | 500 | 50M | $1,000 |

*With 80% cache hit rate, actual costs reduce by 80%*

---

## Testing

### Unit Tests

```csharp
// Tests/Services/TranslationServiceTests.cs
[TestClass]
public class TranslationServiceTests
{
    private Mock<IMemoryCache> _cacheMock;
    private Mock<ILegalGlossaryService> _glossaryMock;
    private GoogleTranslationService _service;

    [TestMethod]
    public async Task TranslateToEnglish_ReturnsOriginal_WhenSourceIsEnglish()
    {
        var result = await _service.TranslateToEnglishAsync("Hello", "en");
        Assert.AreEqual("Hello", result);
    }

    [TestMethod]
    public async Task TranslateToEnglish_ReturnsCached_WhenAvailable()
    {
        // Setup cache to return cached value
        var cacheEntry = Mock.Of<ICacheEntry>();
        _cacheMock.Setup(c => c.TryGetValue(It.IsAny<object>(), out It.Ref<object>.IsAny))
            .Returns(true)
            .Callback((object key, out object value) => value = "Cached translation");

        var result = await _service.TranslateToEnglishAsync("Test", "ak");
        Assert.AreEqual("Cached translation", result);
    }
}
```

### Integration Tests

```csharp
// Tests/Controllers/ChatControllerTests.cs
[TestClass]
public class ChatControllerIntegrationTests
{
    [TestMethod]
    public async Task SendMessage_WithTwiLanguage_ReturnsTranslatedResponse()
    {
        var client = _factory.CreateClient();
        var request = new ChatMessageInputDto
        {
            SessionId = "test-session",
            Message = "Mepɛ sɛ menim me hokwan", // "I want to know my rights" in Twi
            Language = "ak"
        };

        var response = await client.PostAsJsonAsync("/api/chat/send", request);
        
        Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<ChatResponseDto>();
        Assert.AreEqual("ak", result.Language);
        Assert.IsNotNull(result.OriginalMessage); // English version should be present
    }
}
```

---

## Pros and Cons

### Advantages

| Advantage | Description |
|-----------|-------------|
| ✅ Secure credentials | API key never exposed to client |
| ✅ Legal term control | Custom glossary ensures accuracy |
| ✅ Server-side caching | Massive cost reduction |
| ✅ Centralized logic | All translation in one place |
| ✅ Analytics | Track language usage on server |
| ✅ Quality control | Can post-process translations |
| ✅ Scalable | Handle high traffic efficiently |

### Disadvantages

| Disadvantage | Description |
|--------------|-------------|
| ⚠️ Backend changes | Requires API deployment |
| ⚠️ Added latency | ~200-500ms per translation |
| ⚠️ Implementation time | 2-4 weeks |
| ⚠️ Server resources | Additional memory for cache |

---

## Files to Create/Modify

### Backend (New Files)

| File | Description |
|------|-------------|
| `Services/ITranslationService.cs` | Interface |
| `Services/GoogleTranslationService.cs` | Implementation |
| `Services/ILegalGlossaryService.cs` | Glossary interface |
| `Services/LegalGlossaryService.cs` | Legal terms dictionary |
| `DTOs/ChatDtos.cs` | Updated DTOs |
| `Tests/Services/TranslationServiceTests.cs` | Unit tests |

### Backend (Modified Files)

| File | Changes |
|------|---------|
| `Controllers/ChatController.cs` | Add translation pipeline |
| `Program.cs` | Register new services |
| `appsettings.json` | Add Google Cloud config |

### Frontend (Modified Files)

| File | Changes |
|------|---------|
| `src/app/services/api-client.ts` | Add language field to DTO |
| `src/app/services/chat-api.service.ts` | Pass language parameter |
| `src/app/shared/language-selector/` | Create simple component |
| `src/app/pages/chat/chat.component.ts` | Add language state |
| `src/app/pages/chat/chat.component.html` | Add language selector |

---

## Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Backend: TranslationService, LegalGlossaryService |
| Week 2 | Backend: Controller updates, caching, unit tests |
| Week 3 | Frontend: Language selector, API integration |
| Week 4 | Testing, deployment, monitoring setup |

---

## Monitoring & Logging

### Recommended Metrics

```csharp
// Log translation events for monitoring
_logger.LogInformation(
    "Translation: {Direction} {SourceLang}->{TargetLang}, " +
    "Chars: {CharCount}, Cached: {IsCached}, Duration: {Duration}ms",
    direction, sourceLang, targetLang, charCount, isCached, duration);
```

### Dashboard Metrics

- Total translations per day
- Cache hit ratio
- Average translation latency
- API costs by language
- Errors by language

---

## Security Considerations

1. **API Key Storage** - Store in Azure Key Vault or environment variables
2. **Rate Limiting** - Implement per-user rate limits
3. **Input Validation** - Sanitize input before translation
4. **Audit Logging** - Log all translation requests

---

*Document Version: 1.0*
*Last Updated: March 2026*
*Recommendation: This backend approach is recommended for production use.*
