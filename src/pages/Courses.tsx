import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  total_lessons: number;
  total_duration: number;
  price: number;
  status: string;
  instructor_id: string;
  category_id: string;
  slug: string;
  categories?: {
    name: string;
  };
  profiles?: {
    full_name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('category') || 'all';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch published courses with instructor and category data
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select(`
            *,
            categories (name),
            profiles (full_name)
          `)
          .eq('status', 'PUBLISHED');

        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast.error('Failed to load courses');
          return;
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          toast.error('Failed to load categories');
          return;
        }

        setCourses(coursesData || []);
        setCategories(categoriesData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category_id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-background"
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              Course Catalog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Explore our comprehensive collection of courses designed to advance your career
            </motion.p>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchParams({});
              }}
            >
              All Courses
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchParams({ category: category.id });
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group cursor-pointer"
                >
                  <Link to={`/courses/${course.slug}`}>
                    <Card className="overflow-hidden border-0 bg-background shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="relative">
                      <img 
                        src={course.thumbnail_url || "/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png"} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={course.price === 0 ? "secondary" : "default"}>
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </Badge>
                      </div>
                      {course.categories && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                            {course.categories.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.total_lessons || 0} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{Math.floor((course.total_duration || 0) / 60)}h</span>
                        </div>
                      </div>
                      
                      {course.profiles && (
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {course.profiles.full_name?.charAt(0) || 'I'}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {course.profiles.full_name || 'Instructor'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-foreground">4.8</span>
                          <span className="text-sm text-muted-foreground">(245)</span>
                        </div>
                        <Button size="sm">
                          {course.price === 0 ? 'Enroll Now' : 'View Details'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Courses Found</h3>
              <p className="text-muted-foreground">
                {selectedCategory === 'all' 
                  ? 'No courses are currently available.' 
                  : 'No courses found in this category.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}