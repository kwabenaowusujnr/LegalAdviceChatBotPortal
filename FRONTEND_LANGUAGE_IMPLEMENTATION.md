# Frontend Implementation Plan: Ghanaian Local Language Support

## Overview

This document outlines the frontend-based approach for implementing Ghanaian local language support (Twi, Ga, Ewe, Hausa, Dagbani) in NsemBot using Google Cloud Translation API.

---

## Architecture

Translation occurs entirely in the Angular frontend using the Google Cloud Translation API directly from the browser.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ANGULAR FRONTEND                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  TranslationService                          │    │
│  │  ┌───────────────┐    ┌──────────────────────────────────┐  │    │
│  │  │ Language      │    │ Google Cloud Translation API     │  │    │
│  │  │ Selector      │───▶│ (REST calls from browser)        │  │    │
│  │  │ (Twi/Ga/Ewe)  │    └──────────────────────────────────┘  │    │
│  │  └───────────────┘                                           │    │
│  │                                                               │    │
│  │  User Input ──▶ Translate to EN ──▶ Send to API             │    │
│  │  API Response ◀── Translate to Local ◀── Receive from API   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ (English only)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (Unchanged)                          │
│                     Processes English messages only                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Supported Languages

| Code | Language | Native Name |
|------|----------|-------------|
| `en` | English | English |
| `ak` | Akan (Twi) | Akan |
| `gaa` | Ga | Gã |
| `ee` | Ewe | Eʋegbe |
| `ha` | Hausa | Hausa |
| `dag` | Dagbani | Dagbanli |

---

## Implementation Steps

### Step 1: Environment Configuration

