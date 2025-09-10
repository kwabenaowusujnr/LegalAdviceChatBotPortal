import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor(private router: Router, public analyticsService: AnalyticsService) {}

  startChat() {
    this.router.navigate(['/chatV2']);
    this.analyticsService.trackEvent('start_chat', 'User started a chat', 'engagement');
  }
}   
