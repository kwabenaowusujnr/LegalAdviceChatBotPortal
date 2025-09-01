import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'chatV2', component: ChatComponent }
];
