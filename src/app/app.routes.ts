import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChatInterfaceComponent } from './chat-interface/chat-interface.component';

export const routes: Routes = [
	{ path: '', component: LandingPageComponent },
	{ path: 'chat', component: ChatInterfaceComponent },
];
