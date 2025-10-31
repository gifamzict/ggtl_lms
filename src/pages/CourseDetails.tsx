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
  FileText,
  TrendingUp,
  Globe,
  Shield,
  Infinity,
  CheckCircle2,
  PlayCircle,
  Sparkles
} from 'lucide-react';
import { publicApi, Course as ApiCourse } from '@/services/api/publicApi';
import { studentDashboardApi } from '@/services/api/studentDashboardApi';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { useCartStore } from '@/store/cartStore';
import {
  createPaystackConfig,
  paystackApi,
  formatCurrency,
  PaymentResponse
} from '@/services/paystackService';
import { usePaystackPayment } from 'react-paystack';
import { toast } from 'sonner';

type Course = ApiCourse;

interface Lesson {
  id: number;
  title: string;
  description: string;
  course_id: number;
  video_source: string;
  video_url: string;
  duration: number;
  position: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

const CourseDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useLaravelAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const { addItem, removeItem, isInCart: isItemInCart } = useCartStore();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchCourseDetails();
    }
  }, [slug, user]);

  const fetchCourseDetails = async () => {
    try {
      const courseData = await publicApi.getCourse(slug);
      setCourse(courseData);

      const lessonsData = courseData.lessons || [];
      const previewLessonData = lessonsData.find(lesson => lesson.is_preview);
      if (previewLessonData) {
        setPreviewLesson(previewLessonData);
      }

      const defaultSection: CourseSection = {
        id: 'main',
        title: 'Course Content',
        lessons: lessonsData || []
      };
      setSections([defaultSection]);

      // Check enrollment status if user is authenticated
      if (isAuthenticated && user && courseData.id) {
        try {
          console.log('🔍 Checking enrollment status for course:', courseData.id);
          const enrollmentData = await studentDashboardApi.checkEnrollmentStatus(courseData.id);
          console.log('📚 Enrollment data found:', enrollmentData);

          // If we get enrollment data back, user is enrolled
          if (enrollmentData) {
            console.log('✅ User is enrolled in this course');
            setIsEnrolled(true);
          }
        } catch (error) {
          // If error (including 404), user is not enrolled - don't log out
          console.log('❌ User is not enrolled in this course (this is normal):', error);
          setIsEnrolled(false);
          // Don't let enrollment check errors propagate up
        }
      } else {
        setIsEnrolled(false);
      }

    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response: PaymentResponse) => {
    console.log('🎉 Payment successful:', response);

    try {
      setIsProcessing(true);

      // Ensure user is still authenticated before processing
      if (!isAuthenticated || !user || !course) {
        console.error('❌ User or course data lost during payment');
        toast.error('Session expired during payment. Please refresh and contact support if payment was deducted.');
        return;
      }

      // Double check we have an auth token
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        console.error('❌ No auth token found during payment verification');
        toast.error('Authentication token lost. Please log in again and contact support if payment was deducted.');
        return;
      }

      console.log('✅ Auth token found, proceeding with payment verification...');
      console.log('🔄 Verifying payment with backend...');
      const verificationResult = await paystackApi.verifyPayment(response.reference, course.id);

      console.log('✅ Payment verification result:', verificationResult);

      if (verificationResult.message && verificationResult.enrollment) {
        console.log('🎓 Payment verified and enrollment completed!');
        console.log('📚 Enrollment details:', verificationResult.enrollment);
        toast.success(`🎉 Payment successful! You are now enrolled in ${course.title}`);
        setIsEnrolled(true);
        // Remove from cart if it was there
        if (inCart) {
          removeItem(course.id);
        }
      } else {
        console.log('⚠️ Payment verification succeeded but enrollment data missing');
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);

      // Provide more specific error messages
      if (error.message?.includes('401')) {
        toast.error('Authentication failed during payment verification. Please log in again and contact support if payment was deducted.');
      } else {
        toast.error('Failed to complete enrollment. Please try again or contact support if payment was deducted.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    console.log('Payment modal closed');
    setIsProcessing(false);
  };

  // PayStack configuration
  const paystackConfig = user && course ? createPaystackConfig(
    {
      email: user.email,
      amount: parseFloat(course.price),
      metadata: {
        courseId: course.id,
        courseName: course.title,
        userId: user.id,
        userName: user.name || user.email,
      },
    },
    handlePaymentSuccess,
    handlePaymentClose
  ) : null;

  // Create a default config to avoid hook errors
  const defaultConfig = {
    publicKey: 'pk_test_a88eed026b20662ed411de5ab2351008f35417d9',
    email: '',
    amount: 0,
    onSuccess: () => { },
    onClose: () => { }
  };

  const initializePayment = usePaystackPayment(paystackConfig || defaultConfig);

  const handleEnrollment = async () => {
    console.log('=== BUY NOW CLICKED (CourseDetails) ===');
    console.log('Course:', course?.title);
    console.log('User authenticated:', isAuthenticated);
    console.log('User object:', user);
    console.log('Is free course:', isFree);

    if (!isAuthenticated) {
      console.log('❌ User not authenticated');
      toast.error('Please log in to purchase courses');
      return;
    }

    if (!user) {
      console.log('❌ User object is null');
      toast.error('User information not available');
      return;
    }

    if (!course) {
      console.log('❌ Course object is null');
      toast.error('Course information not available');
      return;
    }

    if (isFree) {
      console.log('✅ Free course enrollment');
      try {
        setEnrolling(true);
        setIsEnrolled(true);
        toast.success(`Successfully enrolled in ${course.title}!`);
      } catch (error) {
        console.error('Free course enrollment error:', error);
        toast.error('Failed to enroll in free course');
      } finally {
        setEnrolling(false);
      }
      return;
    }

    // Validate PayStack configuration
    if (!paystackConfig) {
      console.error('❌ PayStack configuration is null');
      toast.error('Payment configuration error. Please contact support.');
      return;
    }

    console.log('✅ PayStack config valid, initializing payment...');
    console.log('PayStack config:', paystackConfig);

    try {
      setIsProcessing(true);
      console.log('🔄 Calling initializePayment...');

      // Call the payment initialization
      const result = initializePayment(paystackConfig);
      console.log('💳 PayStack result:', result);

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
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
    console.log('=== ADD TO CART CLICKED (CourseDetails) ===');
    console.log('Course:', course?.title, 'ID:', course?.id);

    if (!course) {
      toast.error('Course information not available');
      return;
    }

    try {
      const courseToAdd = {
        id: course.id,
        title: course.title,
        price: parseFloat(course.price),
        thumbnail_url: course.thumbnail_url || '',
        slug: course.slug,
        instructor: course.instructor.name || course.instructor.full_name || 'Instructor',
      };

      addItem(courseToAdd);
      toast.success('Course added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add course to cart');
    }
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
      <div className= "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50" >
      <motion.div 
          initial={ { opacity: 0, scale: 0.9 } }
    animate = {{ opacity: 1, scale: 1 }
  }
  className = "text-center"
    >
    <div className="relative" >
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto" > </div>
        < Sparkles className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          < p className = "mt-4 text-gray-600 font-medium" > Loading amazing content...</p>
            </motion.div>
            </div>
    );
  }

if (!course) {
  return (
    <div className= "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" >
    <motion.div 
          initial={ { opacity: 0, y: 20 } }
  animate = {{ opacity: 1, y: 0 }
}
className = "text-center"
  >
  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4" >
    <BookOpen className="w-10 h-10 text-gray-400" />
      </div>
      < h2 className = "text-3xl font-bold mb-2 text-gray-800" > Course not found </h2>
        < p className = "text-gray-600 mb-6" > The course you're looking for doesn't exist.</p>
          < Button onClick = {() => navigate('/courses')} size = "lg" className = "shadow-lg" >
            Browse Courses
              </Button>
              </motion.div>
              </div>
    );
  }

const isFree = parseFloat(course.price) === 0;
const originalPrice = parseFloat(course.price) * 1.5;
const inCart = isItemInCart(course.id); return (
  <div className= "min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" >
  {/* Hero Banner with Gradient */ }
  < div className = "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white" >
    <div className="container mx-auto px-4 py-8" >
      {/* Breadcrumb */ }
      < motion.nav
initial = {{ opacity: 0, y: -10 }}
animate = {{ opacity: 1, y: 0 }}
className = "text-sm text-blue-100 mb-6"
  >
  <span className="hover:text-white cursor-pointer transition-colors" > Development </span>
    < span className = "mx-2" >›</span>
      < span className = "hover:text-white cursor-pointer transition-colors" > { course.category?.name || 'Web Development' } </span>
        < span className = "mx-2" >›</span>
          < span className = "text-white font-medium" > { course.title } </span>
            </motion.nav>

{/* Hero Content */ }
<div className="grid lg:grid-cols-3 gap-8 pb-8" >
  <div className="lg:col-span-2" >
    <motion.div
                initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.1 }}
              >
  <Badge className="mb-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-300" >
    <Sparkles className="w-3 h-3 mr-1" />
      Bestseller
      </Badge>
      < h1 className = "text-4xl lg:text-5xl font-bold mb-4 leading-tight" > { course.title } </h1>
        < p className = "text-xl text-blue-100 mb-6 leading-relaxed" > { course.description } </p>

          < div className = "flex flex-wrap items-center gap-6 mb-6" >
            <div className="flex items-center gap-2" >
              <div className="flex" >
              {
                [...Array(5)].map((_, i) => (
                  <Star key= { i } className = "w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))
              }
                </div>
                < span className = "font-semibold" > 4.8 </span>
                  < span className = "text-blue-100" > (2, 543 ratings)</span>
                    </div>
                    < div className = "flex items-center gap-2" >
                      <Users className="w-5 h-5" />
                        <span>12, 847 students </span>
                          </div>
                          </div>

                          < div className = "flex items-center gap-3" >
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg" >
                              { course.instructor?.full_name?.charAt(0) || 'I' }
                              </div>
                              < div >
                              <p className="text-sm text-blue-100" > Created by </p>
                                < p className = "font-semibold text-lg" > { course.instructor?.full_name || 'Instructor' } </p>
                                  </div>
                                  </div>
                                  </motion.div>
                                  </div>
                                  </div>
                                  </div>
                                  </div>

                                  < div className = "container mx-auto px-4 py-8" >
                                    <div className="grid lg:grid-cols-3 gap-8" >
                                      {/* Main Content */ }
                                      < div className = "lg:col-span-2 space-y-6" >
                                        {/* Course Preview Video */ }
                                        < motion.div
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.2 }}
            >
  <Card className="overflow-hidden shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300" >
    <CardContent className="p-0" >
      <div className="aspect-video bg-black relative group" >
      {
        previewLesson?.video_url?(
          previewLesson.video_url.includes('drive.google.com') ? (
            <div className= "video-container relative w-full h-full overflow-hidden" >
            <iframe
                            src={
  previewLesson.video_url.includes('/preview') ?
    previewLesson.video_url :
    previewLesson.video_url.replace('/view', '/preview')
}
width = "100%"
height = "calc(100% + 100px)"
frameBorder = "0"
allow = "autoplay"
className = "absolute top-[-50px] left-0"
title = {`${course.title} preview`}
style = {{ width: '100%', height: 'calc(100% + 100px)' }}
                          />
  </div>
                      ) : (
  <ReactPlayer
                          url= { previewLesson.video_url }
width = "100%"
height = "100%"
controls
light = { course.thumbnail_url }
playIcon = {
                            < div className = "flex items-center justify-center w-20 h-20 bg-white/95 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300" >
  <Play className="w-10 h-10 text-blue-600 ml-1" />
    </div>
                          }
                        />
                      )
                    ) : course.thumbnail_url ? (
  <div className= "relative w-full h-full" >
  <img
                          src={ course.thumbnail_url }
alt = { course.title }
className = "w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center" >
    <motion.div 
                            className="text-center text-white"
whileHover = {{ scale: 1.05 }}
                          >
  <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mx-auto mb-3 shadow-2xl" >
    <Play className="w-10 h-10 text-blue-600 ml-1" />
      </div>
      < p className = "text-lg font-semibold" > Watch Course Preview </p>
        </motion.div>
        </div>
        </div>
                    ) : (
  <div className= "w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-blue-600 to-purple-600" >
  <div className="text-center" >
    <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-80" />
      <p className="text-xl font-semibold" > Course Preview </p>
        </div>
        </div>
                    )}
</div>
  </CardContent>
  </Card>
  </motion.div>

{/* What You'll Learn */ }
<motion.div
              initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.3 }}
            >
  <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300" >
    <CardContent className="p-8" >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" >
        <Award className="w-6 h-6 text-blue-600" />
          What you'll learn
            </h2>
            < div className = "grid md:grid-cols-2 gap-4" >
            {
              [
                'Master the fundamentals and advanced concepts',
                'Build real-world projects from scratch',
                'Best practices and industry standards',
                'Problem-solving and critical thinking skills',
                'Hands-on practical exercises',
                'Lifetime access to course materials'
              ].map((item, index) => (
                <motion.div
                        key= { index }
                        initial = {{ opacity: 0, x: -10 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: 0.4 + index * 0.05 }}
className = "flex items-start gap-3 group"
  >
  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 group-hover:scale-110 transition-transform" />
    <span className="text-gray-700 group-hover:text-gray-900 transition-colors" > { item } </span>
      </motion.div>
                    ))}
