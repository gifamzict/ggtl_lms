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
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (slug) {
      fetchCourseDetails();
      if (user) {
        checkEnrollmentStatus();
      }
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

      // Check if user is enrolled (only if user is logged in)
      if (user) {
        const { data: enrollmentData } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .single();
        
        setIsEnrolled(!!enrollmentData);
      }

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

  const checkEnrollmentStatus = async () => {
    if (!user || !course) return;

    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();

      if (!error && data) {
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

    if (course.price > 0) {
      alert('Payment for courses will be available soon.');
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
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
                <Badge variant="secondary" className="bg-yellow-600 text-white">
                  Bestseller
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 font-bold">4.7</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">(447,965 ratings)</span>
                  <span className="text-muted-foreground">1,482,701 students</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-muted-foreground">Created by</span>
                <span className="text-primary font-medium">{course.profiles?.full_name || 'Instructor'}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated 02/2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>English</span>
                </div>
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

            {/* What You'll Learn */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Build 16 web development projects for your portfolio, ready to apply for junior developer jobs.",
                    "After the course you will be able to build ANY website you want.",
                    "Work as a freelance web developer.",
                    "Master backend development with Node",
                    "Learn the latest technologies, including Javascript, React, Node and even Web3 development.",
                    "Build fully-fledged websites and web apps for your startup or business.",
                    "Master frontend development with React",
                    "Learn professional developer best practices."
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
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

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {[
                    "No programming experience needed - I'll teach you everything you need to know",
                    "A computer with access to the internet",
                    "No paid software required",
                    "I'll walk you through, step-by-step how to get all the software installed and set up"
                  ].map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <div className="prose prose-sm max-w-none">
                  <p>
                    Welcome to the Complete Web Development Bootcamp, <strong>the only course you need</strong> to learn to code and 
                    become a full-stack web developer. With 150,000+ ratings and a 4.8 average, my Web Development course is 
                    one of the <strong>HIGHEST RATED</strong> courses in the history of Udemy!
                  </p>
                  <p>
                    At 62+ hours, this Web Development course is without a doubt the <strong>most comprehensive</strong> web development 
                    course available online. Even if you have <strong>zero</strong> programming experience, this course will take you from 
                    <strong>beginner to mastery</strong>. Here's why:
                  </p>
                  <ul>
                    <li>The course is taught by the <strong>lead instructor</strong> at the App Brewery, London's <strong>leading in-person programming bootcamp</strong>.</li>
                    <li>The course has been updated to be <strong>2024 ready</strong> and you'll be learning the latest tools and technologies used at large companies such as Apple, Google and Netflix.</li>
                  </ul>
                </div>
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
                        <span className="text-lg line-through text-muted-foreground">₦{originalPrice.toLocaleString()}</span>
                        <Badge variant="destructive" className="ml-2">85% off</Badge>
                      </>
                    )}
                  </div>
                  {!isFree && (
                    <p className="text-sm text-destructive flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      1 day left at this price!
                    </p>
                  )}
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
                        onClick={handleEnrollment}
                        disabled={enrolling || (!isFree && course.price > 0)}
                      >
                        {enrolling ? 'Enrolling...' : isFree ? 'Enroll Now for Free' : 'Add to cart'}
                      </Button>
                      {!isFree && (
                        <Button variant="outline" className="w-full" disabled>
                          Buy now
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

                <div className="space-y-3 text-sm">
                  <h3 className="font-medium">This course includes:</h3>
                  <div className="flex items-center gap-2">
                    <VideoIcon className="w-4 h-4" />
                    <span>61 hours on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>194 downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>7 coding exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Access on mobile and TV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;