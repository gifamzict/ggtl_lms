import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  total_lessons: number;
  total_duration: number;
  profiles?: {
    full_name: string;
  };
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  video_source: 'YOUTUBE' | 'VIMEO' | 'DRIVE' | 'UPLOAD';
  duration: number;
  position: number;
  is_preview: boolean;
  course_id: string;
}

interface LessonProgress {
  id: string;
  lesson_id: string;
  completed: boolean;
  watched_duration: number;
  completed_at?: string;
}

const CourseLearning = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<string, LessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [watchedDuration, setWatchedDuration] = useState(0);

  useEffect(() => {
    if (slug && user) {
      fetchCourseData();
    }
  }, [slug, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .single();

      if (courseError) throw courseError;

      // Check if user is enrolled
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user!.id)
        .eq('course_id', courseData.id)
        .single();

      if (enrollmentError || !enrollmentData) {
        toast.error('You are not enrolled in this course');
        navigate('/courses');
        return;
      }

      setCourse(courseData);

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id)
        .order('position');

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Fetch lesson progress
      const { data: progressData, error: progressError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('lesson_id', (lessonsData || []).map(l => l.id));

      if (!progressError && progressData) {
        const progressMap = new Map();
        progressData.forEach(progress => {
          progressMap.set(progress.lesson_id, progress);
        });
        setLessonProgress(progressMap);
      }

      // Set current lesson (first incomplete or first lesson)
      const firstIncompleteLesson = lessonsData?.find(lesson => {
        const progress = progressData?.find(p => p.lesson_id === lesson.id);
        return !progress?.completed;
      });
      
      setCurrentLesson(firstIncompleteLesson || lessonsData?.[0] || null);

    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
    setWatchedDuration(0);
  };

  const handleProgress = (progress: { playedSeconds: number }) => {
    setWatchedDuration(progress.playedSeconds);
    
    // Auto-save progress every 10 seconds
    if (Math.floor(progress.playedSeconds) % 10 === 0 && currentLesson) {
      saveProgress(currentLesson.id, progress.playedSeconds, false);
    }
  };

  const handleEnded = () => {
    if (currentLesson) {
      saveProgress(currentLesson.id, currentLesson.duration, true);
      // Auto-advance to next lesson
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    }
  };

  const saveProgress = async (lessonId: string, watchedSeconds: number, completed: boolean) => {
    if (!user) return;

    try {
      const progressData = {
        user_id: user.id,
        lesson_id: lessonId,
        watched_duration: Math.floor(watchedSeconds),
        completed,
        completed_at: completed ? new Date().toISOString() : null
      };

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(progressData, { onConflict: 'user_id,lesson_id' });

      if (error) throw error;

      // Update local state
      setLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(lessonId, {
          id: '',
          lesson_id: lessonId,
          completed,
          watched_duration: Math.floor(watchedSeconds)
        });
        return newMap;
      });

      if (completed) {
        toast.success('Lesson completed!');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
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

  const getVideoUrl = (lesson: Lesson) => {
    switch (lesson.video_source) {
      case 'DRIVE':
        // Extract file ID from various Google Drive URL formats
        const url = lesson.video_url;
        let fileId = '';
        
        // Handle different Google Drive URL formats
        if (url.includes('/view')) {
          fileId = url.split('/d/')[1]?.split('/view')[0];
        } else if (url.includes('id=')) {
          fileId = url.split('id=')[1]?.split('&')[0];
        } else if (url.includes('/file/d/')) {
          fileId = url.split('/file/d/')[1]?.split('/')[0];
        }
        
        if (fileId) {
          console.log('Original URL:', url);
          console.log('Extracted File ID:', fileId);
          const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
          console.log('Preview URL:', previewUrl);
          return previewUrl;
        }
        
        return lesson.video_url;
      case 'UPLOAD':
        return lesson.video_url;
      default:
        return lesson.video_url;
    }
  };

  const calculateOverallProgress = () => {
    if (lessons.length === 0) return 0;
    const completedLessons = lessons.filter(lesson => 
      lessonProgress.get(lesson.id)?.completed
    ).length;
    return (completedLessons / lessons.length) * 100;
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

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <Button onClick={() => navigate('/student/courses')}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/courses')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="font-semibold">{course.title}</h1>
            <p className="text-sm text-muted-foreground">
              {course.profiles?.full_name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Progress: {Math.round(calculateOverallProgress())}%
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="md:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="w-full max-w-5xl aspect-video">
              {currentLesson.video_source === 'DRIVE' ? (
                <iframe
                  src={getVideoUrl(currentLesson)}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay"
                  className="rounded-lg"
                  title={currentLesson.title}
                />
              ) : (
                <ReactPlayer
                  url={getVideoUrl(currentLesson)}
                  width="100%"
                  height="100%"
                  controls
                  playing={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onProgress={handleProgress}
                  onEnded={handleEnded}
                  onStart={() => {
                    const progress = lessonProgress.get(currentLesson.id);
                    if (progress?.watched_duration) {
                      // Resume from last position
                    }
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Lesson Info */}
          <div className="bg-background p-6 border-t">
            <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
            {currentLesson.description && (
              <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(currentLesson.duration)}</span>
              </div>
              {lessonProgress.get(currentLesson.id)?.completed && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'hidden' : 'block'} w-80 bg-background border-l flex flex-col`}>
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-2">Course Content</h3>
            <Progress value={calculateOverallProgress()} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {lessons.filter(l => lessonProgress.get(l.id)?.completed).length} of {lessons.length} complete
            </p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {lessons.map((lesson, index) => {
                const progress = lessonProgress.get(lesson.id);
                const isCompleted = progress?.completed;
                const isCurrent = currentLesson.id === lesson.id;
                
                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => handleLessonSelect(lesson)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <PlayCircle className={`w-5 h-5 ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isCurrent ? 'text-primary-foreground' : ''}`}>
                          {index + 1}. {lesson.title}
                        </p>
                        <p className={`text-xs ${isCurrent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {formatDuration(lesson.duration)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;