import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CourseFiltersComponent } from '../../components/course-filters/course-filters.component';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { CreateCourseFormComponent } from '../../components/create-course-form/create-course-form.component';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NavbarComponent,
    CourseFiltersComponent,
    CourseCardComponent,
    CreateCourseFormComponent
  ],
  template: `
    <app-navbar></app-navbar>
    
    <div class="gradient-bg" style="min-height: calc(100vh - 64px);">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 32px 16px;">
        <div class="mb-8">
          <h1 style="color: #1976d2; font-size: 32px; font-weight: bold; margin-bottom: 8px;">
            Panel de Cursos
          </h1>
          <p style="color: #666; margin: 0;">Descubre y gestiona tus cursos</p>
        </div>

        <mat-tab-group class="blue-theme" style="background: white; border-radius: 8px; overflow: hidden;">
          <mat-tab label="Todos los cursos">
            <div class="p-6">
              <app-course-filters
                (searchChange)="onSearchChange($event)"
                (categoryChange)="onCategoryChange($event)"
                (levelChange)="onLevelChange($event)"
              ></app-course-filters>
              
              <div class="responsive-grid">
                @for (course of filteredCourses(); track course.id) {
                  <app-course-card 
                    [course]="course" 
                    [showEnrollButton]="true"
                  ></app-course-card>
                }
              </div>
              
              @if (filteredCourses().length === 0) {
                <div class="text-center" style="padding: 48px 0;">
                  <div style="color: #999; font-size: 18px;">No se encontraron cursos</div>
                  <div style="color: #ccc; font-size: 14px; margin-top: 8px;">
                    Intenta ajustar los filtros de búsqueda
                  </div>
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab [label]="'Mis cursos (' + enrolledCourses().length + ')'">
            <div class="p-6">
              <div class="responsive-grid">
                @for (course of enrolledCourses(); track course.id) {
                  <app-course-card 
                    [course]="course" 
                    [showEnrollButton]="false"
                  ></app-course-card>
                }
              </div>
              
              @if (enrolledCourses().length === 0) {
                <div class="text-center" style="padding: 48px 0;">
                  <div style="color: #999; font-size: 18px;">No estás matriculado en ningún curso</div>
                  <div style="color: #ccc; font-size: 14px; margin-top: 8px;">
                    Explora los cursos disponibles y matricúlate en uno
                  </div>
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab [label]="'Cursos creados (' + createdCourses().length + ')'">
            <div class="p-6">
              <div class="responsive-grid">
                @for (course of createdCourses(); track course.id) {
                  <app-course-card 
                    [course]="course" 
                    [showEnrollButton]="false"
                  ></app-course-card>
                }
              </div>
              
              @if (createdCourses().length === 0) {
                <div class="text-center" style="padding: 48px 0;">
                  <div style="color: #999; font-size: 18px;">No has creado ningún curso</div>
                  <div style="color: #ccc; font-size: 14px; margin-top: 8px;">
                    Usa la pestaña "Crear curso" para empezar
                  </div>
                </div>
              }
            </div>
          </mat-tab>

          <mat-tab label="Crear curso">
            <div class="p-6" style="max-width: 800px; margin: 0 auto;">
              <app-create-course-form></app-create-course-form>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }
  `]
})
export class DashboardComponent {
  private searchQuery = signal('');
  private selectedCategory = signal('Todas');
  private selectedLevel = signal('Todos');

  constructor(private coursesService: CoursesService) {}

  get courses() {
    return this.coursesService.courses;
  }

  get enrolledCourses() {
    return this.coursesService.enrolledCourses;
  }

  get createdCourses() {
    return this.coursesService.createdCourses;
  }

  filteredCourses = computed(() => {
    return this.courses().filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
                           course.description.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
                           course.instructor.toLowerCase().includes(this.searchQuery().toLowerCase());
      
      const matchesCategory = this.selectedCategory() === 'Todas' || course.category === this.selectedCategory();
      const matchesLevel = this.selectedLevel() === 'Todos' || course.level === this.selectedLevel();
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  });

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
  }

  onLevelChange(level: string) {
    this.selectedLevel.set(level);
  }
}