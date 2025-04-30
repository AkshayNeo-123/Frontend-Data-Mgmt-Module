import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { AuthModule } from './app/auth/auth.module';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),     
    provideAnimations(), 
      provideToastr(),                   
    importProvidersFrom(AuthModule)     ,
[provideHttpClient()]       
  ]
}).catch((err) => console.error(err));
