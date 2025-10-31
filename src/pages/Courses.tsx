import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Filter, ShoppingCart, Loader2 } from 'lucide-react';
import { CourseCard, Course } from '@/components/course/CourseCard';
import { useCartStore } from '@/store/cartStore';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { publicApi } from '@/services/api/publicApi';
import { toast } from 'sonner';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const { totalItems } = useCartStore();
  const { isAuthenticated, token } = useLaravelAuth();

  // Fetch courses from API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching courses from public API...');
        console.log('🔑 Auth token:', token ? 'Present' : 'Not present');

        const response = await publicApi.getCourses(undefined, token || undefined);
        console.log('✅ Courses fetched successfully:', response);

        // Map the API response to our Course interface
        const mappedCourses: Course[] = response.data.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.price || 0,
          instructor: course.instructor?.first_name + ' ' + course.instructor?.last_name || 'Unknown Instructor',
          thumbnail_url: course.thumbnail_url,
          duration: course.duration,
          level: course.level,
          rating: course.rating || 4.8,
          students_count: course.students_count || 0,
          lessons_count: course.lessons_count || course.total_lessons || 0,
          is_free: course.is_free || course.price === 0,
          is_enrolled: course.is_enrolled || false,
          slug: course.slug
        }));

        setCourses(mappedCourses);
        console.log('📚 Courses mapped and set:', mappedCourses);
      } catch (error) {
        console.error('❌ Error fetching courses:', error);
        toast.error('Failed to load courses. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleEnrollmentSuccess = (courseId: number) => {
    console.log(`Successfully enrolled in course ${courseId}`);
    toast.success('Enrollment successful! Welcome to your new course.');

    // Optionally refresh courses to update enrollment status
    // fetchCourses();
  };

  const filteredCourses = courses.filter(course => {
    const levelMatch = selectedLevel === 'all' || course.level === selectedLevel;
    const priceMatch = priceFilter === 'all' ||
      (priceFilter === 'free' && course.is_free) ||
      (priceFilter === 'paid' && !course.is_free);

    return levelMatch && priceMatch;
  });

  if (loading) {
    return (
      <div className= "min-h-screen bg-gray-50 flex items-center justify-center" >
      <div className="text-center" >
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2" > Loading Courses </h2>
            < p className = "text-gray-500" > Fetching latest courses from database...</p>
              </div>
              </div>
    );
  }

  return (
    <div className= "min-h-screen bg-gray-50" >
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-16" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <div className="text-center" >
          <h1 className="text-4xl font-bold mb-4" > Course Catalog </h1>
            < p className = "text-xl text-blue-200" >
              Discover and purchase courses to advance your skills
                </p>
                </div>
                </div>
                </div>

                < div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
                  <div className="mb-8 flex flex-wrap gap-4 items-center justify-between" >
                    <div className="flex flex-wrap gap-4" >
                      <div className="flex items-center gap-2" >
                        <Filter className="w-4 h-4" />
                          <select
                value={ selectedLevel }
  onChange = {(e) => setSelectedLevel(e.target.value)
}
className = "border rounded-md px-3 py-2"
  >
  <option value="all" > All Levels </option>
    < option value = "beginner" > Beginner </option>
      < option value = "intermediate" > Intermediate </option>
        < option value = "advanced" > Advanced </option>
          </select>
          </div>

          < div className = "flex items-center gap-2" >
            <select
                value={ priceFilter }
onChange = {(e) => setPriceFilter(e.target.value)}
className = "border rounded-md px-3 py-2"
  >
  <option value="all" > All Prices </option>
    < option value = "free" > Free </option>
      < option value = "paid" > Paid </option>
        </select>
        </div>
        </div>

{
  isAuthenticated && totalItems > 0 && (
    <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-md" >
      <ShoppingCart className="w-4 h-4" />
        <span>{ totalItems } items in cart </span>
          </div>
          )
}
</div>

  < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
  {
    filteredCourses.map((course) => (
      <motion.div
              key= { course.id }
              initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.3 }}
            >
  <CourseCard
                course={ course }
onEnrollmentSuccess = { handleEnrollmentSuccess }
  />
  </motion.div>
          ))}
</div>

{
  filteredCourses.length === 0 && (
    <div className="text-center py-12" >
      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2" > No courses found </h3>
          < p className = "text-gray-500" > Try adjusting your filters to see more courses.</p>
            </div>
        )
}

<div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6" >
  <h3 className="text-lg font-semibold text-green-800 mb-2" >
            💳 Secure Payment with Paystack
</h3>
< div className = "space-y-2 text-sm text-green-700" >
  <p>✅ Safe and secure payment processing </p>
    <p>✅ Multiple payment options: Cards, Bank Transfer, USSD </p>
      <p>✅ Instant course access after payment </p>
        <p>✅ Add multiple courses to cart for bulk purchase </p>
          </div>
          </div>
          </div>
          </div>
  );
}
