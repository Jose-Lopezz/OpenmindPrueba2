import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="gradient-bg flex align-center justify-center" style="min-height: 100vh;">
      <div class="text-center">
        <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 16px; color: #1976d2;">404</h1>
        <p style="font-size: 20px; color: #666; margin-bottom: 16px;">Oops! Página no encontrada</p>
        <button mat-raised-button color="primary" (click)="goHome()">
          Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}