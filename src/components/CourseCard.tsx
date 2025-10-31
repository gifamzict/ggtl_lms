import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Star, Clock } from 'lucide-react';
import { Course } from '@/services/api/publicApi';

interface CourseCardProps {
    course: Course;
    index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/courses/${course.slug}`);
    };

    return (
        <div
      onClick= { handleClick }
    className = "group relative cursor-pointer"
        >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" > </div>
            < div className = "relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100" >
                <div className="relative h-52 overflow-hidden" >
                    <img 
            src={ course.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop" }
    alt = { course.title }
    className = "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" > </div>
            < div className = "absolute top-4 left-4" >
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full" >
                    { course.level }
                    </span>
                    </div>
                    < div className = "absolute bottom-4 left-4 right-4 flex items-center justify-between" >
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" >
                            <Clock className="h-3 w-3 text-white" />
                                <span className="text-white text-xs font-semibold" > { course.total_duration || 0 }h </span>
                                    </div>
                                    < div className = "flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full" >
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-white text-xs font-bold" > { course.average_rating || 'N/A' } </span>
                                                </div>
                                                </div>
                                                </div>

                                                < div className = "p-6" >
                                                    <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors" >
                                                        { course.title }
                                                        </h3>

                                                        < div className = "flex items-center gap-4 mb-4 text-sm text-slate-600" >
                                                            <div className="flex items-center gap-1" >
                                                                <BookOpen className="h-4 w-4" />
                                                                    <span>{ course.total_lessons || 0 } </span>
                                                                    </div>
                                                                    < div className = "flex items-center gap-1" >
                                                                        <Users className="h-4 w-4" />
                                                                            <span>{ course.enrollment_count || 0 } </span>
                                                                            </div>
                                                                            </div>

                                                                            < div className = "flex items-center justify-between pt-4 border-t border-slate-200" >
                                                                                <div className="flex items-center gap-2" >
                                                                                    <img 
                src={ `https://i.pravatar.cc/150?img=${index + 2}` }
    alt = { course.instructor?.full_name || 'Instructor' }
    className = "w-8 h-8 rounded-full"
        />
        <span className="text-sm font-semibold text-slate-700" > { course.instructor?.full_name || 'Instructor' } </span>
            </div>
            < span className = "text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" >
              ₦{ parseFloat(course.price).toLocaleString() }
</span>
    </div>
    </div>
    </div>
    </div>
  );
};

export default CourseCard;