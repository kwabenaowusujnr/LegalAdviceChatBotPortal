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
}
