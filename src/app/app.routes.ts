import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ChatInterfaceComponent } from './pages/chat-interface/chat-interface.component';

export const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'chat', component: ChatInterfaceComponent },
];
