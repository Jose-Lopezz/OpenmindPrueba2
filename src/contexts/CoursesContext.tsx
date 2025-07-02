
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  enrolledStudents: string[];
  createdAt: Date;
}

interface CoursesContextType {
  courses: Course[];
  enrolledCourses: Course[];
  createdCourses: Course[];
  createCourse: (course: Omit<Course, 'id' | 'enrolledStudents' | 'createdAt'>) => void;
  enrollInCourse: (courseId: string, userId: string) => void;
  getCourseById: (id: string) => Course | undefined;
  searchCourses: (query: string) => Course[];
  filterCoursesByCategory: (category: string) => Course[];
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const mockCourses: Course[] = [
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
];

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const createCourse = (newCourse: Omit<Course, 'id' | 'enrolledStudents' | 'createdAt'>) => {
    const course: Course = {
      ...newCourse,
      id: Math.random().toString(36).substr(2, 9),
      enrolledStudents: [],
      createdAt: new Date()
    };
    setCourses(prev => [...prev, course]);
  };

  const enrollInCourse = (courseId: string, userId: string) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, enrolledStudents: [...course.enrolledStudents, userId] }
          : course
      )
    );
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const searchCourses = (query: string) => {
    return courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterCoursesByCategory = (category: string) => {
    return courses.filter(course => course.category === category);
  };

  const enrolledCourses = courses.filter(course => 
    course.enrolledStudents.includes('1') // Mock current user ID
  );

  const createdCourses = courses.filter(course => 
    course.instructorId === '1' // Mock current user ID
  );

  return (
    <CoursesContext.Provider value={{
      courses,
      enrolledCourses,
      createdCourses,
      createCourse,
      enrollInCourse,
      getCourseById,
      searchCourses,
      filterCoursesByCategory
    }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
