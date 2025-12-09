import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { Login } from './login/login/login';
import { ForgotPassword } from './forgot-password/forgot-password/forgot-password';
import { SignupComponent } from './signup/signup/signup';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    Login,
    SignupComponent,
    ForgotPassword
  ],
})
export class AuthModule {}
