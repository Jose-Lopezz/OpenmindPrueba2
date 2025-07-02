import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-form',
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
          Crear Cuenta
        </mat-card-title>
        <mat-card-subtitle style="color: #666; text-align: center;">
          Únete a nuestra plataforma de cursos
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre completo</mat-label>
            <input matInput type="text" formControlName="name" placeholder="Tu nombre completo">
            @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
              <mat-error>
                @if (registerForm.get('name')?.errors?.['required']) {
                  El nombre es requerido
                }
                @if (registerForm.get('name')?.errors?.['minlength']) {
                  El nombre debe tener al menos 2 caracteres
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="tu@email.com">
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <mat-error>
                @if (registerForm.get('email')?.errors?.['required']) {
                  El email es requerido
                }
                @if (registerForm.get('email')?.errors?.['email']) {
                  Email inválido
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="••••••••">
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <mat-error>
                @if (registerForm.get('password')?.errors?.['required']) {
                  La contraseña es requerida
                }
                @if (registerForm.get('password')?.errors?.['minlength']) {
                  La contraseña debe tener al menos 6 caracteres
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar contraseña</mat-label>
            <input matInput type="password" formControlName="confirmPassword" placeholder="••••••••">
            @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
              <mat-error>
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  Confirma tu contraseña
                }
                @if (registerForm.get('confirmPassword')?.errors?.['passwordMismatch']) {
                  Las contraseñas no coinciden
                }
              </mat-error>
            }
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="full-width"
            [disabled]="isLoading() || registerForm.invalid"
          >
            {{ isLoading() ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="text-center mt-4">
          <p style="color: #666; font-size: 14px;">
            ¿Ya tienes cuenta?
            <button 
              mat-button 
              color="primary" 
              (click)="switchToLogin.emit()"
              style="text-decoration: none; font-weight: 500;"
            >
              Inicia sesión aquí
            </button>
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
export class RegisterFormComponent {
  @Output() switchToLogin = new EventEmitter<void>();
  
  registerForm: FormGroup;
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const { name, email, password } = this.registerForm.value;
      
      this.authService.register(name, email, password).subscribe({
        next: (success) => {
          this.isLoading.set(false);
          if (success) {
            this.snackBar.open('¡Registro exitoso! Tu cuenta ha sido creada correctamente.', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Ha ocurrido un error al crear la cuenta.', 'Cerrar', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Ha ocurrido un error al registrarse.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}