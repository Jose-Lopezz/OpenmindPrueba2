import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="blue-theme">
      <mat-card-header class="text-center mb-4">
        <mat-card-title style="color: #1976d2; font-size: 24px; font-weight: bold;">
          Iniciar Sesión
        </mat-card-title>
        <mat-card-subtitle style="color: #666; text-align: center;">
          Ingresa tus credenciales para acceder
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="tu@email.com">
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <mat-error>
                @if (loginForm.get('email')?.errors?.['required']) {
                  El email es requerido
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  Email inválido
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="••••••••">
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <mat-error>
                @if (loginForm.get('password')?.errors?.['required']) {
                  La contraseña es requerida
                }
                @if (loginForm.get('password')?.errors?.['minlength']) {
                  La contraseña debe tener al menos 6 caracteres
                }
              </mat-error>
            }
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="full-width"
            [disabled]="isLoading() || loginForm.invalid"
          >
            {{ isLoading() ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="text-center mt-4">
          <p style="color: #666; font-size: 14px;">
            ¿No tienes cuenta?
            <button 
              mat-button 
              color="primary" 
              (click)="switchToRegister.emit()"
              style="text-decoration: none; font-weight: 500;"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

        <div class="mt-4 p-4" style="background-color: #f0f8ff; border-radius: 8px;">
          <p style="color: #1976d2; font-size: 12px; margin: 0;">
            <strong>Demo:</strong> juan@email.com / 123456
          </p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      max-width: 400px;
      margin: 0 auto;
    }
    
    mat-card-header {
      justify-content: center;
      padding-bottom: 16px;
    }
  `]
})
export class LoginFormComponent {
  @Output() switchToRegister = new EventEmitter<void>();
  
  loginForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.snackBar.open('¡Bienvenido! Has iniciado sesión correctamente.', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Credenciales incorrectas. Intenta con juan@email.com / 123456', 'Cerrar', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Ha ocurrido un error al iniciar sesión.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}