import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProjectComponent } from './dashboard/project/project.component';
import { AddcontactsComponent } from './dashboard/contactsData/addcontacts/addcontacts.component';
import { AllMainPolymersComponent } from './dashboard/MainPolymerData/all-main-polymers/all-main-polymers.component';
import { GetAdditivebyidComponent } from './dashboard/additiveData/get-additivebyid/get-additivebyid.component';
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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent , canActivate: [authGuard]},
  { path: 'recipe', component: RecipyComponent },
  { path: 'getmaterials', component: GetmaterialsComponent },
  { path: 'getproject', component: ProjectComponent },
  { path: 'injectionMolding', component: AddInjectionMoldingComponent },
  { path: 'mastertable', component: MastertableComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'get-all-additives', component: GetAllAdditivesComponent },
  { path: 'all-main-polymers', component: AllMainPolymersComponent },
  { path: 'compounding', component: AddCompoundingComponent },
  { path: 'updateinjectionMolding', component: UpdateInjectionMoldingComponent },
  { path: 'updatecompounding', component: UpdateCompoundingComponent },
  {path: 'rolemaster' , component:RolemasterComponent},
  {path:'addRecipe', component:AddRecipyComponent},

  { path: 'GetAllProject', component: ProjectComponent },
  { path: 'updaetInjection', component: UpdateInjectionMoldingComponent },
  { path: 'get-additivebyid/:id', component: GetAdditivebyidComponent },
  { path: 'manageusers', component: ManageusersComponent },
  { path: 'comp-inject', component:GetCompInjectComponent},
   { path: 'recipedetails', component: RecipedetailsComponent },


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
