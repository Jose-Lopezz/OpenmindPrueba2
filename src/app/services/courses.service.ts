import { Injectable, signal, computed } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private coursesSignal = signal<Course[]>([
    {
      id: '1',
      title: 'Introducción a React',
      description: 'Aprende los fundamentos de React desde cero',
      instructor: 'Ana Rodríguez',
      instructorId: '1',
      duration: '8 semanas',
      level: 'Principiante',
      category: 'Programación',
      enrolledStudents: ['2'],
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Diseño UX/UI Avanzado',
      description: 'Domina las técnicas avanzadas de diseño de experiencia de usuario',
      instructor: 'Carlos López',
      instructorId: '2',
      duration: '10 semanas',
      level: 'Avanzado',
      category: 'Diseño',
      enrolledStudents: ['1'],
      createdAt: new Date('2024-02-01')
    },
    {
      id: '3',
      title: 'Marketing Digital',
      description: 'Estrategias efectivas de marketing en el mundo digital',
      instructor: 'Laura Martín',
      instructorId: '3',
      duration: '6 semanas',
      level: 'Intermedio',
      category: 'Marketing',
      enrolledStudents: [],
      createdAt: new Date('2024-02-10')
    }
  ]);

  get courses() {
    return this.coursesSignal.asReadonly();
  }

  enrolledCourses = computed(() => {
    return this.coursesSignal().filter(course => 
      course.enrolledStudents.includes('1') // Mock current user ID
    );
  });

  createdCourses = computed(() => {
    return this.coursesSignal().filter(course => 
      course.instructorId === '1' // Mock current user ID
    );
  });

  createCourse(newCourse: Omit<Course, 'id' | 'enrolledStudents' | 'createdAt'>): void {
    const course: Course = {
      ...newCourse,
      id: Math.random().toString(36).substr(2, 9),
      enrolledStudents: [],
      createdAt: new Date()
    };
    
    this.coursesSignal.update(courses => [...courses, course]);
  }

  enrollInCourse(courseId: string, userId: string): void {
    this.coursesSignal.update(courses => 
      courses.map(course => 
        course.id === courseId 
          ? { ...course, enrolledStudents: [...course.enrolledStudents, userId] }
          : course
      )
    );
  }

  getCourseById(id: string): Course | undefined {
    return this.coursesSignal().find(course => course.id === id);
  }

  searchCourses(query: string): Course[] {
    return this.coursesSignal().filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterCoursesByCategory(category: string): Course[] {
    return this.coursesSignal().filter(course => course.category === category);
  }
}