Add Google Cloud Translation API key to environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000',
  googleTranslateApiKey: 'YOUR_GOOGLE_CLOUD_API_KEY'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.nsembot.com',
  googleTranslateApiKey: 'YOUR_PRODUCTION_API_KEY'
};
```

### Step 2: Create Translation Service

Create a new service to handle all translation operations:

```typescript
// src/app/services/translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly API_URL = 'https://translation.googleapis.com/language/translate/v2';
  private readonly API_KEY = environment.googleTranslateApiKey;

  readonly supportedLanguages: SupportedLanguage[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ak', name: 'Akan (Twi)', nativeName: 'Akan' },
    { code: 'gaa', name: 'Ga', nativeName: 'Gã' },
    { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'dag', name: 'Dagbani', nativeName: 'Dagbanli' }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Get language by code
   */
  getLanguageByCode(code: string): SupportedLanguage | undefined {
    return this.supportedLanguages.find(lang => lang.code === code);
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(code: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === code);
  }

  /**
   * Translate text to English for backend processing
   */
  translateToEnglish(text: string, sourceLanguage: string): Observable<string> {
    if (sourceLanguage === 'en' || !text.trim()) {
      return of(text);
    }
    return this.translate(text, sourceLanguage, 'en');
  }

  /**
   * Translate English response to user's language
   */
  translateFromEnglish(text: string, targetLanguage: string): Observable<string> {
    if (targetLanguage === 'en' || !text.trim()) {
      return of(text);
    }
    return this.translate(text, 'en', targetLanguage);
  }

  /**
   * Core translation method using Google Cloud Translation API
   */
  private translate(text: string, source: string, target: string): Observable<string> {
    const url = `${this.API_URL}?key=${this.API_KEY}`;
    const body = {
      q: text,
      source: source,
      target: target,
      format: 'text'
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response?.data?.translations?.[0]?.translatedText) {
          return response.data.translations[0].translatedText;
        }
        return text;
      }),
      catchError(error => {
        console.error('Translation error:', error);
        return of(text); // Return original text if translation fails
      })
    );
  }

  /**
   * Translate multiple texts at once (batch translation)
   */
  translateBatch(texts: string[], source: string, target: string): Observable<string[]> {
    if (source === target || texts.length === 0) {
      return of(texts);
    }

    const url = `${this.API_URL}?key=${this.API_KEY}`;
    const body = {
      q: texts,
      source: source,
      target: target,
      format: 'text'
    };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response?.data?.translations) {
          return response.data.translations.map((t: any) => t.translatedText);
        }
        return texts;
      }),
      catchError(error => {
        console.error('Batch translation error:', error);
        return of(texts);
      })
    );
  }

  /**
   * Detect language of input text
   */
  detectLanguage(text: string): Observable<string> {
    if (!text.trim()) {
      return of('en');
    }

    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${this.API_KEY}`;
    const body = { q: text };

    return this.http.post<any>(url, body).pipe(
      map(response => {
        if (response?.data?.detections?.[0]?.[0]?.language) {
          const detected = response.data.detections[0][0].language;
          // Return detected language only if it's supported
          return this.isLanguageSupported(detected) ? detected : 'en';
        }
        return 'en';
      }),
      catchError(() => of('en'))
    );
  }
}
```

### Step 3: Create Language Selector Component

```typescript
// src/app/shared/language-selector/language-selector.component.ts
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService, SupportedLanguage } from '../../services/translation.service';
import { LucideAngularModule, Globe, ChevronDown } from 'lucide-angular';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="language-selector relative">
      <button 
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 
               rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium
               focus:outline-none focus:ring-2 focus:ring-primary-500">
        <lucide-icon name="globe" [size]="16" class="text-gray-500"></lucide-icon>
        <span>{{ getCurrentLanguageName() }}</span>
        <lucide-icon name="chevron-down" [size]="14" class="text-gray-400"></lucide-icon>
      </button>
      
      <div 
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
               border border-gray-200 py-1 z-50">
        <button
          *ngFor="let lang of languages"
          (click)="selectLanguage(lang.code)"
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 
                 flex items-center justify-between"
          [class.bg-primary-50]="selectedLanguage === lang.code"
          [class.text-primary-700]="selectedLanguage === lang.code">
          <span>{{ lang.nativeName }}</span>
          <span class="text-gray-400 text-xs">{{ lang.name }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  @Input() selectedLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  languages: SupportedLanguage[];
  isOpen = false;

  constructor(private translationService: TranslationService) {
    this.languages = this.translationService.supportedLanguages;
  }

  ngOnInit(): void {
    // Load saved preference
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && this.translationService.isLanguageSupported(saved)) {
      this.selectedLanguage = saved;
      this.languageChange.emit(saved);
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectLanguage(langCode: string): void {
    this.selectedLanguage = langCode;
    this.languageChange.emit(langCode);
    localStorage.setItem('preferredLanguage', langCode);
    this.isOpen = false;
  }

  getCurrentLanguageName(): string {
    const lang = this.translationService.getLanguageByCode(this.selectedLanguage);
    return lang?.nativeName || 'English';
  }
}
```

### Step 4: Integrate into Chat Component

Update the chat component to use translation:

```typescript
// src/app/pages/chat/chat.component.ts (updated sections)
import { TranslationService } from '../../services/translation.service';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    SidebarV2Component,
    ChatInputComponent,
    LucideAngularModule,
    MessageWindowComponent,
    UserMenuComponent,
    TypingIndicatorComponent,
    SignupPromptModalComponent,
    HelpSupportModalComponent,
    LanguageSelectorComponent  // Add this
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked {
  // ... existing properties ...
  
  selectedLanguage: string = 'en';

  constructor(
    private chatApiService: ChatApiService,
    private authService: AuthService,
    private analyticsService: AnalyticsService,
    private translationService: TranslationService  // Add this
  ) {
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.selectedLanguage = savedLang;
    }
  }

  onLanguageChange(langCode: string): void {
    this.selectedLanguage = langCode;
    this.analyticsService.trackEvent(
      'language_change', 
      `Changed language to ${langCode}`, 
      'settings'
    );
  }

  async onSendMessage(message: string): Promise<void> {
    // Track analytics
    this.analyticsService.trackEvent('send_message', 'User sent a message', 'engagement');

    // Check anonymous message limit
    if (!this.authService.isAuthenticated()) {
      if (this.anonymousMessageCount >= this.ANONYMOUS_MESSAGE_LIMIT) {
        this.showSignupPrompt = true;
        return;
      }
      this.anonymousMessageCount++;
    }

    // Show user message in original language
    const userMessage = new ChatMessage();
    userMessage.message = message;
    userMessage.isFromUser = true;
    userMessage.createdAt = new Date();
    this.messages.push(userMessage);

    this.isLoading = true;

    // Translation pipeline
    this.translationService.translateToEnglish(message, this.selectedLanguage)
      .pipe(
        switchMap(englishMessage => {
          // Send English message to backend
          return this.chatApiService.sendMessage(englishMessage, this.selectedDocument?.id);
        }),
        switchMap(response => {
          // Translate response back to user's language
          if (response.message && this.selectedLanguage !== 'en') {
            return this.translationService.translateFromEnglish(
              response.message,
              this.selectedLanguage
            ).pipe(
              map(translatedMessage => {
                response.message = translatedMessage;
                return response;
              })
            );
          }
          return of(response);
        }),
        catchError(error => {
          console.error('Error in message pipeline:', error);
          this.toastService.error('Failed to process message. Please try again.');
          return of(this.createErrorMessage());
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(translatedResponse => {
        this.messages.push(translatedResponse);
      });
  }

  private createErrorMessage(): ChatMessage {
    const errorMsg = new ChatMessage();
    errorMsg.message = this.selectedLanguage === 'en' 
      ? 'Sorry, I encountered an error. Please try again.'
      : 'An error occurred. Please try again.'; // Generic fallback
    errorMsg.isFromUser = false;
    errorMsg.createdAt = new Date();
    return errorMsg;
  }
}
```

### Step 5: Update Chat Component Template

Add the language selector to the chat header:

```html
<!-- src/app/pages/chat/chat.component.html (add to header section) -->
<div class="chat-header flex items-center justify-between p-4 border-b">
  <div class="flex items-center gap-4">
    <h1 class="text-lg font-semibold">NsemBot</h1>
    <!-- Document selector here -->
  </div>
  
  <div class="flex items-center gap-3">
    <!-- Language Selector -->
    <app-language-selector
      [selectedLanguage]="selectedLanguage"
      (languageChange)="onLanguageChange($event)">
    </app-language-selector>
    
    <!-- User menu here -->
  </div>
</div>
```

---

## Voice Input Integration

Update speech recognition to work with selected language:

```typescript
// src/app/services/speech-recognition.service.ts (updated)
setLanguage(langCode: string): void {
  const langMapping: Record<string, string> = {
    'en': 'en-US',
    'ak': 'ak-GH',  // Akan/Twi - may fallback to English
    'gaa': 'gaa-GH', // Ga - limited support
    'ee': 'ee-GH',   // Ewe - limited support
    'ha': 'ha-NG',   // Hausa
    'dag': 'dag-GH'  // Dagbani - limited support
  };
  
  if (this.recognition) {
    this.recognition.lang = langMapping[langCode] || 'en-US';
  }
}
```

> **Note:** Web Speech API has limited support for Ghanaian languages. Users may need to speak in English for voice input, with text responses translated to their preferred language.

---

## Local Storage for Language Preference

The implementation automatically saves and loads the user's language preference:

```typescript
// Save preference
localStorage.setItem('preferredLanguage', langCode);

// Load preference on app init
const savedLang = localStorage.getItem('preferredLanguage') || 'en';
```

---

## Error Handling

The service includes comprehensive error handling:

1. **Network errors** - Returns original text if translation fails
2. **Invalid language codes** - Falls back to English
3. **Empty text** - Returns as-is without API call
4. **API rate limits** - Gracefully degrades

---

## Cost Considerations

Google Cloud Translation API pricing (as of 2026):
- **First 500,000 characters/month**: Free
- **After that**: ~$20 per million characters

**Optimization tips:**
- Cache translations in localStorage for repeated phrases
- Batch translate when possible
- Skip translation for English users

---

## Testing

### Unit Test for Translation Service

```typescript
// src/app/services/translation.service.spec.ts
describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TranslationService]
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should return original text when source is English', (done) => {
    service.translateToEnglish('Hello', 'en').subscribe(result => {
      expect(result).toBe('Hello');
      done();
    });
  });

  it('should call Google API for non-English text', () => {
    service.translateToEnglish('Ɛte sɛn?', 'ak').subscribe();
    
    const req = httpMock.expectOne(r => r.url.includes('translate/v2'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body.source).toBe('ak');
    expect(req.request.body.target).toBe('en');
  });
});
```

---

## Pros and Cons

### Advantages

| Advantage | Description |
|-----------|-------------|
| ✅ No backend changes | Existing API remains unchanged |
| ✅ Faster deployment | Only frontend updates needed |
| ✅ Reduced server load | Translation happens client-side |
| ✅ Easier testing | Can test translations independently |
| ✅ Quick implementation | ~1-2 weeks |

### Disadvantages

| Disadvantage | Description |
|--------------|-------------|
| ❌ API key exposure | Google API key visible in browser (security risk) |
| ❌ Inconsistent quality | Client device affects performance |
| ❌ No legal term control | Cannot customize legal vocabulary |
| ❌ Per-user costs | Each user makes separate API calls |
| ❌ No caching | Limited ability to cache across users |

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/environments/environment.ts` | Add API key |
| `src/environments/environment.prod.ts` | Add API key |
| `src/app/services/translation.service.ts` | Create |
| `src/app/services/translation.service.spec.ts` | Create |
| `src/app/shared/language-selector/language-selector.component.ts` | Create |
| `src/app/pages/chat/chat.component.ts` | Modify |
| `src/app/pages/chat/chat.component.html` | Modify |
| `src/app/services/speech-recognition.service.ts` | Modify |

---

## Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Create TranslationService, Language Selector component |
| Week 2 | Integrate into Chat, testing, deployment |

---

## Security Warning

⚠️ **Important:** Exposing the Google Cloud API key in frontend code is a security risk. Consider:
1. Setting up API key restrictions in Google Cloud Console
2. Implementing rate limiting
3. Monitoring usage for abuse
4. Using the **Backend approach** for production

---

*Document Version: 1.0*
*Last Updated: March 2026*
