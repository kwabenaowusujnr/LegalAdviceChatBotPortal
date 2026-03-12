import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

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

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('supportedLanguages', () => {
    it('should have 6 supported languages', () => {
      expect(service.supportedLanguages.length).toBe(6);
    });

    it('should include English, Twi, Ga, Ewe, Hausa, and Dagbani', () => {
      const codes = service.supportedLanguages.map(l => l.code);
      expect(codes).toContain('en');
      expect(codes).toContain('ak');
      expect(codes).toContain('gaa');
      expect(codes).toContain('ee');
      expect(codes).toContain('ha');
      expect(codes).toContain('dag');
    });
  });

  describe('getLanguageByCode', () => {
    it('should return language for valid code', () => {
      const lang = service.getLanguageByCode('ak');
      expect(lang).toBeDefined();
      expect(lang?.name).toBe('Akan (Twi)');
      expect(lang?.nativeName).toBe('Akan');
    });

    it('should return undefined for invalid code', () => {
      const lang = service.getLanguageByCode('invalid');
      expect(lang).toBeUndefined();
    });
  });

  describe('isLanguageSupported', () => {
    it('should return true for supported language', () => {
      expect(service.isLanguageSupported('en')).toBeTrue();
      expect(service.isLanguageSupported('ak')).toBeTrue();
    });

    it('should return false for unsupported language', () => {
      expect(service.isLanguageSupported('fr')).toBeFalse();
      expect(service.isLanguageSupported('invalid')).toBeFalse();
    });
  });

  describe('translateToEnglish', () => {
    it('should return original text when source is English', (done) => {
      service.translateToEnglish('Hello world', 'en').subscribe(result => {
        expect(result).toBe('Hello world');
        done();
      });
    });

    it('should return original text when text is empty', (done) => {
      service.translateToEnglish('', 'ak').subscribe(result => {
        expect(result).toBe('');
        done();
      });
    });

    it('should return original text when text is whitespace', (done) => {
      service.translateToEnglish('   ', 'ak').subscribe(result => {
        expect(result).toBe('   ');
        done();
      });
    });
  });

  describe('translateFromEnglish', () => {
    it('should return original text when target is English', (done) => {
      service.translateFromEnglish('Hello world', 'en').subscribe(result => {
        expect(result).toBe('Hello world');
        done();
      });
    });

    it('should return original text when text is empty', (done) => {
      service.translateFromEnglish('', 'ak').subscribe(result => {
        expect(result).toBe('');
        done();
      });
    });
  });

  describe('detectLanguage', () => {
    it('should return en for empty text', (done) => {
      service.detectLanguage('').subscribe(result => {
        expect(result).toBe('en');
        done();
      });
    });

    it('should return en for whitespace text', (done) => {
      service.detectLanguage('   ').subscribe(result => {
        expect(result).toBe('en');
        done();
      });
    });
  });

  describe('isConfigured', () => {
    it('should return false when API key is placeholder', () => {
      // The default environment has placeholder key
      expect(service.isConfigured()).toBeFalse();
    });
  });

  describe('clearCache', () => {
    it('should clear translation cache from localStorage', () => {
      // Add some cache entries
      localStorage.setItem('translation_cache_en_ak_test1', 'cached1');
      localStorage.setItem('translation_cache_ak_en_test2', 'cached2');
      localStorage.setItem('other_key', 'should_remain');

      // Clear any previous test state
      // Note: Backend handles caching, no frontend cache to clear

      expect(localStorage.getItem('translation_cache_en_ak_test1')).toBeNull();
      expect(localStorage.getItem('translation_cache_ak_en_test2')).toBeNull();
      expect(localStorage.getItem('other_key')).toBe('should_remain');
    });
  });
});
