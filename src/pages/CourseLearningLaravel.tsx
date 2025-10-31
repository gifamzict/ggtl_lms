import { useState, useEffect, useCallback } from 'react';
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
    ChevronRight,
    Menu,
    X,
    Award,
    BookOpen,
    Sparkles,
    TrendingUp,
    Video,
} from 'lucide-react';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { studentDashboardApi } from '@/services/api/studentDashboardApi';
import { toast } from 'sonner';

interface Course {
    id: number;
    title: string;
    description: string;
    instructor: {
        id: number;
        full_name: string;
        name: string;
    };
    total_lessons: number;
    total_duration: number;
    lessons: Lesson[];
}

interface Lesson {
    id: number;
    title: string;
    description?: string;
    video_url: string;
    video_source: 'YOUTUBE' | 'VIMEO' | 'DRIVE' | 'UPLOAD';
    duration: number;
    position: number;
    is_preview: boolean;
    course_id: number;
}

interface LessonProgress {
    id: number;
    lesson_id: number;
    completed: boolean;
    watched_duration: number;
    completed_at?: string;
}

const CourseLearning = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useLaravelAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [lessonProgress, setLessonProgress] = useState<Map<number, LessonProgress>>(new Map());
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [watchedDuration, setWatchedDuration] = useState(0);

    const fetchCourseData = useCallback(async () => {
        try {
            if (!isAuthenticated || !user) {
                toast.error('Please log in to access this course');
                navigate('/login');
                return;
            }

            const courseData = await studentDashboardApi.getLearnCourse(slug);
            setCourse(courseData);
            setLessons(courseData.lessons || []);

            if (courseData.lessons && courseData.lessons.length > 0) {
                setCurrentLesson(courseData.lessons[0]);
            }

            if (courseData.lessons) {
                const progressMap = new Map<number, LessonProgress>();
                for (const lesson of courseData.lessons) {
                    try {
                        const progress = await studentDashboardApi.getLessonProgress(lesson.id);
                        if (progress) {
                            progressMap.set(lesson.id, progress);
                        }
                    } catch (error) {
                        console.log(`No progress found for lesson ${lesson.id}`);
                    }
                }
                setLessonProgress(progressMap);
            }

        } catch (error) {
            console.error('Error fetching course:', error);
            toast.error('Failed to load course. You might not be enrolled.');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    }, [slug, user, isAuthenticated, navigate]);

    useEffect(() => {
        if (slug && isAuthenticated) {
            fetchCourseData();
        } else if (!isAuthenticated) {
            navigate('/login');
        }
    }, [slug, isAuthenticated, fetchCourseData, navigate]);

    const handleLessonSelect = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        setWatchedDuration(lessonProgress.get(lesson.id)?.watched_duration || 0);
    };

    const markLessonComplete = async (lessonId: number) => {
        try {
            await studentDashboardApi.updateLessonProgress(lessonId, {
                completed: true,
                watched_duration: currentLesson?.duration || 0
            });

            const updatedProgress = new Map(lessonProgress);
            updatedProgress.set(lessonId, {
                id: Date.now(),
                lesson_id: lessonId,
                completed: true,
                watched_duration: currentLesson?.duration || 0,
                completed_at: new Date().toISOString()
            });
            setLessonProgress(updatedProgress);

            toast.success('🎉 Lesson marked as complete!');
        } catch (error) {
            console.error('Error marking lesson complete:', error);
            toast.error('Failed to update lesson progress');
        }
    };

    const getNextLesson = () => {
        if (!currentLesson || !lessons.length) return null;
        const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
        return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
    };

    const getPreviousLesson = () => {
        if (!currentLesson || !lessons.length) return null;
        const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
        return currentIndex > 0 ? lessons[currentIndex - 1] : null;
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const getCompletedLessonsCount = () => {
        return Array.from(lessonProgress.values()).filter(p => p.completed).length;
    };

    const getCourseProgressPercentage = () => {
        if (!lessons.length) return 0;
        return Math.round((getCompletedLessonsCount() / lessons.length) * 100);
    };

    if (loading) {
        return (
            <div className= "min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center" >
            <div className="text-center" >
                <div className="relative" >
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 mx-auto" > </div>
                        < Sparkles className = "w-6 h-6 text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            < p className = "mt-6 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent" >
                                Loading your course...
        </p>
            </div>
            </div>
        );
    }

if (!course || !currentLesson) {
    return (
        <div className= "min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4" >
        <div className="text-center max-w-md" >
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl" >
                <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    < h2 className = "text-3xl font-black mb-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent" >
                        Course Not Found
                            </h2>
                            < p className = "text-gray-600 mb-6" > You might not be enrolled in this course.</p>
                                < Button
    onClick = {() => navigate('/courses')
}
className = "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-8 py-6 rounded-2xl font-bold shadow-xl"
    >
    Browse Courses
        </Button>
        </div>
        </div>
        );
    }

return (
    <div className= "min-h-screen bg-gray-50 flex overflow-hidden" >
    {/* Sidebar - Inspired by Udemy/Skillshare */ }
    < div className = {`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-96'}`}>
        {/* Course Header */ }
        < div className = "p-6 border-b border-gray-200" >
            <div className="flex items-start justify-between mb-4" >
                <div className="flex-1" >
                    <div className="flex items-center gap-2 mb-3" >
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center" >
                            <BookOpen className="w-4 h-4 text-violet-600" />
                                </div>
                                < span className = "text-sm font-semibold text-gray-600" > Course Content </span>
                                    </div>
                                    < h2 className = "font-bold text-lg text-gray-900 leading-snug mb-2" >
                                        { course.title }
                                        </h2>
                                        < p className = "text-sm text-gray-600" >
                                            { getCompletedLessonsCount() } of { lessons.length } lessons • { getCourseProgressPercentage() }% complete
                                                </p>
                                                </div>
                                                </div>

{/* Progress Bar - Udemy Style */ }
<div className="relative" >
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden" >
        <div 
                                className="h-full bg-violet-600 rounded-full transition-all duration-500"
style = {{ width: `${getCourseProgressPercentage()}%` }}
                            />
    </div>
    </div>
    </div>

{/* Lessons List */ }
<ScrollArea className="flex-1" >
    <div className="p-3 space-y-1" >
    {
        lessons.map((lesson, index) => {
            const progress = lessonProgress.get(lesson.id);
            const isCompleted = progress?.completed || false;
            const isCurrent = currentLesson.id === lesson.id;

            return (
                <div
                                    key= { lesson.id }
            className = {`group cursor-pointer transition-all duration-200 rounded-lg ${isCurrent
                ? 'bg-violet-50'
                : 'hover:bg-gray-50'
                }`
        }
                                    onClick = {() => handleLessonSelect(lesson)}
        >
        <div className="p-4" >
            <div className="flex items-start gap-3" >
                {/* Checkbox/Status */ }
                < div className = "flex-shrink-0 mt-0.5" >
                    {
                        isCompleted?(
                                                    <div className = "w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center" >
                                <CheckCircle className="w-3.5 h-3.5 text-white" fill = "white" />
                                    </div>
                        ): (
                                <div className = {`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCurrent ?'border-violet-600 bg-violet-600': 'border-gray-300'
                    }`}>
                                                        {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className={`font - semibold text - sm leading - snug ${
    isCurrent ? 'text-violet-700' : 'text-gray-900'
} `}>
                                                        {index + 1}. {lesson.title}
                                                    </h3>
                                                    {isCurrent && (
                                                        <div className="flex-shrink-0">
                                                            <div className="px-2 py-0.5 bg-violet-600 text-white text-xs font-semibold rounded">
                                                                Playing
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <PlayCircle className="w-3.5 h-3.5" />
                                                    <span>{formatDuration(lesson.duration)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {/* Header - Udemy/Skillshare Inspired */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="hover:bg-gray-100 text-gray-700"
                            >
                                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                            </Button>
                            
                            <Button 
                                variant="ghost" 
                                onClick={() => navigate(-1)}
                                className="hover:bg-gray-100 text-gray-700"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Exit Course
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Progress indicator */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-violet-600 transition-all duration-500"
                                        style={{ width: `${ getCourseProgressPercentage() }% ` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                                    {getCourseProgressPercentage()}% complete
                                </span>
                            </div>
                            
                            {!lessonProgress.get(currentLesson.id)?.completed && (
                                <Button
                                    onClick={() => markLessonComplete(currentLesson.id)}
                                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 font-semibold"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as complete
                                </Button>
                            )}
                            {lessonProgress.get(currentLesson.id)?.completed && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">Completed</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Video Player - Premium Design */}
                <div className="flex-1 bg-black relative flex items-center justify-center p-8">
                    {currentLesson.video_url ? (
                        currentLesson.video_url.includes('drive.google.com') ? (
                            <div className="w-full max-w-7xl mx-auto" style={{ aspectRatio: '16/9' }}>
                                <iframe
                                    src={
                                        currentLesson.video_url.includes('/preview')
                                            ? currentLesson.video_url
                                            : currentLesson.video_url.replace('/view', '/preview')
                                    }
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen"
                                    allowFullScreen={false}
                                    title={currentLesson.title}
                                    className="rounded-xl shadow-2xl"
                                    style={{ pointerEvents: 'auto' }}
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-7xl mx-auto" style={{ aspectRatio: '16/9' }}>
                                <ReactPlayer
                                    url={currentLesson.video_url}
                                    width="100%"
                                    height="100%"
                                    controls
                                    playing={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onProgress={(progress) => {
                                        setWatchedDuration(progress.playedSeconds);
                                    }}
                                    config={{
                                        youtube: {
                                            playerVars: { 
                                                modestbranding: 1,
                                                rel: 0,
                                                fs: 0,
                                                disablekb: 1
                                            }
                                        },
                                        vimeo: {
                                            playerOptions: {
                                                byline: false,
                                                portrait: false,
                                                title: false
                                            }
                                        }
                                    }}
                                    style={{ borderRadius: '12px', overflow: 'hidden' }}
                                />
                            </div>
                        )
                    ) : (
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                <Video className="w-12 h-12 text-white/50" />
                            </div>
                            <p className="text-white/70 text-lg font-semibold">No video available for this lesson</p>
                        </div>
                    )}
                </div>

                {/* Navigation Footer - Clean Udemy Style */}
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <Button
                            variant="outline"
                            disabled={!getPreviousLesson()}
                            onClick={() => {
                                const prev = getPreviousLesson();
                                if (prev) handleLessonSelect(prev);
                            }}
                            className="px-5 py-2.5 font-semibold border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex items-center gap-6">
                            <button
                                disabled={!getPreviousLesson()}
                                onClick={() => {
                                    const prev = getPreviousLesson();
                                    if (prev) handleLessonSelect(prev);
                                }}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    Lesson {lessons.findIndex(l => l.id === currentLesson.id) + 1} of {lessons.length}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getCompletedLessonsCount()} completed
                                </p>
                            </div>
                            
                            <button
                                disabled={!getNextLesson()}
                                onClick={() => {
                                    const next = getNextLesson();
                                    if (next) handleLessonSelect(next);
                                }}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </div>

                        <Button
                            disabled={!getNextLesson()}
                            onClick={() => {
                                const next = getNextLesson();
                                if (next) handleLessonSelect(next);
                            }}
                            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 font-semibold disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseLearning;