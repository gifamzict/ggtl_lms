import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  ChevronDown,
  Check,
  Download,
  Smartphone,
  Award,
  VideoIcon,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from './cartStore';
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

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_preview: boolean;
  position: number;
  video_url: string;
  video_source: string;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();
  const { openAuthModal } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const { addToCart, items: cartItems } = useCartStore();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCourseDetails();
    }
  }, [slug, user]);

  const fetchCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          categories(name),
          profiles(full_name)
        `)
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .single();

      if (courseError) throw courseError;

      // Debug: Log the complete course data to see what fields are available
      console.log('Course data fetched:', courseData);

      setCourse(courseData);

      await checkEnrollmentStatus(courseData.id);

      // Fetch lessons grouped by sections (simplified for now)
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('position');

      if (lessonsError) throw lessonsError;

      console.log('Lessons data fetched:', lessonsData);

      // Find the first preview lesson to use as demo video
      const previewLessonData = lessonsData?.find(lesson => lesson.is_preview);
      if (previewLessonData) {
        console.log('Preview lesson found:', previewLessonData);
        setPreviewLesson(previewLessonData);
      }

      // Group lessons by sections (for now, we'll create a single section)
      const defaultSection: CourseSection = {
        id: 'main',
        title: 'Course Content',
        lessons: lessonsData || []
      };
      setSections([defaultSection]);

    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      if (data && !error) {
        setIsEnrolled(true);
      }
    } catch (error) {
      // User not enrolled, which is fine
    }
  };

  const handleEnrollment = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (!course) return;

    setEnrolling(true);

    try {
      if (course.price > 0) {
        // Handle paid course with Paystack
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('paystack-initialize', {
          body: { courseId: course.id }
        });

        if (paymentError) {
          throw new Error(paymentError.message || 'Failed to initialize payment');
        }

        if (paymentData?.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = paymentData.authorization_url;
        } else {
          throw new Error('Payment initialization failed');
        }
      } else {
        // Handle free course enrollment
        const { error } = await supabase
          .from('enrollments')
          .insert({
            user_id: user.id,
            course_id: course.id
          });

        if (error) throw error;

        setIsEnrolled(true);
        toast.success('Successfully enrolled in course!');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddToCart = () => {
    if (!course) return;
    addToCart({
      id: course.id,
      title: course.title,
      price: course.price,
      thumbnail_url: course.thumbnail_url,
      slug: course.slug,
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  const isFree = course.price === 0;
  const originalPrice = course.price * 1.5; // Mock original price for discount display
  const isInCart = cartItems.some(item => item.id === course.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-muted-foreground">
            <span>Development</span>
            <span className="mx-2">›</span>
            <span>{course.categories?.name || 'Web Development'}</span>
            <span className="mx-2">›</span>
            <span className="text-foreground">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{course.description}</p>



              <div className="flex items-center gap-4 mb-6">
                <span className="text-muted-foreground">Created by</span>
                <span className="text-primary font-medium">{course.profiles?.full_name || 'Instructor'}</span>
              </div>


            </div>

            {/* Course Preview / Demo Video */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black relative">
                  {previewLesson?.video_url ? (
                    previewLesson.video_url.includes('drive.google.com') ? (
                      <div className="video-container relative w-full h-full overflow-hidden rounded-lg">
                        <iframe
                          src={previewLesson.video_url.includes('/preview') ?
                            previewLesson.video_url :
                            previewLesson.video_url.replace('/view', '/preview')
                          }
                          width="100%"
                          height="calc(100% + 100px)"
                          frameBorder="0"
                          allow="autoplay"
                          className="absolute top-[-50px] left-0"
                          title={`${course.title} preview`}
                          style={{ width: '100%', height: 'calc(100% + 100px)' }}
                        />
                      </div>
                    ) : (
                      <ReactPlayer
                        url={previewLesson.video_url}
                        width="100%"
                        height="100%"
                        controls
                        light={course.thumbnail_url}
                        playIcon={
                          <div className="flex items-center justify-center w-16 h-16 bg-white/90 rounded-full">
                            <Play className="w-8 h-8 text-black ml-1" />
                          </div>
                        }
                      />
                    )
                  ) : course.thumbnail_url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-2" />
                          <p>Course Preview</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <Play className="w-16 h-16 mx-auto mb-2" />
                        <p>Course Preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Course Content */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Course content</h2>
                  <Button variant="link" className="text-primary">
                    Expand all sections
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4">
                  {sections.reduce((total, section) => total + section.lessons.length, 0)} sections • {course.total_lessons} lectures • {formatDuration(course.total_duration)} total length
                </p>

                <div className="space-y-2">
                  {sections.map((section) => (
                    <div key={section.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
                      >
                        <div>
                          <h3 className="font-medium">{section.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {section.lessons.length} lectures • {formatDuration(section.lessons.reduce((total, lesson) => total + lesson.duration, 0))}
                          </p>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedSections.has(section.id) ? 'rotate-180' : ''}`} />
                      </button>

                      {expandedSections.has(section.id) && (
                        <div className="border-t">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                              <div className="flex items-center gap-3">
                                <VideoIcon className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{lesson.title}</span>
                                {lesson.is_preview && (
                                  <Badge variant="outline" className="text-xs">Preview</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.description }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isFree ? (
                      <span className="text-3xl font-bold">Free</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold">₦{course.price.toLocaleString()}</span>
                      </>
                    )}
                  </div>

                </div>

                <div className="space-y-3 mb-6">
                  {isEnrolled ? (
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/learn/${course.slug}`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={isFree ? handleEnrollment : handleAddToCart}
                        disabled={enrolling || isInCart}
                      >
                        {enrolling
                          ? 'Enrolling...'
                          : isFree
                            ? 'Enroll Now for Free'
                            : isInCart
                              ? 'Added to Cart'
                              : 'Add to cart'}
                      </Button>
                      {!isFree && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleEnrollment}
                          disabled={enrolling}>
                          {enrolling ? 'Processing...' : 'Buy now'}
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div className="text-center text-sm text-muted-foreground mb-4">
                  30-Day Money-Back Guarantee
                </div>
                <div className="text-center text-sm text-muted-foreground mb-6">
                  Full Lifetime Access
                </div>

                <Separator className="my-4" />


              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;