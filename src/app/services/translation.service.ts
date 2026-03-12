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

// Backend API DTOs
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
  timestamp: string;
  provider: string;
}

export interface SupportedLanguageDto {
  code: string;
  name: string;
  nativeName: string;
  isSupported: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly BACKEND_API_URL = environment.apiBaseUrl + '/api/translation';

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
   * Translate text using backend API endpoint
   */
  translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    messageId?: number,
    context: string = 'chat'
  ): Observable<TranslationResponseDto> {
    const request: TranslationRequestDto = {
      text,
      sourceLanguage,
      targetLanguage,
      messageId,
      context
    };

    return this.http.post<TranslationResponseDto>(
      `${this.BACKEND_API_URL}/translate`,
      request
    ).pipe(
      catchError(error => {
        console.error('Backend translation API error:', error);
        // Return fallback response
        return of({
          translatedText: text,
          sourceText: text,
          sourceLanguage,
          targetLanguage,
          fromCache: false,
          timestamp: new Date().toISOString(),
          provider: 'Fallback - Backend Unavailable'
        } as TranslationResponseDto);
      })
    );
  }

  /**
   * Translate text to English - now uses backend API
   */
  translateToEnglish(text: string, sourceLanguage: string): Observable<string> {
    if (sourceLanguage === 'en' || !text.trim()) {
      return of(text);
    }

    return this.translateText(text, sourceLanguage, 'en')
      .pipe(map(response => response.translatedText));
  }

  /**
   * Translate English response to user's language - now uses backend API
   */
  translateFromEnglish(text: string, targetLanguage: string): Observable<string> {
    if (targetLanguage === 'en' || !text.trim()) {
      return of(text);
    }

    return this.translateText(text, 'en', targetLanguage)
      .pipe(map(response => response.translatedText));
  }

  /**
   * Get supported languages from backend
   */
  getSupportedLanguagesFromBackend(): Observable<SupportedLanguageDto[]> {
    return this.http.get<SupportedLanguageDto[]>(
      `${this.BACKEND_API_URL}/languages`
    ).pipe(
      catchError(error => {
        console.error('Failed to fetch languages from backend:', error);
        // Return frontend fallback
        return of(this.supportedLanguages.map(lang => ({
          code: lang.code,
          name: lang.name,
          nativeName: lang.nativeName,
          isSupported: true
        })));
      })
    );
  }

  /**
   * Check if backend translation service is healthy
   */
  checkBackendHealth(): Observable<any> {
    return this.http.get(`${this.BACKEND_API_URL}/health`).pipe(
      catchError(error => {
        console.error('Backend translation health check failed:', error);
        return of({ status: 'unhealthy', error: error.message });
      })
    );
  }

  /**
   * Check if translation API is properly configured
   * Now checks backend health instead of API key
   */
  isConfigured(): boolean {
    return true; // Backend handles configuration
  }

  /**
   * Detect language of input text (placeholder for backend implementation)
   */
  detectLanguage(text: string): Observable<string> {
    // TODO: Implement backend language detection endpoint
    // For now, return 'en' as default
    return of('en');
  }
}
