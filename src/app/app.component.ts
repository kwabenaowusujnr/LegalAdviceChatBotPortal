import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { LoadingOverlayComponent } from './shared/loading-overlay/loading-overlay.component';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'LegalAdviceChatBotPortal';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // The AuthService constructor already handles initialization of token monitoring
    // This ensures the service is instantiated when the app starts
    // Additional initialization logic can be added here if needed
  }
}
