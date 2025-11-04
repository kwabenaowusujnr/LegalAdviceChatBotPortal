import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Loader, LucideAngularModule, Mic, MicOff, Plus, Send, Settings } from 'lucide-angular';
import { SpeechRecognitionService, RecognitionState } from 'src/app/services/speech-recognition.service';
import { ToastService } from 'src/app/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-input',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent implements AfterViewInit, OnDestroy {
  @Input() isLoading = false
  @Input() isDisabled = false
  @Output() messageSubmit = new EventEmitter<string>()

  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  inputValue = ""
  isRecording = false
  recognitionState: RecognitionState = RecognitionState.IDLE
  interimTranscript = ""

  // Subscriptions
  private subscriptions: Subscription[] = []

  // Icons
  plusIcon = Plus
  settingsIcon = Settings
  micIcon = Mic
  micOffIcon = MicOff
  loaderIcon = Loader
  sendIcon = Send

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private toastService: ToastService
  ) {
    this.setupSpeechRecognition();
  }

  get canSubmit(): boolean {
    return this.inputValue.trim().length > 0 && !this.isLoading
  }

  private setupSpeechRecognition(): void {
    // Subscribe to transcript updates
    const transcriptSub = this.speechRecognitionService.transcript$.subscribe(transcript => {
      console.log('Transcript received:', transcript);
      if (transcript) {
        // Set the input value to the transcript (it already accumulates in the service)
        this.inputValue = transcript.trim();
        // Focus the textarea to show the updated text
        if (this.textarea) {
          this.textarea.nativeElement.focus();
        }
      }
    });

    // Subscribe to interim transcript updates (for real-time feedback)
    const interimSub = this.speechRecognitionService.interimTranscript$.subscribe(interim => {
      this.interimTranscript = interim;
    });

    // Subscribe to recognition state changes
    const stateSub = this.speechRecognitionService.state$.subscribe(state => {
      this.recognitionState = state;
      this.isRecording = state === RecognitionState.RECORDING || state === RecognitionState.PROCESSING;
    });

    // Subscribe to error messages
    const errorSub = this.speechRecognitionService.error$.subscribe(error => {
      if (error) {
        this.toastService.error(error, 'Speech Recognition Error');
        this.isRecording = false;
      }
    });

    this.subscriptions.push(transcriptSub, interimSub, stateSub, errorSub);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onSubmit(): void {
    if (this.canSubmit) {
      // Stop recording if active
      if (this.isRecording) {
        this.speechRecognitionService.stopListening();
        this.isRecording = false;
      }

      this.messageSubmit.emit(this.inputValue.trim())
      this.inputValue = ""
      this.interimTranscript = ""
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      this.onSubmit()
    }
  }

  onAttachment() {
    console.log("Opening file attachment...")
  }

  async onVoiceInput() {
    // Check if browser supports speech recognition
    if (!this.speechRecognitionService.isSupported()) {
      this.toastService.error(
        'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.',
        'Browser Not Supported'
      );
      return;
    }

    try {
      if (this.isRecording) {
        // Stop recording
        this.speechRecognitionService.stopListening();
        this.isRecording = false;
        this.toastService.info('Voice recording stopped', 'Recording Stopped');
      } else {
        // Start recording
        await this.speechRecognitionService.startListening();
        this.isRecording = true;
        this.toastService.success('Voice recording started. Speak now...', 'Recording Started');
      }
    } catch (error: any) {
      console.error('Error toggling voice input:', error);
      this.isRecording = false;

      // Handle specific error cases
      if (error === 'Speech recognition is not supported') {
        this.toastService.error(
          'Speech recognition is not supported in your browser',
          'Not Supported'
        );
      } else if (error === 'Already listening') {
        this.toastService.warning('Voice recording is already active', 'Already Recording');
      } else {
        this.toastService.error(
          'Failed to start voice recording. Please check your microphone permissions.',
          'Recording Error'
        );
      }
    }
  }

  ngAfterViewInit(): void {
    this.textarea.nativeElement.focus();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Stop listening if component is destroyed while recording
    if (this.isRecording) {
      this.speechRecognitionService.stopListening();
    }
  }

  // Helper method to get display text including interim transcript
  get displayText(): string {
    if (this.interimTranscript) {
      return this.inputValue + ' ' + this.interimTranscript;
    }
    return this.inputValue;
  }
}
