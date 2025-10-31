import React from 'react';
import { useLaravelAuth } from '../../store/laravelAuthStore';
import { LogOut, User, BookOpen, Settings, Award, Mail, Phone, Calendar } from 'lucide-react';

interface UserProfileProps {
    onDashboardAccess?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onDashboardAccess }) => {
    const { user, logout } = useLaravelAuth();

    if (!user) return null;

    const handleLogout = () => {
        logout();
    };

    const handleDashboardAccess = () => {
        if (onDashboardAccess) {
            onDashboardAccess();
        } else {
            // Default: navigate to dashboard (you can implement routing here)
            window.location.href = '/dashboard';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'STUDENT': return 'bg-blue-100 text-blue-800';
            case 'INSTRUCTOR': return 'bg-green-100 text-green-800';
            case 'ADMIN': return 'bg-purple-100 text-purple-800';
            case 'SUPER_ADMIN': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className= "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4" >
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden" >
            {/* Header */ }
            < div className = "relative px-8 pt-8 pb-6 bg-gradient-to-br from-orange-500 via-red-500 to-red-600" >
                <button 
            onClick={ handleLogout }
    className = "absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
    title = "Logout"
        >
        <LogOut className="w-5 h-5" />
            </button>

            < div className = "flex items-center space-x-4" >
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm" >
                {
                    user.avatar_url ? (
                        <img 
                  src= { user.avatar_url } 
                  alt={ user.name }
                  className="w-16 h-16 rounded-full object-cover"
                    />
              ) : (
    <User className= "w-10 h-10 text-white" />
              )}
</div>

    < div className = "text-white" >
        <h1 className="text-2xl font-bold" > { user.full_name || user.name } </h1>
            < span className = {`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRoleColor(user.role)} bg-white/90`}>
                { user.role.replace('_', ' ') }
                </span>
                </div>
                </div>
                </div>

{/* Profile Information */ }
<div className="p-8" >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" >
        {/* Contact Info */ }
        < div className = "space-y-4" >
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2" >
                <Mail className="w-5 h-5 text-blue-500" />
                    Contact Information
                        </h3>

                        < div className = "space-y-3" >
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" >
                                <Mail className="w-4 h-4 text-gray-500" />
                                    <div>
                                    <p className="text-sm text-gray-600" > Email </p>
                                        < p className = "font-medium text-gray-800" > { user.email } </p>
                                            </div>
                                            </div>

{
    user.phone && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" >
            <Phone className="w-4 h-4 text-gray-500" />
                <div>
                <p className="text-sm text-gray-600" > Phone </p>
                    < p className = "font-medium text-gray-800" > { user.phone } </p>
                        </div>
                        </div>
                )
}
</div>
    </div>

{/* Account Info */ }
<div className="space-y-4" >
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2" >
        <Settings className="w-5 h-5 text-purple-500" />
            Account Details
                </h3>

                < div className = "space-y-3" >
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" >
                        <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                            <p className="text-sm text-gray-600" > Member Since </p>
                                < p className = "font-medium text-gray-800" > { formatDate(user.created_at) } </p>
                                    </div>
                                    </div>

                                    < div className = "flex items-center gap-3 p-3 bg-gray-50 rounded-lg" >
                                        <Award className="w-4 h-4 text-gray-500" />
                                            <div>
                                            <p className="text-sm text-gray-600" > Email Status </p>
                                                < p className = {`font-medium ${user.email_verified_at ? 'text-green-600' : 'text-orange-600'}`}>
                                                    { user.email_verified_at ? 'Verified' : 'Pending Verification' }
                                                    </p>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </div>

{/* Bio Section */ }
{
    user.bio && (
        <div className="mb-8" >
            <h3 className="text-lg font-semibold text-gray-800 mb-3" > About </h3>
                < p className = "text-gray-600 bg-gray-50 p-4 rounded-lg" > { user.bio } </p>
                    </div>
          )
}

{/* Action Buttons */ }
<div className="flex flex-col sm:flex-row gap-4" >
    <button
              onClick={ handleDashboardAccess }
className = "flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
    >
    <BookOpen className="w-5 h-5" />
        { user.role === 'STUDENT' ? 'Go to Student Dashboard' : 'Go to Dashboard' }
        </button>

        < button
onClick = { handleLogout }
className = "flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
    >
    <LogOut className="w-5 h-5" />
        Sign Out
            </button>
            </div>
            </div>
            </div>
            </div>
  );
};

export default UserProfile;