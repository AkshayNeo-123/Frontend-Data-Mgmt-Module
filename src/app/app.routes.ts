import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProjectComponent } from './dashboard/project/project.component';
import { AddcontactsComponent } from './dashboard/contactsData/addcontacts/addcontacts.component';
import { AllMainPolymersComponent } from './dashboard/MainPolymerData/all-main-polymers/all-main-polymers.component';
import { GetAdditivebyidComponent } from './dashboard/additiveData/get-additivebyid/get-additivebyid.component';
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
        path: 'getmaterials',
        loadComponent: () => import('./dashboard/getmaterials/getmaterials.component').then(m => m.GetmaterialsComponent),
      },
    
      {
        path: 'getproject',
        loadComponent: () => import('./dashboard/project/project.component').then(m => m.ProjectComponent),
      },
      {
        path: 'injectionMolding',
        loadComponent: () => import('./dashboard/add-injection-molding/add-injection-molding.component').then(m => m.AddInjectionMoldingComponent),
      },
      {
        path: 'mastertable',
        loadComponent: () => import('./dashboard/mastertable/mastertable.component').then(m => m.MastertableComponent),
      },
      

      // Contact Routes
      {
        path: 'contacts',
        loadComponent: () => import('./dashboard/contacts/contacts.component').then(m => m.ContactsComponent),
        pathMatch: 'full',
      },
      {
        path: 'get-all-additives',
        loadComponent: () => import('./dashboard/get-all-additives/get-all-additives.component').then(m => m.GetAllAdditivesComponent),
        pathMatch: 'full',
      },
      {
        path: 'all-main-polymers',
        loadComponent: () => import('./dashboard/MainPolymerData/all-main-polymers/all-main-polymers.component').then(m => m.AllMainPolymersComponent),
        pathMatch: 'full',
         // Ensures that this is the default path when navigating to 'contacts'
      },
      {
        path: 'compounding',
        loadComponent: () => import('./dashboard/add-compounding/add-compounding.component').then(m => m.AddCompoundingComponent),
      },
      

      // Additive Routes
      // {
      //   path: 'addadditives',
      //   component: AddadditivesComponent,
      // },
      // {
      //   path: 'get-all-additives',
      //   component: GetAllAdditivesComponent,
      // },
      // {
      //   path: 'get-additivebyid/:id',
      //   component: GetAdditivebyidComponent
      // },{
      //   path: 'manageusers',
      //   component: ManageusersComponent
      // }
      
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
  {
    path: 'GetAllProject',
    component: ProjectComponent
  }
];
