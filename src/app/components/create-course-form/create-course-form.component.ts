import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <mat-card style="border: 1px solid #e3f2fd;">
      <mat-card-header>
        <mat-card-title style="color: #1976d2; font-size: 24px; font-weight: bold;">
          Crear Nuevo Curso
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título del curso</mat-label>
            <input 
              matInput 
              formControlName="title" 
              placeholder="Ej: Introducción a JavaScript"
            >
            @if (courseForm.get('title')?.invalid && courseForm.get('title')?.touched) {
              <mat-error>El título es requerido</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea 
              matInput 
              formControlName="description" 
              rows="4"
              placeholder="Describe de qué trata el curso..."
            ></textarea>
            @if (courseForm.get('description')?.invalid && courseForm.get('description')?.touched) {
              <mat-error>La descripción es requerida</mat-error>
            }
          </mat-form-field>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <mat-form-field appearance="outline">
              <mat-label>Duración</mat-label>
              <input 
                matInput 
                formControlName="duration" 
                placeholder="Ej: 8 semanas"
              >
              @if (courseForm.get('duration')?.invalid && courseForm.get('duration')?.touched) {
                <mat-error>La duración es requerida</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Nivel</mat-label>
              <mat-select formControlName="level">
                <mat-option value="">Seleccionar nivel</mat-option>
                @for (level of levels; track level) {
                  <mat-option [value]="level">{{ level }}</mat-option>
                }
              </mat-select>
              @if (courseForm.get('level')?.invalid && courseForm.get('level')?.touched) {
                <mat-error>El nivel es requerido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <mat-select formControlName="category">
                <mat-option value="">Seleccionar categoría</mat-option>
                @for (category of categories; track category) {
                  <mat-option [value]="category">{{ category }}</mat-option>
                }
              </mat-select>
              @if (courseForm.get('category')?.invalid && courseForm.get('category')?.touched) {
                <mat-error>La categoría es requerida</mat-error>
              }
            </mat-form-field>
          </div>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="full-width"
            [disabled]="isSubmitting() || courseForm.invalid"
          >
            {{ isSubmitting() ? 'Creando curso...' : 'Crear Curso' }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class CreateCourseFormComponent {
  courseForm: FormGroup;
  isSubmitting = signal(false);

  levels = ['Principiante', 'Intermedio', 'Avanzado'];
  categories = ['Programación', 'Diseño', 'Marketing', 'Negocios', 'Idiomas'];

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      level: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const user = this.authService.user();
      if (!user) return;

      this.isSubmitting.set(true);
      
      const formValue = this.courseForm.value;
      const newCourse = {
        title: formValue.title,
        description: formValue.description,
        instructor: user.name,
        instructorId: user.id,
        duration: formValue.duration,
        level: formValue.level,
        category: formValue.category
      };

      this.coursesService.createCourse(newCourse);
      
      // Reset form
      this.courseForm.reset();
      this.isSubmitting.set(false);
      
      this.snackBar.open(`¡Curso creado! El curso "${newCourse.title}" ha sido creado exitosamente.`, 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}