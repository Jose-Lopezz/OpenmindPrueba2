import React, { useState, useMemo } from 'react';
import { useCourses } from '@/contexts/CoursesContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/courses/CourseCard';
import CourseFilters from '@/components/courses/CourseFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const { courses, enrolledCourses, createdCourses } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedLevel, setSelectedLevel] = useState('Todos');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'Todas' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const handleViewDetails = (courseId: string) => {
    // This would navigate to course details page
    console.log('Ver detalles del curso:', courseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">Panel de Cursos</h1>
          <p className="text-gray-600">Descubre y gestiona tus cursos</p>
        </div>

        <Tabs defaultValue="all-courses" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border border-blue-200">
            <TabsTrigger value="all-courses" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Todos los cursos
            </TabsTrigger>
            <TabsTrigger value="my-courses" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Mis cursos ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger value="created-courses" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Cursos creados ({createdCourses.length})
            </TabsTrigger>
            <TabsTrigger value="create-course" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Crear curso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-courses">
            <CourseFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={true}
                />
              ))}
            </div>
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No se encontraron cursos</div>
                <div className="text-gray-400 text-sm mt-2">Intenta ajustar los filtros de búsqueda</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={false}
                />
              ))}
            </div>
            
            {enrolledCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No estás matriculado en ningún curso</div>
                <div className="text-gray-400 text-sm mt-2">Explora los cursos disponibles y matricúlate en uno</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="created-courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  showEnrollButton={false}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            
            {createdCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No has creado ningún curso</div>
                <div className="text-gray-400 text-sm mt-2">Usa la pestaña "Crear curso" para empezar</div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create-course">
            <div className="max-w-2xl mx-auto">
              <CreateCourseForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const CreateCourseForm = () => {
  const { createCourse } = useCourses();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const newCourse = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      instructor: user.name,
      instructorId: user.id,
      duration: formData.get('duration') as string,
      level: formData.get('level') as 'Principiante' | 'Intermedio' | 'Avanzado',
      category: formData.get('category') as string,
    };

    createCourse(newCourse);
    
    // Reset form
    e.currentTarget.reset();
    setIsSubmitting(false);
    
    toast({
      title: "¡Curso creado!",
      description: `El curso "${newCourse.title}" ha sido creado exitosamente.`,
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Crear Nuevo Curso</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Título del curso
          </label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Ej: Introducción a JavaScript"
            className="border-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe de qué trata el curso..."
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              Duración
            </label>
            <Input
              id="duration"
              name="duration"
              required
              placeholder="Ej: 8 semanas"
              className="border-blue-200 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Nivel
            </label>
            <select
              id="level"
              name="level"
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar nivel</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar categoría</option>
              <option value="Programación">Programación</option>
              <option value="Diseño">Diseño</option>
              <option value="Marketing">Marketing</option>
              <option value="Negocios">Negocios</option>
              <option value="Idiomas">Idiomas</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Creando curso...' : 'Crear Curso'}
        </Button>
      </form>
    </div>
  );
};

export default DashboardPage;
