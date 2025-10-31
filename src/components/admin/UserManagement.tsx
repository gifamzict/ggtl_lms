import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    UserPlus,
    ShieldCheck,
    Mail,
    Calendar,
    Award,
    MoreHorizontal,
    UserCheck,
    Crown,
    User
} from 'lucide-react';
import { toast } from 'sonner';

// Mock user type since we need to check the actual API structure
interface UserType {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN';
    avatar_url?: string;
    email_verified_at?: string;
    created_at: string;
}

interface UserManagementProps {
    darkMode: boolean;
}

export const UserManagement: React.FC<UserManagementProps> = ({ darkMode }) => {
    const [students, setStudents] = useState<UserType[]>([]);
    const [admins, setAdmins] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');

    useEffect(() => {
        // Mock data for now - replace with actual API calls
        setTimeout(() => {
            setStudents([
                {
                    id: 1,
                    full_name: 'John Doe',
                    email: 'john@example.com',
                    role: 'STUDENT',
                    email_verified_at: '2025-01-01',
                    created_at: '2025-01-01'
                },
                {
                    id: 2,
                    full_name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'STUDENT',
                    email_verified_at: '2025-01-02',
                    created_at: '2025-01-02'
                }
            ]);
            setAdmins([
                {
                    id: 3,
                    full_name: 'Admin User',
                    email: 'admin@example.com',
                    role: 'ADMIN',
                    email_verified_at: '2025-01-01',
                    created_at: '2025-01-01'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'ADMIN':
                return <ShieldCheck className="w-4 h-4 text-blue-500" />;
            case 'INSTRUCTOR':
                return <Award className="w-4 h-4 text-purple-500" />;
            default:
                return <User className="w-4 h-4 text-gray-500" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
            case 'ADMIN':
                return darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600';
            case 'INSTRUCTOR':
                return darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600';
            default:
                return darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600';
        }
    };

    const currentUsers = activeTab === 'students' ? students : admins;
    const filteredUsers = currentUsers.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className= "flex items-center justify-center h-64" >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" > </div>
                </div>
    );
  }

return (
    <div className= "space-y-6" >
    {/* Header */ }
    < div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
        <h2 className={ `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            User Management
                </h2>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage students, admins, and user permissions
                        </p>
                        </div>
                        </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
{
    [
    {
        title: 'Total Students',
        value: students.length,
        icon: Users,
        bgGradient: 'from-blue-500 to-blue-600'
    },
    {
        title: 'Total Admins',
        value: admins.length,
        icon: ShieldCheck,
        bgGradient: 'from-purple-500 to-purple-600'
    },
    {
        title: 'Active Users',
        value: students.filter(u => u.email_verified_at).length,
        icon: UserCheck,
        bgGradient: 'from-green-500 to-green-600'
    },
    {
        title: 'New This Month',
        value: students.filter(u => {
            const userDate = new Date(u.created_at);
            const thisMonth = new Date();
            return userDate.getMonth() === thisMonth.getMonth() &&
                userDate.getFullYear() === thisMonth.getFullYear();
        }).length,
        icon: UserPlus,
        bgGradient: 'from-orange-500 to-orange-600'
    }
    ].map((stat, index) => (
        <motion.div
            key= { stat.title }
            initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: index * 0.1 }}
className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
          >
    <div className="flex items-center justify-between" >
        <div>
        <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
            { stat.title }
            </p>
            < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                { stat.value }
                </p>
                </div>
                < div className = {`p-3 rounded-xl bg-gradient-to-r ${stat.bgGradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        </div>
                        </motion.div>
        ))}
</div>

{/* Tabs and Search */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg` }>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        {/* Tabs */ }
        < div className = "flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1" >
            <button
              onClick={ () => setActiveTab('students') }
className = {`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'students'
        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`}
            >
    Students({ students.length })
    </button>
    < button
onClick = {() => setActiveTab('admins')}
className = {`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'admins'
        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`}
            >
    Admins({ admins.length })
    </button>
    </div>

{/* Search */ }
<div className="relative" >
    <Search className={ `absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}` } />
        < input
type = "text"
placeholder = "Search users..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-w-[300px] ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
        : 'bg-gray-50 border-gray-200 text-gray-800'
    }`}
            />
    </div>
    </div>
    </div>

{/* Users Grid */ }
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
{
    filteredUsers.map((user, index) => (
        <motion.div
            key= { user.id }
            initial = {{ opacity: 0, scale: 0.9 }}
animate = {{ opacity: 1, scale: 1 }}
transition = {{ delay: index * 0.05 }}
className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group`}
          >
    {/* User Avatar */ }
    < div className = "flex items-center space-x-4 mb-4" >
        <div className="relative" >
            {
                user.avatar_url ? (
                    <img
                    src= { user.avatar_url }
                    alt={ user.full_name }
                    className="w-16 h-16 rounded-full object-cover"
                />
                ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl" >
                    { user.full_name?.substring(0, 2).toUpperCase() || user.email.substring(0, 2).toUpperCase() }
                </div>
                )}
{
    user.email_verified_at && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" >
            <UserCheck className="w-3 h-3 text-white" />
                </div>
                )
}
</div>
    < div className = "flex-1" >
        <h3 className={ `font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            { user.full_name || user.name || 'N/A' }
            </h3>
            < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { user.email }
                </p>
                </div>
                </div>

{/* User Info */ }
<div className="space-y-3 mb-6" >
    {/* Role */ }
    < div className = "flex items-center justify-between" >
        <span className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Role </span>
            < div className = "flex items-center gap-2" >
                { getRoleIcon(user.role) }
                < span className = {`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    { user.role }
                    </span>
                    </div>
                    </div>

{/* Join Date */ }
<div className="flex items-center justify-between" >
    <span className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Joined </span>
        < div className = "flex items-center gap-1" >
            <Calendar className="w-4 h-4 text-gray-400" />
                <span className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}` }>
                    { new Date(user.created_at).toLocaleDateString() }
                    </span>
                    </div>
                    </div>

{/* Email Status */ }
<div className="flex items-center justify-between" >
    <span className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Email </span>
        < div className = "flex items-center gap-1" >
            <Mail className="w-4 h-4 text-gray-400" />
                <span className={
                    `text-xs px-2 py-1 rounded-full ${user.email_verified_at
                        ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }`
}>
    { user.email_verified_at ? 'Verified' : 'Unverified' }
    </span>
    </div>
    </div>
    </div>

{/* Actions */ }
<div className="flex gap-2" >
    { activeTab === 'students' && user.role === 'STUDENT' && (
        <button
                  onClick={ () => toast.success('Feature coming soon!') }
className = "flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
    >
    Promote to Admin
        </button>
              )}

<button className={ `p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors` }>
    <MoreHorizontal className="w-4 h-4" />
        </button>
        </div>
        </motion.div>
        ))}
</div>

{
    filteredUsers.length === 0 && (
        <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-12 text-center shadow-lg` }>
            <Users className={ `w-16 h-16 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
}>
    No users found
        </p>
        < p className = {`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {
            searchTerm
            ? 'Try adjusting your search terms'
                : `No ${activeTab} available`
        }
            </p>
            </div>
      )}
</div>
  );
};