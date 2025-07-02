import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  template: `
    <div class="gradient-bg flex align-center justify-center p-4" style="min-height: 100vh;">
      <div style="width: 100%; max-width: 400px;">
        @if (isLogin()) {
          <app-login-form (switchToRegister)="setIsLogin(false)"></app-login-form>
        } @else {
          <app-register-form (switchToLogin)="setIsLogin(true)"></app-register-form>
        }
      </div>
    </div>
  `,
  styles: []
})
export class AuthComponent {
  isLogin = signal(true);

  setIsLogin(value: boolean) {
    this.isLogin.set(value);
  }
}