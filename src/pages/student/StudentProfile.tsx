import { useState, useEffect } from "react";
import { useLaravelAuth } from "@/store/laravelAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    Bell,
    Globe,
    Award,
    BookOpen,
    Clock,
    Target,
    Settings,
    Lock,
    Eye,
    EyeOff,
    Star,
    Trophy,
    Certificate,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function StudentProfile() {
    const { user, isAuthenticated } = useLaravelAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
    }, [isAuthenticated, navigate]);

    return (
        <SidebarProvider>
        <div className= "min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50" >
        <StudentSidebar />
        < div className = "flex-1" >
            {/* Header */ }
            < div className = "relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8" >
                <div className="absolute inset-0 bg-black/10" > </div>
                    < div className = "absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" > </div>
                        < div className = "absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" > </div>

                            < div className = "relative z-10" >
                                <div className="flex items-center justify-between mb-6" >
                                    <div className="flex items-center space-x-4" >
                                        <SidebarTrigger className="md:hidden text-white hover:bg-white/10 rounded-lg p-2" />
                                            <div className="flex items-center space-x-4" >
                                                <div className="relative" >
                                                    <Avatar className="h-20 w-20 ring-4 ring-white/20" >
                                                        <AvatarImage src={ user?.avatar } />
                                                            < AvatarFallback className = "bg-white/20 text-white text-xl font-bold" >
                                                                { user?.first_name?.charAt(0) }{ user?.last_name?.charAt(0) }
    </AvatarFallback>
        </Avatar>
        < Button
    size = "sm"
    variant = "secondary"
    className = "absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white"
        >
        <Camera className="h-4 w-4 text-gray-600" />
            </Button>
            </div>
            < div >
            <h1 className="text-3xl font-bold text-white" >
                { user?.first_name } { user?.last_name }
    </h1>
        < p className = "text-blue-100 flex items-center mt-1" >
            <Mail className="h-4 w-4 mr-2" />
                { user?.email }
                </p>
                < div className = "flex items-center mt-2 space-x-4" >
                    <Badge className="bg-white/20 text-white border-white/30" >
                        <Calendar className="h-3 w-3 mr-1" />
                            Member since 2024
                                </Badge>
                                < Badge className = "bg-green-500/20 text-green-100 border-green-400/30" >
                                    <Target className="h-3 w-3 mr-1" />
                                        Active learner
                                            </Badge>
                                            </div>
                                            </div>
                                            </div>
                                            </div>
                                            < Button
    variant = "secondary"
    className = "bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
        <Edit className="h-4 w-4 mr-2" />
            Edit Profile
                </Button>
                </div>

    {/* Quick Stats */ }
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" >
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
            <CardContent className="p-4 text-center" >
                <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-600" > 8 </div>
                        < div className = "text-xs text-gray-600" > Courses Enrolled </div>
                            </CardContent>
                            </Card>
                            < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                <CardContent className="p-4 text-center" >
                                    <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                        <div className="text-xl font-bold text-green-600" > 3 </div>
                                            < div className = "text-xs text-gray-600" > Completed </div>
                                                </CardContent>
                                                </Card>
                                                < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                                    <CardContent className="p-4 text-center" >
                                                        <Certificate className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                                            <div className="text-xl font-bold text-orange-600" > 2 </div>
                                                                < div className = "text-xs text-gray-600" > Certificates </div>
                                                                    </CardContent>
                                                                    </Card>
                                                                    < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                                                        <CardContent className="p-4 text-center" >
                                                                            <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                                                                <div className="text-xl font-bold text-purple-600" > 127h </div>
                                                                                    < div className = "text-xs text-gray-600" > Study Time </div>
                                                                                        </CardContent>
                                                                                        </Card>
                                                                                        </div>
                                                                                        </div>
                                                                                        </div>

    {/* Profile Content */ }
    <div className="p-8" >
        <Tabs defaultValue="profile" className = "space-y-6" >
            <TabsList className="grid w-full grid-cols-4" >
                <TabsTrigger value="profile" className = "flex items-center space-x-2" >
                    <User className="h-4 w-4" />
                        <span>Profile </span>
                        </TabsTrigger>
                        < TabsTrigger value = "achievements" className = "flex items-center space-x-2" >
                            <Award className="h-4 w-4" />
                                <span>Achievements </span>
                                </TabsTrigger>
                                < TabsTrigger value = "security" className = "flex items-center space-x-2" >
                                    <Shield className="h-4 w-4" />
                                        <span>Security </span>
                                        </TabsTrigger>
                                        < TabsTrigger value = "settings" className = "flex items-center space-x-2" >
                                            <Settings className="h-4 w-4" />
                                                <span>Settings </span>
                                                </TabsTrigger>
                                                </TabsList>

                                                < TabsContent value = "profile" className = "space-y-6" >
                                                    <Card>
                                                    <CardHeader>
                                                    <CardTitle>Personal Information </CardTitle>
                                                        </CardHeader>
                                                        < CardContent className = "space-y-6" >
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
                                                                <div className="space-y-2" >
                                                                    <Label htmlFor="first_name" > First Name </Label>
                                                                        < Input
    id = "first_name"
    value = { user?.first_name || ''
}
disabled
className = "bg-gray-50"
    />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="last_name" > Last Name </Label>
            < Input
id = "last_name"
value = { user?.last_name || ''}
disabled
className = "bg-gray-50"
    />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="email" > Email Address </Label>
            < Input
id = "email"
type = "email"
value = { user?.email || ''}
disabled
className = "bg-gray-50"
    />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="phone" > Phone Number </Label>
            < Input
id = "phone"
placeholder = "+1 (555) 123-4567"
disabled
className = "bg-gray-50"
    />
    </div>
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="bio" > Bio </Label>
            < Textarea
id = "bio"
placeholder = "Tell us about yourself..."
disabled
className = "bg-gray-50"
rows = { 4}
    />
    </div>
    </CardContent>
    </Card>
    </TabsContent>

    < TabsContent value = "achievements" className = "space-y-6" >
        <Card>
        <CardHeader>
        <CardTitle className="flex items-center space-x-2" >
            <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Your Achievements </span>
                    </CardTitle>
                    </CardHeader>
                    < CardContent >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" >
                            <CardContent className="p-4" >
                                <div className="flex items-start space-x-3" >
                                    <div className="text-2xl" >🎯</div>
                                        < div className = "flex-1" >
                                            <h3 className="font-semibold text-gray-900" > First Course Completed </h3>
                                                < p className = "text-sm text-gray-600 mb-2" > Completed your first course successfully </p>
                                                    < p className = "text-xs text-gray-500" > Earned on February 1, 2024 </p>
                                                        </div>
                                                        </div>
                                                        </CardContent>
                                                        </Card>
                                                        < Card className = "bg-gradient-to-r from-red-50 to-orange-50 border-red-200" >
                                                            <CardContent className="p-4" >
                                                                <div className="flex items-start space-x-3" >
                                                                    <div className="text-2xl" >🔥</div>
                                                                        < div className = "flex-1" >
                                                                            <h3 className="font-semibold text-gray-900" > Study Streak Champion </h3>
                                                                                < p className = "text-sm text-gray-600 mb-2" > Maintained a 7 - day study streak </p>
                                                                                    < p className = "text-xs text-gray-500" > Earned on February 15, 2024 </p>
                                                                                        </div>
                                                                                        </div>
                                                                                        </CardContent>
                                                                                        </Card>
                                                                                        </div>
                                                                                        </CardContent>
                                                                                        </Card>
                                                                                        </TabsContent>

                                                                                        < TabsContent value = "security" className = "space-y-6" >
                                                                                            <Card>
                                                                                            <CardHeader>
                                                                                            <CardTitle className="flex items-center space-x-2" >
                                                                                                <Lock className="h-5 w-5" />
                                                                                                    <span>Security Settings </span>
                                                                                                        </CardTitle>
                                                                                                        </CardHeader>
                                                                                                        < CardContent className = "space-y-6" >
                                                                                                            <div className="space-y-4" >
                                                                                                                <div>
                                                                                                                <Label htmlFor="current_password" > Current Password </Label>
                                                                                                                    < Input
id = "current_password"
type = "password"
placeholder = "Enter current password"
    />
    </div>
    < div >
    <Label htmlFor="new_password" > New Password </Label>
        < Input
id = "new_password"
type = "password"
placeholder = "Enter new password"
    />
    </div>
    < div >
    <Label htmlFor="confirm_password" > Confirm New Password </Label>
        < Input
id = "confirm_password"
type = "password"
placeholder = "Confirm new password"
    />
    </div>
    </div>
    < Button className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" >
        Update Password
            </Button>
            </CardContent>
            </Card>
            </TabsContent>

            < TabsContent value = "settings" className = "space-y-6" >
                <Card>
                <CardHeader>
                <CardTitle className="flex items-center space-x-2" >
                    <Bell className="h-5 w-5" />
                        <span>Notification Preferences </span>
                            </CardTitle>
                            </CardHeader>
                            < CardContent className = "space-y-4" >
                                <div className="flex items-center justify-between" >
                                    <div>
                                    <p className="font-medium" > Email Updates </p>
                                        < p className = "text-sm text-gray-600" > Receive course updates and announcements </p>
                                            </div>
                                            < Switch defaultChecked />
                                                </div>
                                                < div className = "flex items-center justify-between" >
                                                    <div>
                                                    <p className="font-medium" > Course Reminders </p>
                                                        < p className = "text-sm text-gray-600" > Get reminded about upcoming lessons </p>
                                                            </div>
                                                            < Switch defaultChecked />
                                                                </div>
                                                                < div className = "flex items-center justify-between" >
                                                                    <div>
                                                                    <p className="font-medium" > Achievement Alerts </p>
                                                                        < p className = "text-sm text-gray-600" > Get notified when you earn achievements </p>
                                                                            </div>
                                                                            < Switch defaultChecked />
                                                                                </div>
                                                                                </CardContent>
                                                                                </Card>
                                                                                </TabsContent>
                                                                                </Tabs>
                                                                                </div>
                                                                                </div>
                                                                                </div>
                                                                                </SidebarProvider>
  );
}interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    avatar?: string;
    date_of_birth?: string;
    created_at: string;
}

