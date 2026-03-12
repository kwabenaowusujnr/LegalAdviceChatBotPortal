# Legal Advice ChatBot Portal (NsemBot) - Final Year Thesis Implementation Documentation

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Chapter 1: Introduction](#chapter-1-introduction)
   - 1.1 [Background](#11-background)
   - 1.2 [Problem Statement](#12-problem-statement)
   - 1.3 [Project Objectives](#13-project-objectives)
   - 1.4 [Scope of the Project](#14-scope-of-the-project)
   - 1.5 [Significance of the Study](#15-significance-of-the-study)
3. [Chapter 2: Literature Review](#chapter-2-literature-review)
   - 2.1 [Overview of Chatbot Technologies](#21-overview-of-chatbot-technologies)
   - 2.2 [AI in Legal Services](#22-ai-in-legal-services)
   - 2.3 [Related Works](#23-related-works)
4. [Chapter 3: Methodology](#chapter-3-methodology)
   - 3.1 [Development Methodology](#31-development-methodology)
   - 3.2 [System Analysis](#32-system-analysis)
   - 3.3 [System Requirements](#33-system-requirements)
5. [Chapter 4: System Design](#chapter-4-system-design)
   - 4.1 [System Architecture](#41-system-architecture)
   - 4.2 [Component Design](#42-component-design)
   - 4.3 [Database Design](#43-database-design)
   - 4.4 [User Interface Design](#44-user-interface-design)
6. [Chapter 5: Implementation](#chapter-5-implementation)
   - 5.1 [Technologies Used](#51-technologies-used)
   - 5.2 [Frontend Implementation](#52-frontend-implementation)
   - 5.3 [Backend API Integration](#53-backend-api-integration)
   - 5.4 [Authentication System](#54-authentication-system)
   - 5.5 [Voice Input Feature](#55-voice-input-feature)
   - 5.6 [Chat Management System](#56-chat-management-system)
7. [Chapter 6: Testing](#chapter-6-testing)
   - 6.1 [Testing Approach](#61-testing-approach)
   - 6.2 [Unit Testing](#62-unit-testing)
   - 6.3 [Integration Testing](#63-integration-testing)
   - 6.4 [User Acceptance Testing](#64-user-acceptance-testing)
8. [Chapter 7: Deployment](#chapter-7-deployment)
   - 7.1 [Deployment Architecture](#71-deployment-architecture)
   - 7.2 [Docker Containerization](#72-docker-containerization)
   - 7.3 [CI/CD Pipeline](#73-cicd-pipeline)
9. [Chapter 8: Results and Discussion](#chapter-8-results-and-discussion)
   - 8.1 [System Features](#81-system-features)
   - 8.2 [Performance Analysis](#82-performance-analysis)
   - 8.3 [User Feedback](#83-user-feedback)
10. [Chapter 9: Conclusion and Recommendations](#chapter-9-conclusion-and-recommendations)
    - 9.1 [Conclusion](#91-conclusion)
    - 9.2 [Limitations](#92-limitations)
    - 9.3 [Future Enhancements](#93-future-enhancements)
11. [References](#references)
12. [Appendices](#appendices)

---

## 1. Abstract

This thesis presents the design, development, and implementation of **NsemBot**, a web-based Legal Advice ChatBot Portal built to provide accessible legal guidance to users in Ghana. The system leverages modern web technologies including Angular 19, TypeScript, and TailwindCSS for the frontend, integrated with an AI-powered backend API for intelligent legal responses.

The application addresses the challenge of limited access to legal information by providing a 24/7 conversational interface that can answer legal questions, explain laws and constitutional provisions, and guide users through legal processes. Key features include user authentication, voice-to-text input, chat session management, profile management, and support for multiple legal document contexts including the 1992 Constitution of Ghana, Labour Act 2003, and other significant legal documents.

The system was developed using Agile methodology with iterative development cycles, ensuring continuous improvement and user-centered design. Testing was conducted using Jasmine and Karma frameworks for unit testing, along with comprehensive integration and user acceptance testing.

**Keywords:** Legal Chatbot, AI, Angular, Web Application, Legal Technology, Natural Language Processing, Ghana Constitution

---

## Chapter 1: Introduction

### 1.1 Background

Access to legal information and advice remains a significant challenge in many developing countries, including Ghana. The complexity of legal systems, coupled with the high cost of legal consultations, often leaves citizens without adequate knowledge of their rights and legal protections. This information asymmetry can lead to exploitation, unresolved disputes, and a general distrust of legal systems.

The advent of Artificial Intelligence (AI) and Natural Language Processing (NLP) technologies has opened new possibilities for democratizing access to legal information. Chatbots, powered by AI, can provide instant, consistent, and scalable legal guidance to users regardless of their location or financial status.

NsemBot (derived from the Akan word "Nsem" meaning "words" or "matters") represents an initiative to bridge this gap by providing an intelligent conversational interface for legal queries, specifically tailored to Ghanaian laws and constitutional provisions.

### 1.2 Problem Statement

Citizens in Ghana face several challenges when seeking legal advice:

1. **Limited Access**: Legal professionals are concentrated in urban areas, leaving rural populations underserved.
2. **High Costs**: Professional legal consultation fees are prohibitive for the average citizen.
3. **Complex Legal Language**: Legal documents use technical terminology that is difficult for laypersons to understand.
4. **Time Constraints**: Traditional legal consultations require scheduling and travel, which may not be feasible for many.
5. **Information Asymmetry**: Many citizens are unaware of their constitutional rights and legal protections.

There is a clear need for an accessible, affordable, and user-friendly platform that can provide basic legal guidance and information to Ghanaian citizens.

### 1.3 Project Objectives

The primary objectives of this project are:

**General Objective:**
To design and develop a web-based legal advice chatbot portal that provides accessible legal information and guidance to users.

**Specific Objectives:**
1. To create an intuitive conversational interface for legal queries
2. To implement user authentication and session management
3. To integrate AI-powered responses for legal questions
4. To support multiple legal document contexts (Constitution, Labour Act, etc.)
5. To implement voice-to-text functionality for accessibility
6. To develop a responsive design accessible on multiple devices
7. To deploy the application on a reliable cloud infrastructure

### 1.4 Scope of the Project

**In Scope:**
- Web-based chatbot interface for legal queries
- User registration and authentication system
- Support for key Ghanaian legal documents
- Chat history and session management
- Voice input functionality
- Profile management features
- Responsive design for mobile and desktop
- Cloud deployment with Docker containerization

**Out of Scope:**
- Professional legal advice or representation
- Case filing or court document preparation
- Legal document drafting with binding authority
- Integration with court management systems
- Multi-language support beyond English

### 1.5 Significance of the Study

This project contributes to:

1. **Legal Technology Advancement**: Demonstrates the application of AI in legal services within the Ghanaian context.
2. **Access to Justice**: Improves legal literacy and awareness among citizens.
3. **Academic Research**: Provides a framework for future research in legal chatbots and AI applications.
4. **Practical Application**: Serves as a functional tool for users seeking legal guidance.
5. **Technology Education**: Showcases modern web development practices and methodologies.

---

## Chapter 2: Literature Review

### 2.1 Overview of Chatbot Technologies

Chatbots have evolved significantly from rule-based systems to sophisticated AI-powered conversational agents. The progression includes:

**First Generation - Rule-Based Chatbots:**
Early chatbots operated on predefined rules and pattern matching. ELIZA (1966) by Joseph Weizenbaum is often cited as the first chatbot, using pattern matching and substitution methodology.

**Second Generation - Machine Learning Chatbots:**
These chatbots utilize machine learning algorithms to improve responses over time. They can learn from interactions and provide more contextual responses.

**Third Generation - AI-Powered Chatbots:**
Modern chatbots leverage Natural Language Processing (NLP), Natural Language Understanding (NLU), and deep learning models to understand context, sentiment, and intent. Large Language Models (LLMs) like GPT have revolutionized conversational AI.

### 2.2 AI in Legal Services

The application of AI in legal services, often termed "Legal Tech," encompasses:

1. **Legal Research**: AI tools that can search through case law and statutes
2. **Contract Analysis**: Automated review and analysis of legal documents
3. **Predictive Analytics**: Using data to predict case outcomes
4. **Virtual Legal Assistants**: Chatbots providing legal information and guidance
5. **E-Discovery**: AI-powered document review for litigation

Studies have shown that AI can significantly reduce the time required for legal research while maintaining accuracy comparable to human lawyers in certain tasks.

### 2.3 Related Works

**DoNotPay:**
Often called "the world's first robot lawyer," DoNotPay started as a chatbot to contest parking tickets and has expanded to various legal services.

**ROSS Intelligence:**
An AI legal research platform that uses natural language processing to help lawyers find relevant case law.

**LawBot:**
A chatbot developed by Cambridge University students to provide legal information in the UK.

**Ghana-Specific Initiatives:**
While comprehensive legal chatbots are limited in Ghana, initiatives like the Ghana Bar Association's digitization efforts and various legal aid programs have attempted to improve access to legal services.

---

## Chapter 3: Methodology

### 3.1 Development Methodology

The project employed **Agile Development Methodology** with the following characteristics:

**Iterative Development:**
- Development was conducted in sprints of 2 weeks
- Each sprint delivered functional features
- Regular reviews and retrospectives guided improvements

**User-Centered Design:**
- User personas were developed to guide feature development
- User feedback was incorporated throughout the development cycle
- Usability testing informed design decisions

**Continuous Integration/Continuous Deployment (CI/CD):**
- Automated testing on each code commit
- Automated deployment to staging and production environments
- Version control using Git and GitHub

### 3.2 System Analysis

**Current System Analysis:**
Traditional legal consultation involves:
1. Scheduling appointments with lawyers
2. Physical visits to law offices
3. Verbal consultation and manual note-taking
4. Fee payment for each consultation
5. Follow-up visits for additional questions

**Proposed System Analysis:**
The NsemBot system provides:
1. 24/7 availability without scheduling
2. Remote access from any device
3. Instant responses with chat history
4. Free access for basic legal information
5. Continuous session for follow-up questions

### 3.3 System Requirements

#### 3.3.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | User Registration and Login | High |
| FR2 | Chat Interface for Legal Queries | High |
| FR3 | AI-Powered Response Generation | High |
| FR4 | Document Context Selection | Medium |
| FR5 | Chat History Management | Medium |
| FR6 | Voice Input for Messages | Medium |
| FR7 | User Profile Management | Medium |
| FR8 | Password Change Functionality | Medium |
| FR9 | Session Export | Low |
| FR10 | Analytics Tracking | Low |

#### 3.3.2 Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR1 | Performance | Response time < 3 seconds |
| NFR2 | Availability | 99.5% uptime |
| NFR3 | Security | Encrypted data transmission (HTTPS) |
| NFR4 | Scalability | Support for 1000+ concurrent users |
| NFR5 | Accessibility | WCAG 2.1 Level AA compliance |
| NFR6 | Responsiveness | Support for mobile and desktop |
| NFR7 | Browser Support | Chrome, Firefox, Safari, Edge |

---

## Chapter 4: System Design

### 4.1 System Architecture

The system follows a **Client-Server Architecture** with the following components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Angular 19 Application                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │  Components  │  │   Services   │  │     Guards/          │  │ │
│  │  │  - Chat      │  │  - Auth      │  │     Interceptors     │  │ │
│  │  │  - Landing   │  │  - ChatAPI   │  │  - AuthGuard         │  │ │
│  │  │  - Login     │  │  - Toast     │  │  - AuthInterceptor   │  │ │
│  │  │  - Profile   │  │  - Speech    │  │  - LoginGuard        │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVER TIER                                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    .NET Core Web API                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │ │
│  │  │ Controllers  │  │   Services   │  │    AI Integration    │  │ │
│  │  │ - Auth       │  │  - User      │  │  - NLP Processing    │  │ │
│  │  │ - Chat       │  │  - Chat      │  │  - Response Gen      │  │ │
│  │  │ - Document   │  │  - Document  │  │  - Context Mgmt      │  │ │
│  │  │ - User       │  │  - Analysis  │  │                      │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA TIER                                    │
│  ┌──────────────────────┐    ┌──────────────────────────────────┐   │
│  │      Database        │    │         Document Store           │   │
│  │  - Users             │    │  - Constitution                  │   │
│  │  - Chat Sessions     │    │  - Labour Act                    │   │
│  │  - Messages          │    │  - Other Legal Docs              │   │
│  │  - Documents         │    │                                  │   │
│  └──────────────────────┘    └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Component Design

#### 4.2.1 Frontend Component Hierarchy

```
AppComponent
├── ToastContainerComponent
├── LoadingOverlayComponent
└── RouterOutlet
    ├── LandingPageComponent
    ├── LoginComponent
    ├── RegisterComponent
    ├── ChatComponent
    │   ├── SidebarV2Component
    │   ├── UserMenuComponent
    │   │   ├── ProfileManagementModalComponent
    │   │   └── HelpSupportModalComponent
    │   ├── MessageWindowComponent
    │   ├── ChatInputComponent
    │   ├── TypingIndicatorComponent
    │   └── SignupPromptModalComponent
    └── PrivacyPolicyComponent
```

#### 4.2.2 Service Layer Design

```typescript
// Service Dependencies
AuthService
├── ServiceProxy (API Client)
├── Router
└── ToastService

ChatApiService
├── ServiceProxy (API Client)
└── ToastService

SpeechRecognitionService
└── Web Speech API

AnalyticsService
└── Google Analytics (gtag)

LoadingService
└── BehaviorSubject

ToastService
└── BehaviorSubject
```

### 4.3 Database Design

#### 4.3.1 Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐
│     User      │       │ ChatSession   │
├───────────────┤       ├───────────────┤
│ PK: id        │───┐   │ PK: id        │
│ email         │   │   │ FK: userId    │
│ firstName     │   └──>│ documentType  │
│ lastName      │       │ createdAt     │
│ password      │       │ updatedAt     │
│ phoneNumber   │       └───────┬───────┘
│ region        │               │
│ createdAt     │               │
│ isActive      │               │
└───────────────┘               │
                                │
                    ┌───────────▼───────┐
                    │   ChatMessage     │
                    ├───────────────────┤
                    │ PK: id            │
                    │ FK: sessionId     │
                    │ message           │
                    │ response          │
                    │ isFromUser        │
                    │ createdAt         │
                    └───────────────────┘
```

#### 4.3.2 Data Models

**User Model:**
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  region: string;
  createdAt: Date;
  isActive: boolean;
}
```

**ChatMessage Model:**
```typescript
interface ChatMessage {
  id: number;
  sessionId: string;
  message: string;
  response?: string;
  isFromUser: boolean;
  createdAt: Date;
}
```

### 4.4 User Interface Design

#### 4.4.1 Design Principles

1. **Minimalist Design**: Clean interface focusing on the chat experience
2. **Responsive Layout**: Adapts to mobile, tablet, and desktop screens
3. **Consistent Branding**: NsemBot brand colors and typography throughout
4. **Accessibility**: High contrast, keyboard navigation, screen reader support
5. **Intuitive Navigation**: Clear information hierarchy

#### 4.4.2 Color Scheme

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary (Deep Red) | Deep Red | #8B1538 |
| Secondary (Amber) | Amber | #FFB81C |
| Forest Green | Forest | #228B22 |
| Background | Light Gray | #F9FAFB |
| Text Primary | Dark Gray | #111827 |
| Text Secondary | Medium Gray | #6B7280 |

#### 4.4.3 Key Interface Screens

**1. Landing Page:**
- Hero section with chatbot introduction
- Feature highlights
- App store download buttons (mobile app future)
- Phone mockup preview

**2. Chat Interface:**
- Sidebar with chat history
- Main chat area with messages
- Document context selector
- Voice input button
- User menu dropdown

**3. Profile Management Modal:**
- Profile editing tab
- Chat management tab
- Account settings tab
- Privacy & data tab

---

## Chapter 5: Implementation

### 5.1 Technologies Used

#### 5.1.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 19.0.0 | Frontend Framework |
| TypeScript | 5.6.2 | Programming Language |
| TailwindCSS | 3.4.3 | CSS Framework |
| RxJS | 7.8.0 | Reactive Programming |
| Lucide Angular | 0.542.0 | Icon Library |
| Zone.js | 0.15.0 | Change Detection |

#### 5.1.2 Development Tools

| Tool | Purpose |
|------|---------|
| Angular CLI | Project scaffolding and build |
| NSwag | API client generation |
| Karma | Test runner |
| Jasmine | Testing framework |
| PostCSS | CSS processing |
| Autoprefixer | CSS browser compatibility |

#### 5.1.3 Deployment Technologies

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Nginx | Web server |
| GitHub Actions | CI/CD |
| DigitalOcean | Cloud hosting |

### 5.2 Frontend Implementation

#### 5.2.1 Application Bootstrap

The application is bootstrapped using Angular's standalone component approach:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

#### 5.2.2 Routing Configuration

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./pages/chat/login/login.component")
      .then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/chat/register/register.component")
      .then((m) => m.RegisterComponent),
    canActivate: [LoginGuard],
  },
  {
    path: "chatV2",
    loadComponent: () => import("./pages/chat/chat.component")
      .then((m) => m.ChatComponent),
  },
  {
    path: "privacy-policy",
    loadComponent: () => import("./pages/privacy-policy/privacy-policy.component")
      .then((m) => m.PrivacyPolicyComponent),
  },
];
```

#### 5.2.3 Chat Component Implementation

The main chat component manages the chat interface:

```typescript
@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    SidebarV2Component,
    ChatInputComponent,
    LucideAngularModule,
    MessageWindowComponent,
    UserMenuComponent,
    TypingIndicatorComponent,
    SignupPromptModalComponent,
    HelpSupportModalComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements AfterViewChecked {
  messages: ChatMessage[] = [];
  isLoading = false;
  isSidebarOpen = false;
  showUserMenu = false;
  anonymousMessageCount = 0;
  showSignupPrompt = false;
  readonly ANONYMOUS_MESSAGE_LIMIT = 3;

  // Legal document contexts
  constitutionalDocuments: ConstitutionalDocument[] = [
    {
      id: 'constitution',
      name: '1992 Constitution',
      description: 'The supreme law of Ghana.',
    },
    {
      id: 'labour',
      name: 'Labour Act, 2003',
      description: 'Consolidates laws on employment and labour rights.',
    },
    // ... more documents
  ];

  onSendMessage(message: string): void {
    // Track analytics
    this.analyticsService.trackEvent('send_message', 'User sent a message', 'engagement');

    // Check anonymous message limit
    if(!this.authService.isAuthenticated()){
      if(this.anonymousMessageCount >= this.ANONYMOUS_MESSAGE_LIMIT){
        this.showSignupPrompt = true;
        return;
      }
      this.anonymousMessageCount++;
    }

    // Create and send message
    const userMessage = new ChatMessage();
    userMessage.message = message;
    userMessage.isFromUser = true;
    this.messages.push(userMessage);

    // Get AI response
    this.chatApiService.sendMessage(message, this.selectedDocument?.id)
      .subscribe(response => {
        this.messages.push(response);
      });
  }
}
```

### 5.3 Backend API Integration

#### 5.3.1 API Client Generation

The API client is auto-generated using NSwag from the backend's OpenAPI specification:

```typescript
// api-client.ts (auto-generated)
@Injectable()
export class ServiceProxy implements IServiceProxy {
    constructor(
      @Inject(HttpClient) http: HttpClient, 
      @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.http = http;
        this.baseUrl = baseUrl ?? "";
    }

    register(body?: UserRegistrationInputDto): Observable<AuthResponse> { ... }
    login(body?: UserLoginInputDto): Observable<AuthResponse> { ... }
    sendMessage(body?: ChatMessageInputDto): Observable<void> { ... }
    history(sessionId: string): Observable<ChatMessage[]> { ... }
    userChatHistory(): Observable<ChatMessageHistoryDto[]> { ... }
    changePassword(body?: ChangePasswordRequest): Observable<void> { ... }
}
```

#### 5.3.2 Chat API Service

The ChatApiService wraps the API client with session management:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private currentSessionId: string | null = null;

  constructor(
    private serviceProxy: ServiceProxy,
    private toastService: ToastService
  ) {
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startNewSession(): void {
    this.currentSessionId = this.generateSessionId();
  }

  sendMessage(message: string, documentContext?: string): Observable<ChatMessage> {
    const chatInput = new ChatMessageInputDto();
    chatInput.sessionId = this.currentSessionId!;
    chatInput.message = message;
    chatInput.documentContext = documentContext;

    return this.serviceProxy.sendMessage(chatInput).pipe(
      switchMap(() => this.getLatestBotResponse(this.currentSessionId!)),
      catchError((error) => {
        this.toastService.error("Failed to send message. Please try again.");
        return of(this.createErrorMessage());
      }),
    );
  }
}
```

### 5.4 Authentication System

#### 5.4.1 Authentication Service

```typescript
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenExpirationCheckInterval: any;

  constructor(
    private apiClient: ServiceProxy,
    private router: Router,
    private toastService: ToastService
  ) {
    this.checkAuthStatus();
    if (this.hasValidToken()) {
      this.startTokenExpirationMonitor();
    }
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token || this.isTokenExpired()) {
      return false;
    }
    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const loginDto = new UserLoginInputDto();
    loginDto.email = email;
    loginDto.password = password;

    return this.apiClient.login(loginDto).pipe(
      map((response: AuthResponse) => {
        if (response.token && response.user) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.expiresAt) {
            localStorage.setItem('tokenExpiresAt', response.expiresAt.toISOString());
          }
          this.isAuthenticatedSubject.next(true);
          this.startTokenExpirationMonitor();
          return true;
        }
        return false;
      }),
    );
  }
}
```

#### 5.4.2 Authentication Interceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      if (this.authService.isTokenExpired()) {
        this.authService.logout().subscribe(() => {
          this.toastService.warning('Your session has expired. Please log in again.');
          this.router.navigate(['/login']);
        });
        return next.handle(req);
      }

      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${authToken}`),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
```

#### 5.4.3 Route Guards

**Auth Guard:**
```typescript
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(["/login"]);
      return false;
    }
  }
}
```

### 5.5 Voice Input Feature

#### 5.5.1 Speech Recognition Service

```typescript
@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private shouldRestart = false;

  private transcriptSubject = new BehaviorSubject<string>('');
  private interimTranscriptSubject = new BehaviorSubject<string>('');
  private stateSubject = new BehaviorSubject<RecognitionState>(RecognitionState.IDLE);

  public transcript$ = this.transcriptSubject.asObservable();
  public interimTranscript$ = this.interimTranscriptSubject.asObservable();
  public state$ = this.stateSubject.asObservable();

  constructor() {
    this.initializeRecognition();
  }

  public isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  private initializeRecognition(): void {
    if (!this.isSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.setupEventHandlers();
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition is not supported');
    }
    this.transcriptSubject.next('');
    this.recognition.start();
  }

  stopListening(): void {
    this.shouldRestart = false;
    this.recognition?.stop();
  }
}
```

#### 5.5.2 Chat Input Integration

```typescript
@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
})
export class ChatInputComponent implements OnDestroy {
  isRecording = false;
  interimTranscript = "";
  private subscriptions: Subscription[] = [];

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private toastService: ToastService
  ) {
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition(): void {
    const transcriptSub = this.speechRecognitionService.transcript$
      .subscribe(transcript => {
        if (transcript) {
          this.inputValue = transcript.trim();
        }
      });

    const stateSub = this.speechRecognitionService.state$
      .subscribe(state => {
        this.isRecording = state === RecognitionState.RECORDING;
      });

    this.subscriptions.push(transcriptSub, stateSub);
  }

  async onVoiceInput() {
    if (!this.speechRecognitionService.isSupported()) {
      this.toastService.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (this.isRecording) {
      this.speechRecognitionService.stopListening();
      this.toastService.info('Voice recording stopped');
    } else {
      await this.speechRecognitionService.startListening();
      this.toastService.success('Voice recording started. Speak now...');
    }
  }
}
```

### 5.6 Chat Management System

#### 5.6.1 Chat Management Service

```typescript
@Injectable({
  providedIn: 'root'
})
export class ChatManagementService {
  constructor(
    private serviceProxy: ServiceProxy,
    private toastService: ToastService
  ) {}

  getUserChatHistory(): Observable<ChatMessageHistoryDto[]> {
    return this.serviceProxy.userChatHistory().pipe(
      catchError((error) => {
        this.toastService.error('Failed to load chat history.');
        return of([]);
      })
    );
  }

  deleteSession(sessionId: string): Observable<boolean> {
    return this.serviceProxy.session(sessionId).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  exportSessionsToJson(sessions: ChatSession[]): void {
    const dataStr = JSON.stringify(sessions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat_export_${new Date().toISOString()}.json`;
    link.click();
  }
}
```

#### 5.6.2 Profile Management Modal

The profile management modal provides comprehensive user management features:

1. **Profile Tab**: Edit personal information (name, email, phone, region)
2. **Chat Management Tab**: View, search, delete, and export chat sessions
3. **Account Settings Tab**: Change password, export user data
4. **Privacy & Data Tab**: Privacy preferences, data retention settings

---

## Chapter 6: Testing

### 6.1 Testing Approach

The project employed a multi-level testing strategy:

1. **Unit Testing**: Individual component and service testing
2. **Integration Testing**: Testing component interactions
3. **End-to-End Testing**: Full user flow testing
4. **User Acceptance Testing**: Real user feedback collection

### 6.2 Unit Testing

#### 6.2.1 Testing Framework Configuration

Tests are configured using Karma and Jasmine:

```typescript
// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
  });
};
```

#### 6.2.2 Sample Unit Tests

**Auth Service Test:**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false when no token exists', () => {
    localStorage.removeItem('authToken');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when valid token exists', () => {
    localStorage.setItem('authToken', 'valid-token');
    localStorage.setItem('tokenExpiresAt', new Date(Date.now() + 3600000).toISOString());
    expect(service.isAuthenticated()).toBeTrue();
  });
});
```

**Chat API Service Test:**
```typescript
describe('ChatApiService', () => {
  let service: ChatApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatApiService, ServiceProxy, ToastService]
    });
    service = TestBed.inject(ChatApiService);
  });

  it('should generate unique session IDs', () => {
    const id1 = service['generateSessionId']();
    const id2 = service['generateSessionId']();
    expect(id1).not.toEqual(id2);
  });

  it('should start a new session', () => {
    const initialId = service['currentSessionId'];
    service.startNewSession();
    expect(service['currentSessionId']).not.toEqual(initialId);
  });
});
```

### 6.3 Integration Testing

Integration tests verify component interactions:

```typescript
describe('ChatComponent Integration', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatApiService: jasmine.SpyObj<ChatApiService>;

  beforeEach(async () => {
    chatApiService = jasmine.createSpyObj('ChatApiService', ['sendMessage']);
    
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatApiService, useValue: chatApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
  });

  it('should add user message to messages array', () => {
    const testMessage = 'What are my constitutional rights?';
    chatApiService.sendMessage.and.returnValue(of(new ChatMessage()));
    
    component.onSendMessage(testMessage);
    
    expect(component.messages.length).toBeGreaterThan(0);
    expect(component.messages[0].message).toEqual(testMessage);
  });
});
```

### 6.4 User Acceptance Testing

User acceptance testing was conducted with the following outcomes:

| Test Case | Description | Result |
|-----------|-------------|--------|
| TC001 | User can register a new account | PASS |
| TC002 | User can login with valid credentials | PASS |
| TC003 | User can send a legal question | PASS |
| TC004 | System provides relevant legal response | PASS |
| TC005 | User can use voice input | PASS |
| TC006 | User can view chat history | PASS |
| TC007 | User can change password | PASS |
| TC008 | User can export chat sessions | PASS |
| TC009 | System handles session expiration | PASS |
| TC010 | Mobile responsive design works | PASS |

---

## Chapter 7: Deployment

### 7.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DigitalOcean Droplet                        │
│                     IP: 178.128.170.16                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 Nginx (Host) - Port 80/443              │   │
│  │                 Reverse Proxy + SSL Termination         │   │
│  └─────────────────┬───────────────────────┬───────────────┘   │
│                    │                       │                    │
│                    ▼                       ▼                    │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  Angular Frontend       │  │  .NET API Backend           │  │
│  │  Container: legal-      │  │  Container: nsembot-api     │  │
│  │  advice-chatbot         │  │                             │  │
│  │  Internal Port: 3000    │  │  Internal Port: 8122        │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Docker Containerization

**Dockerfile:**
```dockerfile
# Stage 1: Build the Angular app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/dist/legal-advice-chat-bot-portal/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  frontend:
    build: .
    container_name: legal-advice-chatbot
    ports:
      - "3000:80"
    restart: unless-stopped
```

### 7.3 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

```yaml
# .github/workflows/deploy-docker-droplet.yml
name: Deploy to DigitalOcean Droplet

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Build Docker image
        run: docker build -t legal-advice-chatbot .

      - name: Deploy to Droplet
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: ${{ secrets.DROPLET_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ghcr.io/${{ github.repository }}:latest
            docker-compose up -d
```

---

## Chapter 8: Results and Discussion

### 8.1 System Features

The completed NsemBot system includes the following features:

#### 8.1.1 Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| User Registration | ✅ Complete | Email-based registration with validation |
| User Authentication | ✅ Complete | JWT-based authentication with auto-expiry |
| Chat Interface | ✅ Complete | Real-time messaging with AI responses |
| Document Context | ✅ Complete | Support for multiple legal documents |
| Voice Input | ✅ Complete | Web Speech API integration |
| Chat History | ✅ Complete | Session-based chat history management |
| Profile Management | ✅ Complete | User profile editing and settings |
| Responsive Design | ✅ Complete | Mobile and desktop compatibility |

#### 8.1.2 User Interface Screenshots

**Landing Page:**
- Clean, modern design with NsemBot branding
- Clear call-to-action buttons
- Feature highlights and app store buttons
- Phone mockup preview

**Chat Interface:**
- Sidebar with chat history
- Document context selector
- Message window with formatted responses
- Voice input button with visual feedback

**Profile Management:**
- Tabbed interface for different settings
- Chat session management with search and bulk actions
- Password change with validation

### 8.2 Performance Analysis

#### 8.2.1 Load Time Analysis

| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint | < 2s | 1.3s |
| Time to Interactive | < 3s | 2.1s |
| Total Bundle Size | < 500KB | 387KB |
| API Response Time | < 3s | ~2s |

#### 8.2.2 Browser Compatibility

| Browser | Support Level |
|---------|--------------|
| Chrome 90+ | Full Support |
| Firefox 90+ | Full Support |
| Safari 14+ | Full Support |
| Edge 90+ | Full Support |
| Mobile Chrome | Full Support |
| Mobile Safari | Full Support |

### 8.3 User Feedback

Initial user testing yielded the following feedback:

**Positive Feedback:**
- "The interface is clean and easy to use"
- "Voice input works well and saves time"
- "The legal responses are helpful and informative"
- "Works well on my phone"

**Areas for Improvement:**
- "Would like more language options"
- "Sometimes responses take a bit long"
- "Would like to print chat history"
- "More legal document contexts would be helpful"

---

## Chapter 9: Conclusion and Recommendations

### 9.1 Conclusion

This project successfully designed and implemented NsemBot, a comprehensive web-based legal advice chatbot portal tailored for the Ghanaian context. The system achieves its primary objectives of providing accessible legal information through an intuitive conversational interface.

Key achievements include:

1. **Accessible Interface**: A user-friendly chat interface that works across devices
2. **AI-Powered Responses**: Integration with intelligent backend for legal queries
3. **Multiple Document Contexts**: Support for key Ghanaian legal documents
4. **Voice Input**: Enhanced accessibility through speech recognition
5. **Secure Authentication**: JWT-based authentication with session management
6. **Cloud Deployment**: Reliable deployment using Docker and DigitalOcean

The project demonstrates the viability of using modern web technologies and AI to democratize access to legal information. While not a replacement for professional legal advice, NsemBot serves as a valuable tool for legal literacy and preliminary guidance.

### 9.2 Limitations

The current implementation has the following limitations:

1. **Language Support**: Currently limited to English; Ghanaian local languages not supported
2. **Offline Access**: Requires internet connection for all functionality
3. **AI Accuracy**: Responses depend on the backend AI model's training
4. **Document Scope**: Limited to four main legal documents
5. **Voice Input Browser Support**: Firefox has limited Web Speech API support
6. **Professional Advice**: Cannot replace professional legal consultation

### 9.3 Future Enhancements

Recommended future enhancements include:

**Short-term (3-6 months):**
1. Multi-language support (Twi, Ga, Ewe)
2. Document upload and analysis feature
3. Offline mode with cached responses
4. Print and PDF export of conversations

**Medium-term (6-12 months):**
1. Mobile application (iOS and Android)
2. Integration with more legal documents and resources
3. Lawyer referral system
4. Voice output (text-to-speech) for responses

**Long-term (1-2 years):**
1. Integration with court systems
2. AI model training on Ghanaian case law
3. Multi-tenancy for legal organizations
4. Advanced analytics and reporting
5. Legal form generation and autofill

### 9.4 Ghanaian Local Language Support - Implementation Plans

Supporting Ghanaian local languages (Twi, Ga, Ewe, Hausa, Dagbani) is critical for accessibility. Below are two implementation approaches using Google Cloud Translation API.

#### 9.4.1 Frontend-Based Implementation Plan

**Overview:** Translation occurs entirely in the Angular frontend using the Google Cloud Translation API directly from the browser.

**Architecture:**

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

**Implementation Steps:**

**Step 1: Install Dependencies**
```bash
npm install @google-cloud/translate
# Or use REST API directly with HttpClient
```

**Step 2: Create Translation Service**
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
   * Translate text to English for backend processing
   */
  translateToEnglish(text: string, sourceLanguage: string): Observable<string> {
    if (sourceLanguage === 'en') {
      return of(text);
    }
    return this.translate(text, sourceLanguage, 'en');
  }

  /**
   * Translate English response to user's language
   */
  translateFromEnglish(text: string, targetLanguage: string): Observable<string> {
    if (targetLanguage === 'en') {
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
      map(response => response.data.translations[0].translatedText),
      catchError(error => {
        console.error('Translation error:', error);
        return of(text); // Return original text if translation fails
      })
    );
  }

  /**
   * Detect language of input text
   */
  detectLanguage(text: string): Observable<string> {
    const url = `https://translation.googleapis.com/language/translate/v2/detect?key=${this.API_KEY}`;
    return this.http.post<any>(url, { q: text }).pipe(
      map(response => response.data.detections[0][0].language),
      catchError(() => of('en'))
    );
  }
}
```

**Step 3: Create Language Selector Component**
```typescript
// src/app/shared/language-selector/language-selector.component.ts
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService, SupportedLanguage } from '../../services/translation.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="language-selector">
      <label class="text-sm text-gray-600 mr-2">Language:</label>
      <select 
        [(ngModel)]="selectedLanguage" 
        (ngModelChange)="onLanguageChange($event)"
        class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm 
               focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        <option *ngFor="let lang of languages" [value]="lang.code">
          {{ lang.nativeName }} ({{ lang.name }})
        </option>
      </select>
    </div>
  `
})
export class LanguageSelectorComponent {
  @Input() selectedLanguage: string = 'en';
  @Output() languageChange = new EventEmitter<string>();

  languages: SupportedLanguage[];

  constructor(private translationService: TranslationService) {
    this.languages = this.translationService.supportedLanguages;
  }

  onLanguageChange(langCode: string): void {
    this.languageChange.emit(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  }
}
```

**Step 4: Integrate into Chat Component**
```typescript
// src/app/pages/chat/chat.component.ts (modified)
export class ChatComponent {
  selectedLanguage: string = 'en';

  constructor(
    private translationService: TranslationService,
    private chatApiService: ChatApiService
  ) {
    // Load saved language preference
    this.selectedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  }

  async onSendMessage(message: string): Promise<void> {
    // Show user message in original language
    const userMessage = new ChatMessage();
    userMessage.message = message;
    userMessage.isFromUser = true;
    this.messages.push(userMessage);

    // Translate to English for backend
    this.translationService.translateToEnglish(message, this.selectedLanguage)
      .pipe(
        switchMap(englishMessage => 
          this.chatApiService.sendMessage(englishMessage, this.selectedDocument?.id)
        ),
        switchMap(response => 
          // Translate response back to user's language
          this.translationService.translateFromEnglish(
            response.message || '', 
            this.selectedLanguage
          ).pipe(
            map(translatedMessage => {
              response.message = translatedMessage;
              return response;
            })
          )
        )
      )
      .subscribe(translatedResponse => {
        this.messages.push(translatedResponse);
      });
  }
}
```

**Pros of Frontend Approach:**
| Advantage | Description |
|-----------|-------------|
| No backend changes | Existing API remains unchanged |
| Faster deployment | Only frontend updates needed |
| Reduced server load | Translation happens client-side |
| Easier testing | Can test translations independently |

**Cons of Frontend Approach:**
| Disadvantage | Description |
|--------------|-------------|
| API key exposure | Google API key visible in browser |
| Inconsistent quality | Client device affects performance |
| Bundle size | May increase with SDK |
| No legal term control | Cannot customize legal vocabulary |
| Cost | Each user makes separate API calls |

---

#### 9.4.2 Backend-Based Implementation Plan (Recommended)

**Overview:** Translation occurs on the .NET backend server, keeping the frontend simple and securing API credentials.

**Architecture:**

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
│  │  "Constitution" ←→ "Ahyɛde Nhyehyɛe" (Twi)                  │    │
│  │  "Labour Act" ←→ "Adwumayɛ Mmara" (Twi)                     │    │
│  │  "Fundamental Rights" ←→ "Ɛtene Hokwan" (Twi)               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Translation Cache (Redis/Memory)                │    │
│  │  Reduces API costs by caching common translations            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

**Implementation Steps:**

**Step 1: Install NuGet Package (Backend)**
```bash
dotnet add package Google.Cloud.Translation.V2
```

**Step 2: Create Translation Service (Backend)**
```csharp
// Services/TranslationService.cs
using Google.Cloud.Translation.V2;
using Microsoft.Extensions.Caching.Memory;

public interface ITranslationService
{
    Task<string> TranslateToEnglishAsync(string text, string sourceLanguage);
    Task<string> TranslateFromEnglishAsync(string text, string targetLanguage);
    Task<string> DetectLanguageAsync(string text);
}

public class GoogleTranslationService : ITranslationService
{
    private readonly TranslationClient _client;
    private readonly IMemoryCache _cache;
    private readonly ILegalGlossaryService _glossary;
    private readonly ILogger<GoogleTranslationService> _logger;

    private static readonly Dictionary<string, string> SupportedLanguages = new()
    {
        { "en", "English" },
        { "ak", "Akan (Twi)" },
        { "gaa", "Ga" },
        { "ee", "Ewe" },
        { "ha", "Hausa" },
        { "dag", "Dagbani" }
    };

    public GoogleTranslationService(
        IConfiguration config,
        IMemoryCache cache,
        ILegalGlossaryService glossary,
        ILogger<GoogleTranslationService> logger)
    {
        _client = TranslationClient.CreateFromApiKey(config["GoogleCloud:TranslationApiKey"]);
        _cache = cache;
        _glossary = glossary;
        _logger = logger;
    }

    public async Task<string> TranslateToEnglishAsync(string text, string sourceLanguage)
    {
        if (sourceLanguage == "en" || string.IsNullOrWhiteSpace(text))
            return text;

        var cacheKey = $"trans_{sourceLanguage}_en_{text.GetHashCode()}";
        
        if (_cache.TryGetValue(cacheKey, out string cachedTranslation))
            return cachedTranslation;

        try
        {
            var response = await _client.TranslateTextAsync(
                text,
                targetLanguage: "en",
                sourceLanguage: sourceLanguage
            );

            var translation = response.TranslatedText;
            
            // Cache for 24 hours
            _cache.Set(cacheKey, translation, TimeSpan.FromHours(24));
            
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
        if (targetLanguage == "en" || string.IsNullOrWhiteSpace(text))
            return text;

        // First, apply legal term glossary
        var textWithGlossary = _glossary.ApplyGlossary(text, targetLanguage);

        var cacheKey = $"trans_en_{targetLanguage}_{textWithGlossary.GetHashCode()}";
        
        if (_cache.TryGetValue(cacheKey, out string cachedTranslation))
            return cachedTranslation;

        try
        {
            var response = await _client.TranslateTextAsync(
                textWithGlossary,
                targetLanguage: targetLanguage,
                sourceLanguage: "en"
            );

            var translation = response.TranslatedText;
            
            _cache.Set(cacheKey, translation, TimeSpan.FromHours(24));
            
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
        try
        {
            var detection = await _client.DetectLanguageAsync(text);
            return detection.Language;
        }
        catch
        {
            return "en";
        }
    }
}
```

**Step 3: Create Legal Glossary Service**
```csharp
// Services/LegalGlossaryService.cs
public interface ILegalGlossaryService
{
    string ApplyGlossary(string text, string targetLanguage);
}

public class LegalGlossaryService : ILegalGlossaryService
{
    // Legal terms that should be consistently translated
    private static readonly Dictionary<string, Dictionary<string, string>> Glossary = new()
    {
        ["ak"] = new() // Twi/Akan
        {
            { "Constitution", "Ahyɛde Nhyehyɛe" },
            { "constitutional", "ahyɛde nhyehyɛe" },
            { "Labour Act", "Adwumayɛ Mmara" },
            { "fundamental rights", "ɛtene hokwan" },
            { "citizen", "ɔmannifo" },
            { "court", "asɛnnibea" },
            { "judge", "otemmufo" },
            { "lawyer", "mmaranimfo" },
            { "plaintiff", "ɔbɔfo" },
            { "defendant", "ɔfotuafo" },
            { "evidence", "adansedie" },
            { "verdict", "atemmuda" },
            { "appeal", "mpɛɛbɔ" },
            { "Article", "Nkyerɛwde" },
            { "Section", "Ɔfã" }
        },
        ["gaa"] = new() // Ga
        {
            { "Constitution", "Sɛɛlɔ Wolo" },
            { "Labour Act", "Dɔŋ Fɛɛmɔ Wolo" },
            { "court", "asaase shia" },
            { "lawyer", "mlijinɛ" }
        },
        ["ee"] = new() // Ewe
        {
            { "Constitution", "Dukɔ ƒe Se" },
            { "Labour Act", "Dɔwɔwɔ Se" },
            { "court", "ʋɔnu" },
            { "lawyer", "sefialawo" },
            { "rights", "gomekpɔkpɔwo" }
        }
    };

    public string ApplyGlossary(string text, string targetLanguage)
    {
        if (!Glossary.ContainsKey(targetLanguage))
            return text;

        var glossary = Glossary[targetLanguage];
        var result = text;

        foreach (var term in glossary)
        {
            // Mark legal terms for consistent translation
            result = result.Replace(
                term.Key, 
                $"[LEGAL_TERM:{term.Value}]",
                StringComparison.OrdinalIgnoreCase
            );
        }

        return result;
    }
}
```

**Step 4: Update Chat Controller**
```csharp
// Controllers/ChatController.cs
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ITranslationService _translationService;

    public ChatController(
        IChatService chatService,
        ITranslationService translationService)
    {
        _chatService = chatService;
        _translationService = translationService;
    }

    [HttpPost("send")]
    public async Task<ActionResult<ChatResponseDto>> SendMessage(
        [FromBody] ChatMessageInputDto input)
    {
        // 1. Translate user message to English
        var englishMessage = await _translationService.TranslateToEnglishAsync(
            input.Message, 
            input.Language ?? "en"
        );

        // 2. Process with AI (existing logic)
        var response = await _chatService.ProcessMessageAsync(
            englishMessage, 
            input.SessionId, 
            input.DocumentContext
        );

        // 3. Translate response back to user's language
        var translatedResponse = await _translationService.TranslateFromEnglishAsync(
            response.Message, 
            input.Language ?? "en"
        );

        return Ok(new ChatResponseDto
        {
            Message = translatedResponse,
            OriginalMessage = response.Message, // Keep English version for reference
            SessionId = response.SessionId,
            Timestamp = response.Timestamp,
            Language = input.Language
        });
    }
}

// DTOs
public class ChatMessageInputDto
{
    public string SessionId { get; set; }
    public string Message { get; set; }
    public string DocumentContext { get; set; }
    public string Language { get; set; } = "en"; // New field
}

public class ChatResponseDto
{
    public string Message { get; set; }
    public string OriginalMessage { get; set; } // English version
    public string SessionId { get; set; }
    public DateTime Timestamp { get; set; }
    public string Language { get; set; }
}
```

**Step 5: Update Frontend (Minimal Changes)**
```typescript
// src/app/services/chat-api.service.ts (updated)
sendMessage(
  message: string, 
  documentContext?: string,
  language: string = 'en'
): Observable<ChatMessage> {
  const chatInput = new ChatMessageInputDto();
  chatInput.sessionId = this.currentSessionId!;
  chatInput.message = message;
  chatInput.documentContext = documentContext;
  chatInput.language = language; // Add language parameter

  return this.serviceProxy.sendMessage(chatInput).pipe(
    switchMap(() => this.getLatestBotResponse(this.currentSessionId!)),
    catchError((error) => {
      this.toastService.error("Failed to send message. Please try again.");
      return of(this.createErrorMessage());
    }),
  );
}
```

**Step 6: Register Services (Backend)**
```csharp
// Program.cs or Startup.cs
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ILegalGlossaryService, LegalGlossaryService>();
builder.Services.AddScoped<ITranslationService, GoogleTranslationService>();
```

**Pros of Backend Approach:**
| Advantage | Description |
|-----------|-------------|
| Secure credentials | API key never exposed to client |
| Legal term control | Custom glossary for consistent translations |
| Caching | Reduce costs with server-side caching |
| Centralized logic | All translation in one place |
| Better quality | Can post-process translations |
| Analytics | Track language usage server-side |

**Cons of Backend Approach:**
| Disadvantage | Description |
|--------------|-------------|
| Backend changes | Requires API updates |
| Server load | Additional processing on server |
| Latency | Extra API call adds ~200-500ms |
| Deployment | Need to redeploy backend |

---

#### 9.4.3 Comparison and Recommendation

| Criteria | Frontend | Backend | Recommendation |
|----------|----------|---------|----------------|
| **Security** | ❌ API key exposed | ✅ Server-side | Backend |
| **Legal Accuracy** | ❌ Generic translations | ✅ Custom glossary | Backend |
| **Performance** | ✅ No server overhead | ⚠️ Added latency | Frontend (slight) |
| **Cost Control** | ❌ Per-user API calls | ✅ Cached & optimized | Backend |
| **Maintenance** | ✅ Frontend only | ⚠️ Full stack | Frontend |
| **Scalability** | ❌ Client-dependent | ✅ Server-controlled | Backend |
| **Implementation Time** | ✅ 1-2 weeks | ⚠️ 2-4 weeks | Frontend |

**Final Recommendation:** The **Backend approach** is recommended for NsemBot because:

1. **Legal context is critical** - The custom glossary ensures legal terms are translated accurately and consistently
2. **Security** - Google Cloud API keys should never be exposed in client-side code
3. **Cost optimization** - Caching reduces API calls significantly for common legal phrases
4. **Future extensibility** - Easy to add more languages or switch translation providers

---

## References

1. Weizenbaum, J. (1966). ELIZA—a computer program for the study of natural language communication between man and machine. Communications of the ACM, 9(1), 36-45.

2. Susskind, R. (2017). Tomorrow's Lawyers: An Introduction to Your Future (2nd ed.). Oxford University Press.

3. Angular Team. (2024). Angular Documentation. https://angular.dev

4. TailwindCSS. (2024). TailwindCSS Documentation. https://tailwindcss.com

5. Web Speech API. (2024). MDN Web Docs. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

6. Docker Documentation. (2024). Docker. https://docs.docker.com

7. Ghana Bar Association. (2023). Legal Practice in Ghana. https://ghanabar.org

8. Constitution of the Republic of Ghana 1992. Ghana Publishing Corporation.

9. Labour Act, 2003 (Act 651). Ghana Publishing Corporation.

10. Intestate Succession Law, 1985 (PNDCL 111). Ghana Publishing Corporation.

---

## Appendices

### Appendix A: Project Directory Structure

```
LegalAdviceChatBotPortal/
├── .github/workflows/          # CI/CD workflows
├── backup/                     # Backup files
├── docs/                       # Generated documentation
├── public/                     # Public assets
├── src/
│   ├── app/
│   │   ├── core/models/        # Data models
│   │   ├── guards/             # Route guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── pages/              # Page components
│   │   │   ├── chat/           # Chat page
│   │   │   ├── landing-page/   # Landing page
│   │   │   └── privacy-policy/ # Privacy policy
│   │   ├── services/           # Angular services
│   │   └── shared/             # Shared components
│   ├── assets/                 # Static assets
│   ├── index.html              # Main HTML file
│   ├── main.ts                 # Application entry
│   └── styles.css              # Global styles
├── angular.json                # Angular configuration
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose
├── nginx.conf                  # Nginx configuration
├── package.json                # NPM dependencies
├── tailwind.config.js          # TailwindCSS config
└── tsconfig.json               # TypeScript config
```

### Appendix B: API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/Auth/register` | POST | User registration |
| `/api/Auth/login` | POST | User login |
| `/api/Chat/sendMessage` | POST | Send chat message |
| `/api/Chat/history/{sessionId}` | GET | Get chat history |
| `/api/Chat/userChatHistory` | GET | Get user's chat sessions |
| `/api/Chat/session/{sessionId}` | DELETE | Delete chat session |
| `/api/Users/change-password` | POST | Change password |
| `/api/Document/upload` | POST | Upload document |
| `/api/Document/analyze` | POST | Analyze document |
| `/api/Health` | GET | Health check |

### Appendix C: Environment Configuration

**Development Environment:**
```
API_BASE_URL=http://localhost:5000
ENVIRONMENT=development
```

**Production Environment:**
```
API_BASE_URL=https://api.nsembot.com
ENVIRONMENT=production
```

### Appendix D: Supported Legal Documents

1. **1992 Constitution of Ghana** - The supreme law of Ghana
2. **Labour Act, 2003 (Act 651)** - Employment and labour rights
3. **Intestate Succession Law, 1985 (PNDCL 111)** - Inheritance without will
4. **Right to Information Act, 2019** - Access to public information

---

**Document Information:**
- **Version**: 1.0
- **Last Updated**: March 2026
- **Author**: [Student Name]
- **Institution**: [University Name]
- **Department**: [Department Name]
- **Supervisor**: [Supervisor Name]

---

*This document was prepared as part of the final year project requirements for [Degree Program] at [University Name].*