</div>
  </CardContent>
  </Card>
  </motion.div>

{/* Course Content */ }
<motion.div
              initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.4 }}
            >
  <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300" >
    <CardContent className="p-8" >
      <div className="flex items-center justify-between mb-6" >
        <h2 className="text-2xl font-bold flex items-center gap-2" >
          <BookOpen className="w-6 h-6 text-purple-600" />
            Course content
              </h2>
              < Button
variant = "link"
className = "text-blue-600 hover:text-blue-700 font-semibold"
onClick = {() => {
  if (expandedSections.size === sections.length) {
    setExpandedSections(new Set());
  } else {
    setExpandedSections(new Set(sections.map(s => s.id)));
  }
}}
                    >
  { expandedSections.size === sections.length ? 'Collapse all' : 'Expand all' }
  </Button>
  </div>

  < div className = "flex items-center gap-4 mb-6 text-sm text-gray-600" >
    <span className="flex items-center gap-1" >
      <VideoIcon className="w-4 h-4" />
        { sections.reduce((total, section) => total + section.lessons.length, 0) } sections
          </span>
          <span>•</span>
            < span className = "flex items-center gap-1" >
              <PlayCircle className="w-4 h-4" />
                { course.total_lessons } lectures
                  </span>
                  <span>•</span>
                    < span className = "flex items-center gap-1" >
                      <Clock className="w-4 h-4" />
                        { formatDuration(course.total_duration) } total
                          </span>
                          </div>

                          < div className = "space-y-3" >
                          {
                            sections.map((section, sectionIndex) => (
                              <motion.div
                        key= { section.id }
                        initial = {{ opacity: 0, y: 10 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.5 + sectionIndex * 0.05 }}
className = "border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors duration-300"
  >
  <button
                          onClick={ () => toggleSection(section.id) }
className = "w-full flex items-center justify-between p-5 text-left bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
  >
  <div className="flex-1" >
    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors" > { section.title } </h3>
      < p className = "text-sm text-gray-600" >
        { section.lessons.length } lectures • { formatDuration(section.lessons.reduce((total, lesson) => total + lesson.duration, 0)) }
</p>
  </div>
  < ChevronDown className = {`w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-blue-600 ${expandedSections.has(section.id) ? 'rotate-180' : ''}`} />
    </button>

{
  expandedSections.has(section.id) && (
    <motion.div 
                            initial={ { opacity: 0, height: 0 } }
  animate = {{ opacity: 1, height: 'auto' }
}
exit = {{ opacity: 0, height: 0 }}
className = "border-t border-gray-100 bg-white"
  >
{
  section.lessons.map((lesson, lessonIndex) => (
    <motion.div
                                key= { lesson.id }
                                initial = {{ opacity: 0, x: -10 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: lessonIndex * 0.03 }}
className = "flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors duration-200 border-b last:border-b-0 group cursor-pointer"
  >
  <div className="flex items-center gap-3 flex-1" >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform" >
      <VideoIcon className="w-4 h-4 text-blue-600" />
        </div>
        < span className = "text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors" > { lesson.title } </span>
{
  lesson.is_preview && (
    <Badge variant="outline" className = "text-xs border-green-200 text-green-700 bg-green-50" >
      <Play className="w-3 h-3 mr-1" />
        Preview
        </Badge>
                                  )
}
</div>
  < div className = "flex items-center gap-3" >
    <span className="text-sm text-gray-500" > { formatDuration(lesson.duration) } </span>
{
  lesson.is_preview && (
    <PlayCircle className="w-4 h-4 text-blue-600" />
                                  )
}
</div>
  </motion.div>
                            ))}
</motion.div>
                        )}
</motion.div>
                    ))}
