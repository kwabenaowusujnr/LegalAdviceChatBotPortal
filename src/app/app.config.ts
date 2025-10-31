import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { API_BASE_URL, ServiceProxy } from './services/api-client';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi()),
    {
      provide: API_BASE_URL,
      // useValue: 'https://legalchatbot-api.azurewebsites.net'
      useValue: 'http://178.128.170.16:8122'
      // useValue: 'https://vpcjwxxd-44398.uks1.devtunnels.ms'
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: ServiceProxy,
      useFactory: (http: HttpClient, baseUrl: string) => new ServiceProxy(http, baseUrl),
      deps: [HttpClient, API_BASE_URL],
    },
  ],
};

