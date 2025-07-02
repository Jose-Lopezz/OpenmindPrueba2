import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" style="box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; align-items: center; gap: 8px;">
        <mat-icon>school</mat-icon>
        <span style="font-size: 20px; font-weight: bold;">EduPlatform</span>
      </div>
      
      <span style="flex: 1;"></span>
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; color: white;">
          <mat-icon>person</mat-icon>
          <span style="font-weight: 500;">{{ user()?.name }}</span>
        </div>
        
        <button 
          mat-stroked-button 
          (click)="logout()"
          style="color: white; border-color: white;"
        >
          <mat-icon style="margin-right: 8px;">logout</mat-icon>
          Cerrar Sesión
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: []
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user() {
    return this.authService.user;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}