interface ProfileStats {
    total_courses: number;
    completed_courses: number;
    certificates_earned: number;
    total_study_hours: number;
    current_streak: number;
    achievements: Array<{
        id: number;
        name: string;
        description: string;
        icon: string;
        earned_at: string;
    }>;
}

export default function StudentProfile() {
    const { user, isAuthenticated } = useLaravelAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        date_of_birth: ''
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        email_updates: true,
        course_reminders: true,
        achievement_alerts: true,
        marketing_emails: false
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }
        fetchProfileData();
    }, [isAuthenticated, navigate]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            // Mock profile data - replace with actual API call
            const mockProfile: UserProfile = {
                id: 1,
                first_name: user?.first_name || 'John',
                last_name: user?.last_name || 'Doe',
                email: user?.email || 'john.doe@example.com',
                phone: '+1234567890',
                location: 'New York, USA',
                bio: 'Passionate learner focused on technology and personal development.',
                created_at: '2024-01-15T00:00:00Z'
            };

            const mockStats: ProfileStats = {
                total_courses: 8,
                completed_courses: 3,
                certificates_earned: 2,
                total_study_hours: 127,
                current_streak: 15,
                achievements: [
                    {
                        id: 1,
                        name: 'First Course Completed',
                        description: 'Completed your first course successfully',
                        icon: '🎯',
                        earned_at: '2024-02-01T00:00:00Z'
                    },
                    {
                        id: 2,
                        name: 'Study Streak Champion',
                        description: 'Maintained a 7-day study streak',
                        icon: '🔥',
                        earned_at: '2024-02-15T00:00:00Z'
                    }
                ]
            };

            setProfile(mockProfile);
            setStats(mockStats);
            setFormData({
                first_name: mockProfile.first_name,
                last_name: mockProfile.last_name,
                email: mockProfile.email,
                phone: mockProfile.phone || '',
                location: mockProfile.location || '',
                bio: mockProfile.bio || '',
                date_of_birth: mockProfile.date_of_birth || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            // Mock save - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (profile) {
                setProfile({
                    ...profile,
                    ...formData
                });
            }

            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setFormData({
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone: profile.phone || '',
                location: profile.location || '',
                bio: profile.bio || '',
                date_of_birth: profile.date_of_birth || ''
            });
        }
        setEditing(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    if (loading) {
        return (
            <SidebarProvider>
            <div className= "min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50" >
            <StudentSidebar />
            < div className = "flex-1 flex items-center justify-center" >
                <motion.div 
              initial={ { opacity: 0, scale: 0.9 } }
        animate = {{ opacity: 1, scale: 1 }
    }
    className = "text-center space-y-4"
        >
        <div className="relative" >
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" > </div>
                < Sparkles className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                    < p className = "text-gray-600 font-medium" > Loading your profile...</p>
                        </motion.div>
                        </div>
                        </div>
                        </SidebarProvider>
    );
}

if (!profile || !stats) return null;

return (
    <SidebarProvider>
    <div className= "min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50" >
    <StudentSidebar />
    < div className = "flex-1" >
        {/* Header */ }
        < div className = "relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8" >
            <div className="absolute inset-0 bg-black/10" > </div>
                < div className = "absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" > </div>
                    < div className = "absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" > </div>

                        < div className = "relative z-10" >
                            <div className="flex items-center justify-between mb-6" >
                                <div className="flex items-center space-x-4" >
                                    <SidebarTrigger className="md:hidden text-white hover:bg-white/10 rounded-lg p-2" />
                                        <div className="flex items-center space-x-4" >
                                            <div className="relative" >
                                                <Avatar className="h-20 w-20 ring-4 ring-white/20" >
                                                    <AvatarImage src={ profile.avatar } />
                                                        < AvatarFallback className = "bg-white/20 text-white text-xl font-bold" >
                                                            { getInitials(profile.first_name, profile.last_name) }
                                                            </AvatarFallback>
                                                            </Avatar>
                                                            < Button
size = "sm"
variant = "secondary"
className = "absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white/90 hover:bg-white"
    >
    <Camera className="h-4 w-4 text-gray-600" />
        </Button>
        </div>
        < div >
        <h1 className="text-3xl font-bold text-white" >
            { profile.first_name } { profile.last_name }
</h1>
    < p className = "text-blue-100 flex items-center mt-1" >
        <Mail className="h-4 w-4 mr-2" />
            { profile.email }
            </p>
            < div className = "flex items-center mt-2 space-x-4" >
                <Badge className="bg-white/20 text-white border-white/30" >
                    <Calendar className="h-3 w-3 mr-1" />
                        Joined { formatDate(profile.created_at) }
</Badge>
    < Badge className = "bg-green-500/20 text-green-100 border-green-400/30" >
        <Target className="h-3 w-3 mr-1" />
            { stats.current_streak } day streak
                </Badge>
                </div>
                </div>
                </div>
                </div>
                < Button
onClick = {() => editing ? handleCancelEdit() : setEditing(true)}
variant = "secondary"
className = "bg-white/10 hover:bg-white/20 text-white border-white/20"
    >
{
    editing?(
                    <>
    <X className="h-4 w-4 mr-2" />
        Cancel
        </>
                  ) : (
    <>
    <Edit className= "h-4 w-4 mr-2" />
    Edit Profile
        </>
                  )}
</Button>
    </div>

{/* Quick Stats */ }
<div className="grid grid-cols-2 md:grid-cols-4 gap-4" >
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
        <CardContent className="p-4 text-center" >
            <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xl font-bold text-blue-600" > { stats.total_courses } </div>
                    < div className = "text-xs text-gray-600" > Courses Enrolled </div>
                        </CardContent>
                        </Card>
                        < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                            <CardContent className="p-4 text-center" >
                                <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                    <div className="text-xl font-bold text-green-600" > { stats.completed_courses } </div>
                                        < div className = "text-xs text-gray-600" > Completed </div>
                                            </CardContent>
                                            </Card>
                                            < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                                <CardContent className="p-4 text-center" >
                                                    <Certificate className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                                                        <div className="text-xl font-bold text-orange-600" > { stats.certificates_earned } </div>
                                                            < div className = "text-xs text-gray-600" > Certificates </div>
                                                                </CardContent>
                                                                </Card>
                                                                < Card className = "bg-white/95 backdrop-blur-sm border-0 shadow-lg" >
                                                                    <CardContent className="p-4 text-center" >
                                                                        <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                                                            <div className="text-xl font-bold text-purple-600" > { stats.total_study_hours }h </div>
                                                                                < div className = "text-xs text-gray-600" > Study Time </div>
                                                                                    </CardContent>
                                                                                    </Card>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>

{/* Profile Content */ }
<div className="p-8" >
    <Tabs defaultValue="profile" className = "space-y-6" >
        <TabsList className="grid w-full grid-cols-4" >
            <TabsTrigger value="profile" className = "flex items-center space-x-2" >
                <User className="h-4 w-4" />
                    <span>Profile </span>
                    </TabsTrigger>
                    < TabsTrigger value = "achievements" className = "flex items-center space-x-2" >
                        <Award className="h-4 w-4" />
                            <span>Achievements </span>
                            </TabsTrigger>
                            < TabsTrigger value = "security" className = "flex items-center space-x-2" >
                                <Shield className="h-4 w-4" />
                                    <span>Security </span>
                                    </TabsTrigger>
                                    < TabsTrigger value = "settings" className = "flex items-center space-x-2" >
                                        <Settings className="h-4 w-4" />
                                            <span>Settings </span>
                                            </TabsTrigger>
                                            </TabsList>

                                            < TabsContent value = "profile" className = "space-y-6" >
                                                <Card>
                                                <CardHeader>
                                                <CardTitle className="flex items-center justify-between" >
                                                    Personal Information
{
    editing && (
        <Button 
                          onClick={ handleSaveProfile }
    disabled = { saving }
    className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
    {
        saving?(
                            <div className = "flex items-center" >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"> </div>
                              Saving...
    </div>
                          ) : (
        <>
        <Save className= "h-4 w-4 mr-2" />
        Save Changes
            </>
                          )
}
</Button>
                      )}
</CardTitle>
    </CardHeader>
    < CardContent className = "space-y-6" >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
            <div className="space-y-2" >
                <Label htmlFor="first_name" > First Name </Label>
                    < Input
id = "first_name"
value = { formData.first_name }
onChange = {(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
                        />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="last_name" > Last Name </Label>
            < Input
id = "last_name"
value = { formData.last_name }
onChange = {(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
                        />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="email" > Email Address </Label>
            < Input
id = "email"
type = "email"
value = { formData.email }
onChange = {(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
                        />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="phone" > Phone Number </Label>
            < Input
id = "phone"
value = { formData.phone }
onChange = {(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
placeholder = "+1 (555) 123-4567"
    />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="location" > Location </Label>
            < Input
id = "location"
value = { formData.location }
onChange = {(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
placeholder = "City, Country"
    />
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="date_of_birth" > Date of Birth </Label>
            < Input
id = "date_of_birth"
type = "date"
value = { formData.date_of_birth }
onChange = {(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
                        />
    </div>
    </div>
    < div className = "space-y-2" >
        <Label htmlFor="bio" > Bio </Label>
            < Textarea
id = "bio"
value = { formData.bio }
onChange = {(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
disabled = {!editing}
className = {!editing ? "bg-gray-50" : ""}
placeholder = "Tell us about yourself..."
rows = { 4}
    />
    </div>
    </CardContent>
    </Card>
    </TabsContent>

    < TabsContent value = "achievements" className = "space-y-6" >
        <Card>
        <CardHeader>
        <CardTitle className="flex items-center space-x-2" >
            <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Your Achievements </span>
                    </CardTitle>
                    </CardHeader>
                    < CardContent >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" >
                    {
                        stats.achievements.map((achievement, index) => (
                            <motion.div
                          key= { achievement.id }
                          initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: index * 0.1 }}
                        >
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" >
        <CardContent className="p-4" >
            <div className="flex items-start space-x-3" >
                <div className="text-2xl" > { achievement.icon } </div>
                    < div className = "flex-1" >
                        <h3 className="font-semibold text-gray-900" > { achievement.name } </h3>
                            < p className = "text-sm text-gray-600 mb-2" > { achievement.description } </p>
                                < p className = "text-xs text-gray-500" >
                                    Earned on { formatDate(achievement.earned_at) }
</p>
    </div>
    </div>
    </CardContent>
    </Card>
    </motion.div>
                      ))}
</div>
    </CardContent>
    </Card>
    </TabsContent>

    < TabsContent value = "security" className = "space-y-6" >
        <Card>
        <CardHeader>
        <CardTitle className="flex items-center space-x-2" >
            <Lock className="h-5 w-5" />
                <span>Security Settings </span>
                    </CardTitle>
                    </CardHeader>
                    < CardContent className = "space-y-6" >
                        <div className="space-y-4" >
                            <div>
                            <Label htmlFor="current_password" > Current Password </Label>
                                < div className = "relative" >
                                    <Input
                            id="current_password"
type = { showPassword? "text": "password" }
placeholder = "Enter current password"
className = "pr-10"
    />
    <Button
                            type="button"
variant = "ghost"
size = "sm"
className = "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
onClick = {() => setShowPassword(!showPassword)}
                          >
    {
        showPassword?(
                              <EyeOff className = "h-4 w-4 text-gray-400" />
                            ): (
                <Eye className = "h-4 w-4 text-gray-400" />
                            )}
</Button>
    </div>
    </div>
    < div >
    <Label htmlFor="new_password" > New Password </Label>
        < Input
id = "new_password"
type = "password"
placeholder = "Enter new password"
    />
    </div>
    < div >
    <Label htmlFor="confirm_password" > Confirm New Password </Label>
        < Input
id = "confirm_password"
type = "password"
placeholder = "Confirm new password"
    />
    </div>
    </div>
    < Button className = "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" >
        Update Password
            </Button>
            </CardContent>
            </Card>

            < Card >
            <CardHeader>
            <CardTitle>Two - Factor Authentication </CardTitle>
                </CardHeader>
                < CardContent >
                <div className="flex items-center justify-between" >
                    <div>
                    <p className="font-medium" > Enable 2FA </p>
                        < p className = "text-sm text-gray-600" > Add an extra layer of security to your account </p>
                            </div>
                            < Switch />
                            </div>
                            </CardContent>
                            </Card>
                            </TabsContent>

                            < TabsContent value = "settings" className = "space-y-6" >
                                <Card>
                                <CardHeader>
                                <CardTitle className="flex items-center space-x-2" >
                                    <Bell className="h-5 w-5" />
                                        <span>Notification Preferences </span>
                                            </CardTitle>
                                            </CardHeader>
                                            < CardContent className = "space-y-4" >
                                                <div className="flex items-center justify-between" >
                                                    <div>
                                                    <p className="font-medium" > Email Updates </p>
                                                        < p className = "text-sm text-gray-600" > Receive course updates and announcements </p>
                                                            </div>
                                                            < Switch
checked = { notifications.email_updates }
onCheckedChange = {(checked) =>
setNotifications(prev => ({ ...prev, email_updates: checked }))
                        }
                      />
    </div>
    < div className = "flex items-center justify-between" >
        <div>
        <p className="font-medium" > Course Reminders </p>
            < p className = "text-sm text-gray-600" > Get reminded about upcoming lessons </p>
                </div>
                < Switch
checked = { notifications.course_reminders }
onCheckedChange = {(checked) =>
setNotifications(prev => ({ ...prev, course_reminders: checked }))
                        }
                      />
    </div>
    < div className = "flex items-center justify-between" >
        <div>
        <p className="font-medium" > Achievement Alerts </p>
            < p className = "text-sm text-gray-600" > Get notified when you earn achievements </p>
                </div>
                < Switch
checked = { notifications.achievement_alerts }
onCheckedChange = {(checked) =>
setNotifications(prev => ({ ...prev, achievement_alerts: checked }))
                        }
                      />
    </div>
    < div className = "flex items-center justify-between" >
        <div>
        <p className="font-medium" > Marketing Emails </p>
            < p className = "text-sm text-gray-600" > Receive promotional content and offers </p>
                </div>
                < Switch
checked = { notifications.marketing_emails }
onCheckedChange = {(checked) =>
setNotifications(prev => ({ ...prev, marketing_emails: checked }))
                        }
                      />
    </div>
    </CardContent>
    </Card>

    < Card >
    <CardHeader>
    <CardTitle className="flex items-center space-x-2" >
        <Globe className="h-5 w-5" />
            <span>Language & Region </span>
            </CardTitle>
            </CardHeader>
            < CardContent className = "space-y-4" >
                <div>
                <Label htmlFor="language" > Language </Label>
                    < select id = "language" className = "w-full mt-1 p-2 border rounded-md" >
                        <option value="en" > English </option>
                            < option value = "es" > Spanish </option>
                                < option value = "fr" > French </option>
                                    < option value = "de" > German </option>
                                        </select>
                                        </div>
                                        < div >
                                        <Label htmlFor="timezone" > Timezone </Label>
                                            < select id = "timezone" className = "w-full mt-1 p-2 border rounded-md" >
                                                <option value="UTC" > UTC </option>
                                                    < option value = "EST" > Eastern Time </option>
                                                        < option value = "PST" > Pacific Time </option>
                                                            < option value = "GMT" > Greenwich Mean Time </option>
                                                                </select>
                                                                </div>
                                                                </CardContent>
                                                                </Card>
                                                                </TabsContent>
                                                                </Tabs>
                                                                </div>
                                                                </div>
                                                                </div>
                                                                </SidebarProvider>
  );
}