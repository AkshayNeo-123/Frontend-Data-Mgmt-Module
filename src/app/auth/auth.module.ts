import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    AuthRoutingModule,HttpClientModule
  ]
})
export class AuthModule {}
