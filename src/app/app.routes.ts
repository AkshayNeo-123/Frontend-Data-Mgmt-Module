import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProjectComponent } from './dashboard/project/project.component';
import { AddcontactsComponent } from './dashboard/contactsData/addcontacts/addcontacts.component';
import { AllMainPolymersComponent } from './dashboard/MainPolymerData/all-main-polymers/all-main-polymers.component';
import { ManageusersComponent } from './dashboard/manageusers/manageusers.component';
import { UpdateInjectionMoldingComponent } from './dashboard/update-injection-molding/update-injection-molding.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecipyComponent } from './dashboard/recipy/recipy.component';
import { GetmaterialsComponent } from './dashboard/getmaterials/getmaterials.component';
import { AddInjectionMoldingComponent } from './dashboard/add-injection-molding/add-injection-molding.component';
import { MastertableComponent } from './dashboard/mastertable/mastertable.component';
import { ContactsComponent } from './dashboard/contacts/contacts.component';
import { GetAllAdditivesComponent } from './dashboard/get-all-additives/get-all-additives.component';
import { AddCompoundingComponent } from './dashboard/add-compounding/add-compounding.component';
import { UpdateCompoundingComponent } from './dashboard/update-compounding/update-compounding.component';
import { RolemasterComponent } from './dashboard/rolemaster/rolemaster.component';
import { AddRecipyComponent } from './dashboard/recipy/add-recipy/add-recipy.component';
import { authGuard } from './auth.guard';
import { GetCompInjectComponent } from './dashboard/get-comp-inject/get-comp-inject.component';
import { RecipedetailsComponent } from './dashboard/recipedetails/recipedetails.component';
import { PermissionServiceService } from './services/permission-service.service';
import { permissionGuard } from './permission.guard';
import { AddTestComponent } from './dashboard/add-test/add-test.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';


// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },

//   { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard]
//   },
//   { path: 'recipe',
//      component: RecipyComponent,
//      canActivate: [permissionGuard],
//     data: {
//       resource: 'Recipe',
//       action: 'canView'
//     }
//      },
//   { path: 'getmaterials', component: GetmaterialsComponent ,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Materials',
//       action: 'canView'
//     }
//   },
//   { path: 'getproject', component: ProjectComponent ,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Project',
//       action: 'canView'
//     }
//   },
//   { path: 'injectionMolding', component: AddInjectionMoldingComponent },
//   { path: 'mastertable', component: MastertableComponent },
//   { path: 'contacts', component: ContactsComponent ,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Contacts',
//       action: 'canView'
//     }
//   },
//   { path: 'get-all-additives', component: GetAllAdditivesComponent,canActivate: [permissionGuard],
//     data: {
//       resource: 'Additive',
//       action: 'canView'
//     } },
//   { path: 'all-main-polymers', component: AllMainPolymersComponent,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Main Polymer',
//       action: 'canView'
//     }

//    },
//   { path: 'compounding', component: AddCompoundingComponent },
//   { path: 'updateinjectionMolding', component: UpdateInjectionMoldingComponent },
//   { path: 'updatecompounding', component: UpdateCompoundingComponent },
//   {path: 'rolemaster' , component:RolemasterComponent,

//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Role Management',
//       action: 'canView'
//     }
//   },
//   {path:'addRecipe', component:AddRecipyComponent},
//   // { path: 'GetAllProject', component: ProjectComponent },
//   { path: 'updaetInjection', component: UpdateInjectionMoldingComponent },
//   { path: 'manageusers', component: ManageusersComponent ,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'User Management',
//       action: 'canView'
//     }
//   },
//   { path: 'comp-inject', component:GetCompInjectComponent},
//    { path: 'recipedetails', component: RecipedetailsComponent },

//   {path: 'gettest',component:GetTestComponent,
//     canActivate: [permissionGuard],
//     data: {
//       resource: 'Testing',
//       action: 'canView'
//     }
//   },
//   {path:'addtest',component:AddTestComponent},

//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: '**', redirectTo: 'login' }
// ];
import { GetTestComponent } from './dashboard/get-test/get-test.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'recipe', component: RecipyComponent, canActivate: [permissionGuard], data: { resource: 'Recipe', action: 'canView' }},
  { path: 'addRecipe', component: AddRecipyComponent },

  { path: 'getmaterials', component: GetmaterialsComponent, canActivate: [permissionGuard], data: { resource: 'Materials', action: 'canView' }},
  { path: 'getproject', component: ProjectComponent, canActivate: [permissionGuard], data: { resource: 'Project', action: 'canView' }},

  { path: 'injectionMolding', component: AddInjectionMoldingComponent },
  { path: 'updateinjectionMolding', component: UpdateInjectionMoldingComponent },
  { path: 'updaetInjection', component: UpdateInjectionMoldingComponent }, // Suggest fixing typo in path name

  { path: 'mastertable', component: MastertableComponent },

  { path: 'contacts', component: ContactsComponent, canActivate: [permissionGuard], data: { resource: 'Contacts', action: 'canView' }},
  { path: 'addcontacts', component: AddcontactsComponent },

  { path: 'get-all-additives', component: GetAllAdditivesComponent, canActivate: [permissionGuard], data: { resource: 'Additive', action: 'canView' }},

  { path: 'all-main-polymers', component: AllMainPolymersComponent, canActivate: [permissionGuard], data: { resource: 'Main Polymer', action: 'canView' }},

  { path: 'compounding', component: AddCompoundingComponent },
  { path: 'updatecompounding', component: UpdateCompoundingComponent },
  { path: 'pagenotfound', component: PagenotfoundComponent },
  {path: 'rolemaster' , component:RolemasterComponent,
    canActivate: [permissionGuard],
    data: {
      resource: 'Role',
      action: 'canView'
    }
  },
  {path:'addRecipe', component:AddRecipyComponent},
  // { path: 'GetAllProject', component: ProjectComponent },
  { path: 'updaetInjection', component: UpdateInjectionMoldingComponent },
  { path: 'manageusers', component: ManageusersComponent ,
    canActivate: [permissionGuard],
    data: {
      resource: 'User',
      action: 'canView'
    }
  },
  { path: 'comp-inject', component:GetCompInjectComponent},
   { path: 'recipedetails', component: RecipedetailsComponent },

  { path: 'gettest', component: GetTestComponent, canActivate: [permissionGuard], data: { resource: 'Test List', action: 'canView' }},
  { path: 'add-test', component: AddTestComponent},
  { path: 'addtest/:id', component: AddTestComponent },
  { path: 'addtest', component: AddTestComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' },
  { path: '**', redirectTo: 'pagenotfound' },
  
//   {
//   path: 'forgot-password',
//   loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
// }
];
