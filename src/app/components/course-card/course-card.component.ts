import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../../models/course.model';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <mat-card class="course-card" style="height: 100%; display: flex; flex-direction: column;">
      <mat-card-header style="padding-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%; margin-bottom: 8px;">
          <mat-chip-set>
            <mat-chip [class]="getLevelClass(course.level)">
              {{ course.level }}
            </mat-chip>
          </mat-chip-set>
          <mat-chip outlined style="color: #1976d2; border-color: #e3f2fd;">
            {{ course.category }}
          </mat-chip>
        </div>
        <mat-card-title style="color: #1976d2; font-size: 20px; line-height: 1.3; margin-bottom: 8px;">
          {{ course.title }}
        </mat-card-title>
        <mat-card-subtitle style="color: #666; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
          {{ course.description }}
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content style="flex: 1; padding-top: 0;">
        <div style="display: flex; align-items: center; gap: 16px; color: #999; font-size: 14px; margin-bottom: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 4px;">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">person</mat-icon>
            <span>{{ course.instructor }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">schedule</mat-icon>
            <span>{{ course.duration }}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 4px;">
            <mat-icon style="font-size: 16px; width: 16px; height: 16px;">school</mat-icon>
            <span>{{ course.enrolledStudents.length }} estudiantes</span>
          </div>
        </div>
      </mat-card-content>

      <mat-card-actions style="padding: 16px; gap: 8px;">
        @if (showEnrollButton && !isEnrolled) {
          <button 
            mat-raised-button 
            color="primary" 
            (click)="handleEnroll()"
            style="flex: 1;"
          >
            Matricularme
          </button>
        }
        
        @if (isEnrolled) {
          <button 
            mat-stroked-button 
            disabled
            style="flex: 1; color: #4caf50; border-color: #4caf50;"
          >
            Matriculado ✓
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .level-badge {
      &.beginner {
        background-color: #e8f5e8 !important;
        color: #2e7d32 !important;
      }
      
      &.intermediate {
        background-color: #fff3e0 !important;
        color: #f57c00 !important;
      }
      
      &.advanced {
        background-color: #ffebee !important;
        color: #d32f2f !important;
      }
    }
  `]
})
export class CourseCardComponent {
  @Input() course!: Course;
  @Input() showEnrollButton = true;

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  get isEnrolled(): boolean {
    const user = this.authService.user();
    return user ? this.course.enrolledStudents.includes(user.id) : false;
  }

  getLevelClass(level: string): string {
    const baseClass = 'level-badge';
    switch (level) {
      case 'Principiante': return `${baseClass} beginner`;
      case 'Intermedio': return `${baseClass} intermediate`;
      case 'Avanzado': return `${baseClass} advanced`;
      default: return baseClass;
    }
  }

  handleEnroll() {
    const user = this.authService.user();
    if (user) {
      this.coursesService.enrollInCourse(this.course.id, user.id);
      this.snackBar.open(`¡Matriculado! Te has matriculado en ${this.course.title}`, 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}