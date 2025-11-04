import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export enum RecognitionState {
  IDLE = 'idle',
  RECORDING = 'recording',
  PROCESSING = 'processing',
  ERROR = 'error'
}

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private shouldRestart = false;

  // Observables for component subscription
  private transcriptSubject = new BehaviorSubject<string>('');
  private interimTranscriptSubject = new BehaviorSubject<string>('');
  private stateSubject = new BehaviorSubject<RecognitionState>(RecognitionState.IDLE);
  private errorSubject = new BehaviorSubject<string>('');

  public transcript$ = this.transcriptSubject.asObservable();
  public interimTranscript$ = this.interimTranscriptSubject.asObservable();
  public state$ = this.stateSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.initializeRecognition();
  }

  /**
   * Check if speech recognition is supported by the browser
   */
  public isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  /**
   * Initialize the speech recognition API
   */
  private initializeRecognition(): void {
    if (!this.isSupported()) {
      console.error('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition settings
    this.recognition.continuous = true; // Keep listening until stopped
    this.recognition.interimResults = true; // Get results while speaking
    this.recognition.lang = 'en-US'; // Set language
    this.recognition.maxAlternatives = 1; // Number of alternative transcripts

    // Set up event handlers
    this.setupEventHandlers();
  }

  /**
   * Set up event handlers for speech recognition
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    // Handle successful speech recognition results
    this.recognition.onresult = (event: any) => {
      console.log('Speech recognition result event:', event);
      let interimTranscript = '';
      let finalTranscript = '';

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        console.log(`Result ${i}: "${transcript}" (final: ${result.isFinal})`);

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update observables
      if (interimTranscript) {
        console.log('Interim transcript:', interimTranscript);
        this.interimTranscriptSubject.next(interimTranscript);
        this.stateSubject.next(RecognitionState.PROCESSING);
      }

      if (finalTranscript) {
        const currentTranscript = this.transcriptSubject.value;
        const newTranscript = currentTranscript ? currentTranscript + ' ' + finalTranscript : finalTranscript;
        console.log('Final transcript:', finalTranscript);
        console.log('Updated full transcript:', newTranscript);
        this.transcriptSubject.next(newTranscript);
        this.interimTranscriptSubject.next('');
        this.stateSubject.next(RecognitionState.RECORDING);
      }
    };

    // Handle recognition start
    this.recognition.onstart = () => {
      this.isListening = true;
      this.shouldRestart = true;
      this.stateSubject.next(RecognitionState.RECORDING);
      this.errorSubject.next('');
      console.log('Speech recognition started');
    };

    // Handle recognition end
    this.recognition.onend = () => {
      console.log('Speech recognition ended');

      // If we should restart (user hasn't clicked stop), restart
      if (this.shouldRestart && this.isListening) {
        console.log('Restarting recognition...');
        setTimeout(() => {
          if (this.shouldRestart && this.isListening) {
            try {
              this.recognition.start();
            } catch (e) {
              console.log('Could not restart recognition:', e);
              this.isListening = false;
              this.shouldRestart = false;
              this.stateSubject.next(RecognitionState.IDLE);
            }
          }
        }, 100);
      } else {
        this.isListening = false;
        this.shouldRestart = false;
        this.stateSubject.next(RecognitionState.IDLE);
      }
    };

    // Handle recognition errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);

      // Handle different error types
      switch (event.error) {
        case 'no-speech':
          // Don't treat no-speech as a critical error - just log it
          console.log('No speech detected, continuing to listen...');
          // Don't show error toast for no-speech, as it's normal
          break;
        case 'audio-capture':
          this.isListening = false;
          this.shouldRestart = false;
          this.stateSubject.next(RecognitionState.ERROR);
          this.errorSubject.next('No microphone found. Please check your microphone.');
          break;
        case 'not-allowed':
          this.isListening = false;
          this.shouldRestart = false;
          this.stateSubject.next(RecognitionState.ERROR);
          this.errorSubject.next('Microphone permission denied. Please allow microphone access.');
          break;
        case 'network':
          this.isListening = false;
          this.shouldRestart = false;
          this.stateSubject.next(RecognitionState.ERROR);
          this.errorSubject.next('Network error. Please check your connection.');
          break;
        case 'aborted':
          // Recognition was aborted, don't show error
          console.log('Recognition aborted');
          break;
        default:
          this.isListening = false;
          this.shouldRestart = false;
          this.stateSubject.next(RecognitionState.ERROR);
          this.errorSubject.next(`Error: ${event.error}`);
      }
    };

    // Handle no match
    this.recognition.onnomatch = () => {
      console.log('No speech match found');
      this.errorSubject.next('Could not understand speech. Please try again.');
    };
  }

  /**
   * Start speech recognition
   */
  public startListening(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject('Speech recognition is not supported');
        return;
      }

      if (this.isListening) {
        reject('Already listening');
        return;
      }

      // Clear previous transcripts
      this.transcriptSubject.next('');
      this.interimTranscriptSubject.next('');
      this.shouldRestart = true;

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        reject(error);
      }
    });
  }

  /**
   * Stop speech recognition
   */
  public stopListening(): void {
    if (!this.recognition) return;

    this.shouldRestart = false;
    this.isListening = false;

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }

  /**
   * Toggle speech recognition on/off
   */
  public async toggleListening(): Promise<boolean> {
    if (this.isListening) {
      this.stopListening();
      return false;
    } else {
      await this.startListening();
      return true;
    }
  }

  /**
   * Get the current transcript
   */
  public getCurrentTranscript(): string {
    return this.transcriptSubject.value;
  }

  /**
   * Clear the current transcript
   */
  public clearTranscript(): void {
    this.transcriptSubject.next('');
    this.interimTranscriptSubject.next('');
  }

  /**
   * Get current listening state
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Set the recognition language
   */
  public setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    this.stopListening();
    this.transcriptSubject.complete();
    this.interimTranscriptSubject.complete();
    this.stateSubject.complete();
    this.errorSubject.complete();
  }
}
