import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRoutingModule } from "../../auth-routing.module";

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, AuthRoutingModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
msg = '';
  errorMsg = '';
  email = '';

  constructor( private authService: AuthService) {}

  async submit() {
    try {
      await this.authService.forgotPassword(this.email);
      this.msg = "Password reset link sent!";
    } catch (err: any) {
      this.errorMsg = err.message;
    }
  }
}
