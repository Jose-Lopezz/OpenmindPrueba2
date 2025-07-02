import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <mat-card class="mb-6" style="border: 1px solid #e3f2fd;">
      <mat-card-content class="p-6">
        <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
            <mat-form-field appearance="outline">
              <mat-label>Buscar cursos</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="searchChange.emit($event)"
                placeholder="Buscar cursos..."
              >
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <mat-select 
                [(value)]="selectedCategory" 
                (selectionChange)="categoryChange.emit($event.value)"
              >
                @for (category of categories; track category) {
                  <mat-option [value]="category">{{ category }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Nivel</mat-label>
              <mat-select 
                [(value)]="selectedLevel" 
                (selectionChange)="levelChange.emit($event.value)"
              >
                @for (level of levels; track level) {
                  <mat-option [value]="level">{{ level }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class CourseFiltersComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() levelChange = new EventEmitter<string>();

  searchQuery = '';
  selectedCategory = 'Todas';
  selectedLevel = 'Todos';

  categories = ['Todas', 'Programación', 'Diseño', 'Marketing', 'Negocios', 'Idiomas'];
  levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];
}