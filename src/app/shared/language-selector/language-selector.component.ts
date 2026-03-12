import { Component, EventEmitter, Output, Input, OnInit, HostListener, ElementRef } from '@angular/core';
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
        (click)="toggleDropdown($event)"
        class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300
               rounded-full hover:bg-gray-50 transition-colors text-xs font-medium
               focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-1"
        [class.ring-2]="isOpen"
        [class.ring-forest]="isOpen">
        <lucide-icon [img]="GlobeIcon" class="w-3.5 h-3.5 text-gray-500"></lucide-icon>
        <span class="hidden sm:inline">{{ getCurrentLanguageName() }}</span>
        <span class="sm:hidden">{{ getCurrentLanguageCode() }}</span>
        <lucide-icon
          [img]="ChevronDownIcon"
          class="w-3 h-3 text-gray-400 transition-transform duration-200"
          [class.rotate-180]="isOpen">
        </lucide-icon>
      </button>

      <div
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg
               border border-gray-200 py-1 z-50 animate-fadeIn">
        <div class="px-3 py-2 border-b border-gray-100">
          <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Select Language
          </span>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <button
            *ngFor="let lang of languages"
            (click)="selectLanguage(lang.code)"
            class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50
                   flex items-center justify-between transition-colors"
            [class.bg-forest]="selectedLanguage === lang.code"
            [class.bg-opacity-10]="selectedLanguage === lang.code"
            [class.text-forest]="selectedLanguage === lang.code">
            <div class="flex flex-col">
              <span class="font-medium">{{ lang.nativeName }}</span>
              <span class="text-xs text-gray-400" *ngIf="lang.code !== 'en'">{{ lang.name }}</span>
            </div>
            <svg
              *ngIf="selectedLanguage === lang.code"
              class="w-4 h-4 text-forest"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
        <div *ngIf="!isConfigured" class="px-3 py-2 border-t border-gray-100 bg-amber-50">
          <span class="text-xs text-amber-700">
            ⚠️ Translation API not configured
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fadeIn {
      animation: fadeIn 0.15s ease-out;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  @Input() selectedLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  languages: SupportedLanguage[];
  isOpen = false;
  isConfigured = false;

  // Icons
  readonly GlobeIcon = Globe;
  readonly ChevronDownIcon = ChevronDown;

  constructor(
    private translationService: TranslationService,
    private elementRef: ElementRef
  ) {
    this.languages = this.translationService.supportedLanguages;
    this.isConfigured = this.translationService.isConfigured();
  }

  ngOnInit(): void {
    // Load saved preference
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && this.translationService.isLanguageSupported(saved)) {
      this.selectedLanguage = saved;
      // Emit initial language on load
      this.languageChange.emit(saved);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
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

  getCurrentLanguageCode(): string {
    return this.selectedLanguage.toUpperCase();
  }
}
