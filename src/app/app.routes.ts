import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';


// export const routes: Routes = [
// 	{ path: '', component: LandingPageComponent },
// 	{ path: 'chatV2', component: ChatComponent },
//   { path: '**', redirectTo: '/login' }
// ];


export const routes: Routes = [
  {
    path: "",
    component: LandingPageComponent,
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () => import("./pages/chat/login/login.component").then((m) => m.LoginComponent),
    // canActivate: [LoginGuard],
  },
  {
    path: "register",
    loadComponent: () => import("./pages/chat/register/register.component").then((m) => m.RegisterComponent),
    canActivate: [LoginGuard],
  },
  {
    path: "chatV2",
    loadComponent: () => import("./pages/chat/chat.component").then((m) => m.ChatComponent),
    // canActivate: [AuthGuard],
  },
//   {
//     path: "**",
//     redirectTo: "/login",
//   },
]
