import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingComponent } from '../landing/landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    AuthRoutingModule,
    LandingComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule { }