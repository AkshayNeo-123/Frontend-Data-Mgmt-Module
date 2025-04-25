import { Routes } from '@angular/router';

// Import your components
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
      }
    ]
  },
  {
    path: 'dashboard',  
    component: DashboardComponent,  
  },
  {
    path: '',
    redirectTo: 'auth/login',  
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',  
  },
];
