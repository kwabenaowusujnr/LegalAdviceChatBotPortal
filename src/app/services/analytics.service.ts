import { Injectable } from '@angular/core';

declare var gtag: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  trackEvent(eventName: string, eventDetails: string, eventCategory: string) {
    // Implementation for tracking events
    gtag('event', eventName, {
      event_category: eventCategory,
      event_label: eventDetails
    });
  }

  trackPageView(pagePath: string, pageTitle: string) {
    // Implementation for tracking page views
    gtag('config', 'GA_TRACKING_ID', {
      page_path: pagePath,
      page_title: pageTitle
    });

    console.log(`Tracked page view: ${pageTitle} at ${pagePath}`);
  }

  trackError(errorMessage: string, errorDetails?: string) {
    // Implementation for tracking errors
    gtag('event', 'exception', {
      description: errorMessage + (errorDetails ? `: ${errorDetails}` : ''),
      fatal: false
    });
  }

  trackException(errorMessage: string, errorDetails?: string) {
    // Implementation for tracking exceptions
    gtag('event', 'exception', {
      description: errorMessage + (errorDetails ? `: ${errorDetails}` : ''),
      fatal: false
    });
  }

  trackUserInteraction(interactionType: string, interactionDetails: string) {
    // Implementation for tracking user interactions
    gtag('event', interactionType, {
      event_category: 'User Interaction',
      event_label: interactionDetails
    });
  }

}