</div>
  </CardContent>
  </Card>
  </motion.div>

{/* Description */ }
<motion.div
              initial={ { opacity: 0, y: 20 } }
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.5 }}
            >
  <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300" >
    <CardContent className="p-8" >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" >
        <FileText className="w-6 h-6 text-indigo-600" />
          Course Description
            </h2>
            < div
className = "prose prose-lg max-w-none text-gray-700 leading-relaxed"
dangerouslySetInnerHTML = {{ __html: course.description }}
                  />
  </CardContent>
  </Card>
  </motion.div>
  </div>

{/* Sidebar */ }
<div className="lg:col-span-1" >
  <motion.div
              initial={ { opacity: 0, x: 20 } }
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: 0.3 }}
className = "sticky top-4"
  >
  <Card className="shadow-2xl border-0 overflow-hidden" >
    {/* Preview Image/Video Thumbnail */ }
{
  course.thumbnail_url && (
    <div className="relative h-48 overflow-hidden" >
      <img 
                      src={ course.thumbnail_url }
  alt = { course.title }
  className = "w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" > </div>
      < div className = "absolute bottom-4 left-4 right-4" >
        <Badge className="bg-white/90 text-gray-900 hover:bg-white" >
          <TrendingUp className="w-3 h-3 mr-1" />
            Popular Choice
              </Badge>
              </div>
              </div>
                )
}

