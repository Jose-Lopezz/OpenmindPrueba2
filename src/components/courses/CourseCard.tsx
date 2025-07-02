
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, BookOpen } from 'lucide-react';
import { Course } from '@/contexts/CoursesContext';
import { useCourses } from '@/contexts/CoursesContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
  onViewDetails?: (courseId: string) => void;
}

const CourseCard = ({ course, showEnrollButton = true, onViewDetails }: CourseCardProps) => {
  const { enrollInCourse } = useCourses();
  const { user } = useAuth();

  const isEnrolled = course.enrolledStudents.includes(user?.id || '');

  const handleEnroll = () => {
    if (user) {
      enrollInCourse(course.id, user.id);
      toast({
        title: "¡Matriculado!",
        description: `Te has matriculado en ${course.title}`,
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-blue-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {course.category}
          </Badge>
        </div>
        <CardTitle className="text-xl text-blue-800 line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="text-gray-600 line-clamp-3">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.enrolledStudents.length} estudiantes</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {showEnrollButton && !isEnrolled && (
            <Button 
              onClick={handleEnroll}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Matricularme
            </Button>
          )}
          
          {isEnrolled && (
            <Button 
              variant="outline" 
              className="flex-1 border-green-500 text-green-600"
              disabled
            >
              Matriculado ✓
            </Button>
          )}
          
          {onViewDetails && (
            <Button 
              variant="outline" 
              onClick={() => onViewDetails(course.id)}
              className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Ver detalles
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
