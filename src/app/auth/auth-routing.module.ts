import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from "./login/login/login";
import { ForgotPassword } from './forgot-password/forgot-password/forgot-password';
import { SignupComponent } from './signup/signup/signup';

const routes : Routes = [
{path : '', redirectTo : 'login', pathMatch : 'full'},
// {path : 'login', loadChildren : () => import('./login/login.module').then(m => m.LoginModule)},
// {path : 'register', loadChildren : () => import('./register/register.module').then(m => m.RegisterModule)},
// {path : 'forgot-password', loadChildren : () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)},
{ path: 'login', component: Login },
  { path: 'signup', component: SignupComponent },
   { path: 'forgotpassword', component: ForgotPassword },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}