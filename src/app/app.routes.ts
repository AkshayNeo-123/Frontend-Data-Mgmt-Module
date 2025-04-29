import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ManageusersComponent } from './dashboard/manageusers/manageusers.component';

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
    children: [
      {
        path: 'recipy',
        loadComponent: () => import('./dashboard/recipy/recipy.component').then(m => m.RecipyComponent),
      },
      {
        path: '',
        redirectTo: 'recipy', // or default dashboard child
        pathMatch: 'full'
      },
      {
        path: 'getmaterials',
        loadComponent: () => import('./dashboard/getmaterials/getmaterials.component').then(m => m.GetmaterialsComponent),
      },

      {
        path: 'getproject',
        loadComponent: () => import('./dashboard/project/project.component').then(m => m.ProjectComponent),
      },
      {
        path: 'manageusers',
        component: ManageusersComponent
      }
      
    ]
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