<CardContent className="p-6" >
  {/* Pricing */ }
  < div className = "text-center mb-6" >
  {
    isFree?(
                      <div>
    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent" > Free </span>
      < p className = "text-sm text-gray-500 mt-1" > Limited time offer </p>
        </div>
                    ) : (
  <div>
  <div className= "flex items-center justify-center gap-3 mb-2" >
  <span className="text-4xl font-bold text-gray-900" >₦{ course.price.toLocaleString() } </span>
    </div>
    < div className = "flex items-center justify-center gap-2" >
      <span className="text-lg text-gray-400 line-through" >₦{ originalPrice.toLocaleString() } </span>
        < Badge className = "bg-red-100 text-red-700 hover:bg-red-200" >
          { Math.round((1 - parseFloat(course.price) / originalPrice) * 100) } % OFF
          </Badge>
          </div>
          < p className = "text-sm text-red-600 font-medium mt-2" >🔥 Special offer ends soon! </p>
            </div>
                    )}
</div>

{/* CTA Buttons */ }
<div className="space-y-3 mb-6" >
  {
    isEnrolled?(
                      <Button
                        className = "w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        onClick = {() => navigate(`/learn/${course.slug}`)}
                      >
  <PlayCircle className="w-5 h-5 mr-2" />
    Continue Learning
      </Button>
                    ) : (
  <>
  <Button
                          className= "w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
onClick = { isFree? handleEnrollment: handleAddToCart }
disabled = { enrolling || inCart}
                        >
{
  enrolling
  ? 'Enrolling...'
    : isFree
      ? '🎉 Enroll Now for Free'
      : inCart
        ? '✓ Added to Cart'
        : 'Add to Cart'
}
  </Button>
{
  !isFree && (
    <Button
                            variant="outline"
  className = "w-full h-12 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
  onClick = { handleEnrollment }
  disabled = { enrolling }
    >
    { enrolling? 'Processing...': 'Buy Now' }
    </Button>
                        )
}
</>
                    )}
</div>

  < Separator className = "my-6" />

    {/* Course Includes */ }
    < div className = "space-y-4" >
      <h3 className="font-semibold text-lg mb-4" > This course includes: </h3>
{
  [
    { icon: VideoIcon, text: `${course.total_lessons} video lectures`, color: 'text-blue-600' },
    { icon: Clock, text: formatDuration(course.total_duration), color: 'text-purple-600' },
    { icon: Infinity, text: 'Full lifetime access', color: 'text-green-600' },
    { icon: Smartphone, text: 'Access on mobile and TV', color: 'text-orange-600' },

  ].map((item, index) => (
    <motion.div
                        key= { index }
                        initial = {{ opacity: 0, x: -10 }}
animate = {{ opacity: 1, x: 0 }}
transition = {{ delay: 0.4 + index * 0.05 }}
className = "flex items-center gap-3 group"
  >
  <item.icon className={ `w-5 h-5 ${item.color} group-hover:scale-110 transition-transform` } />
    < span className = "text-sm text-gray-700 group-hover:text-gray-900 transition-colors" > { item.text } </span>
      </motion.div>
                    ))}
</div>

  < Separator className = "my-6" />

    {/* Share Section */ }

    </CardContent>
    </Card>
    </motion.div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default CourseDetails;