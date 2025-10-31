import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Shield, ShieldCheck, Mail, Phone, Calendar, BookOpen, TrendingUp, Eye, UserX, CheckCircle, Award } from 'lucide-react';
import { adminApi, User } from '@/services/api/adminApi';

interface StudentManagementProps {
    darkMode: boolean;
    dashboardData: any;
}

interface PaginatedStudents {
    data: User[];
    total: number;
    current_page: number;
    last_page: number;
}

const StudentManagement = ({ darkMode, dashboardData }: StudentManagementProps) => {
    console.log('StudentManagement rendered with dashboardData:', dashboardData);

    const [students, setStudents] = useState<PaginatedStudents | null>(null);
    const [admins, setAdmins] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'students' | 'admins'>('students');
    const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPromoteModal, setShowPromoteModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudents();
        } else {
            fetchAdmins();
        }
    }, [activeTab, currentPage, searchTerm]);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching students...', { searchTerm, currentPage });
            const result = await adminApi.users.getStudents({
                search: searchTerm || undefined,
                page: currentPage
            });
            console.log('Students result:', result);
            setStudents(result);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching admins...');
            const result = await adminApi.users.getAdmins();
            console.log('Admins result:', result);
            setAdmins(result);
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromoteToAdmin = async (userId: number, role: 'ADMIN' | 'SUPER_ADMIN') => {
        try {
            setIsSubmitting(true);
            await adminApi.users.promoteToAdmin(userId, role);
            setShowPromoteModal(false);
            setSelectedStudent(null);
            fetchStudents();
            fetchAdmins();
            alert('User promoted successfully!');
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Error promoting user. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDemoteAdmin = async (userId: number) => {
        if (confirm('Are you sure you want to demote this admin to student?')) {
            try {
                await adminApi.users.demoteAdmin(userId);
                fetchStudents();
                fetchAdmins();
                alert('Admin demoted successfully!');
            } catch (error) {
                console.error('Error demoting admin:', error);
                alert('Error demoting admin. Please try again.');
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStudents();
    };

    const getRoleBadge = (role: string) => {
        const roleConfig = {
            STUDENT: { color: 'bg-blue-100 text-blue-800', icon: Users },
            ADMIN: { color: 'bg-purple-100 text-purple-800', icon: Shield },
            SUPER_ADMIN: { color: 'bg-red-100 text-red-800', icon: ShieldCheck },
            INSTRUCTOR: { color: 'bg-green-100 text-green-800', icon: Award }
        };

        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.STUDENT;
        const Icon = config.icon;

        return React.createElement('span',
            { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}` },
            [
                React.createElement(Icon, { key: 'icon', className: 'w-3 h-3 mr-1' }),
                role.replace('_', ' ')
            ]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading && !students && !admins.length) {
        return React.createElement('div',
            { className: 'flex items-center justify-center py-12' },
            React.createElement('div', { className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' })
        );
    }

    // Main container
    return React.createElement('div', { className: 'space-y-6' }, [
        // Header
        React.createElement('div', {
            key: 'header',
            className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'
        }, [
            React.createElement('div', { key: 'title-section' }, [
                React.createElement('h2', {
                    key: 'title',
                    className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`
                }, 'Student Management'),
                React.createElement('p', {
                    key: 'subtitle',
                    className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                }, 'Manage students, admins, and their enrollments')
            ])
        ]),

        // Stats Cards
        React.createElement('div', {
            key: 'stats',
            className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
        }, [
            // Total Students Card
            React.createElement('div', {
                key: 'total-students',
                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`
            }, [
                React.createElement('div', {
                    key: 'card-content',
                    className: 'flex items-center justify-between'
                }, [
                    React.createElement('div', { key: 'text' }, [
                        React.createElement('p', {
                            key: 'label',
                            className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        }, 'Total Students'),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                        }, dashboardData?.stats?.total_students || 0)
                    ]),
                    React.createElement(Users, { key: 'icon', className: 'w-8 h-8 text-blue-600' })
                ])
            ]),

            // Active Students Card
            React.createElement('div', {
                key: 'active-students',
                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`
            }, [
                React.createElement('div', {
                    key: 'card-content',
                    className: 'flex items-center justify-between'
                }, [
                    React.createElement('div', { key: 'text' }, [
                        React.createElement('p', {
                            key: 'label',
                            className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        }, 'Active Students'),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                        }, dashboardData?.stats?.active_students || 0)
                    ]),
                    React.createElement(CheckCircle, { key: 'icon', className: 'w-8 h-8 text-green-600' })
                ])
            ]),

            // Total Enrollments Card
            React.createElement('div', {
                key: 'total-enrollments',
                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`
            }, [
                React.createElement('div', {
                    key: 'card-content',
                    className: 'flex items-center justify-between'
                }, [
                    React.createElement('div', { key: 'text' }, [
                        React.createElement('p', {
                            key: 'label',
                            className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        }, 'Total Enrollments'),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                        }, dashboardData?.stats?.total_enrollments || 0)
                    ]),
                    React.createElement(BookOpen, { key: 'icon', className: 'w-8 h-8 text-purple-600' })
                ])
            ]),

            // New This Month Card
            React.createElement('div', {
                key: 'new-month',
                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`
            }, [
                React.createElement('div', {
                    key: 'card-content',
                    className: 'flex items-center justify-between'
                }, [
                    React.createElement('div', { key: 'text' }, [
                        React.createElement('p', {
                            key: 'label',
                            className: `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        }, 'New This Month'),
                        React.createElement('p', {
                            key: 'value',
                            className: `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                        }, dashboardData?.stats?.new_students_this_month || 0)
                    ]),
                    React.createElement(TrendingUp, { key: 'icon', className: 'w-8 h-8 text-orange-600' })
                ])
            ])
        ]),

        // Tabs
        React.createElement('div', {
            key: 'tabs',
            className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-1`
        }, [
            React.createElement('div', {
                key: 'tab-buttons',
                className: 'flex space-x-1'
            }, [
                React.createElement('button', {
                    key: 'students-tab',
                    onClick: () => setActiveTab('students'),
                    className: `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'students'
                        ? 'bg-blue-600 text-white'
                        : darkMode
                            ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`
                }, [
                    React.createElement(Users, { key: 'icon', className: 'w-4 h-4 inline mr-2' }),
                    `Students (${students?.total || 0})`
                ]),
                React.createElement('button', {
                    key: 'admins-tab',
                    onClick: () => setActiveTab('admins'),
                    className: `flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admins'
                        ? 'bg-purple-600 text-white'
                        : darkMode
                            ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`
                }, [
                    React.createElement(Shield, { key: 'icon', className: 'w-4 h-4 inline mr-2' }),
                    `Admins (${admins.length})`
                ])
            ])
        ]),

        // Search (only for students tab)
        ...(activeTab === 'students' ? [
            React.createElement('div', {
                key: 'search',
                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`
            }, [
                React.createElement('form', {
                    key: 'search-form',
                    onSubmit: handleSearch,
                    className: 'flex flex-col lg:flex-row gap-4'
                }, [
                    React.createElement('div', {
                        key: 'input-wrapper',
                        className: 'flex-1'
                    }, [
                        React.createElement('div', {
                            key: 'input-container',
                            className: 'relative'
                        }, [
                            React.createElement(Search, {
                                key: 'search-icon',
                                className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
                            }),
                            React.createElement('input', {
                                key: 'search-input',
                                type: 'text',
                                placeholder: 'Search students by name or email...',
                                value: searchTerm,
                                onChange: (e) => setSearchTerm(e.target.value),
                                className: `w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`
                            })
                        ])
                    ]),
                    React.createElement('button', {
                        key: 'search-button',
                        type: 'submit',
                        className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    }, 'Search')
                ])
            ])
        ] : []),

        // Content area - actual data tables
        React.createElement('div', {
            key: 'content',
            className: `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`
        }, [
            // Students table
            activeTab === 'students' && students?.data ?
                React.createElement('div', {
                    key: 'students-table',
                    className: 'overflow-x-auto'
                }, [
                    React.createElement('table', {
                        key: 'table',
                        className: 'w-full'
                    }, [
                        React.createElement('thead', {
                            key: 'thead',
                            className: `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`
                        }, [
                            React.createElement('tr', { key: 'header-row' }, [
                                React.createElement('th', {
                                    key: 'name-header',
                                    className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                }, 'Student'),
                                React.createElement('th', {
                                    key: 'email-header',
                                    className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                }, 'Email'),
                                React.createElement('th', {
                                    key: 'role-header',
                                    className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                }, 'Role'),
                                React.createElement('th', {
                                    key: 'joined-header',
                                    className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                }, 'Joined'),
                                React.createElement('th', {
                                    key: 'actions-header',
                                    className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                }, 'Actions')
                            ])
                        ]),
                        React.createElement('tbody', {
                            key: 'tbody',
                            className: `${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`
                        }, students.data.map((student, index) =>
                            React.createElement('tr', {
                                key: student.id,
                                className: `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`
                            }, [
                                React.createElement('td', {
                                    key: 'name-cell',
                                    className: 'px-6 py-4 whitespace-nowrap'
                                }, [
                                    React.createElement('div', {
                                        key: 'student-info',
                                        className: 'flex items-center'
                                    }, [
                                        React.createElement('div', {
                                            key: 'avatar',
                                            className: 'flex-shrink-0 h-8 w-8'
                                        }, [
                                            student.avatar_url ?
                                                React.createElement('img', {
                                                    key: 'avatar-img',
                                                    className: 'h-8 w-8 rounded-full object-cover',
                                                    src: student.avatar_url,
                                                    alt: student.full_name || student.name
                                                }) :
                                                React.createElement('div', {
                                                    key: 'avatar-placeholder',
                                                    className: 'h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'
                                                }, [
                                                    React.createElement('span', {
                                                        key: 'initial',
                                                        className: 'text-white text-xs font-medium'
                                                    }, (student.full_name || student.name).charAt(0))
                                                ])
                                        ]),
                                        React.createElement('div', {
                                            key: 'name-info',
                                            className: 'ml-3'
                                        }, [
                                            React.createElement('div', {
                                                key: 'name',
                                                className: `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                                            }, student.full_name || student.name),
                                            React.createElement('div', {
                                                key: 'id',
                                                className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                                            }, `ID: ${student.id}`)
                                        ])
                                    ])
                                ]),
                                React.createElement('td', {
                                    key: 'email-cell',
                                    className: `px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`
                                }, student.email),
                                React.createElement('td', {
                                    key: 'role-cell',
                                    className: 'px-6 py-4 whitespace-nowrap'
                                }, [
                                    React.createElement('span', {
                                        key: 'role-badge',
                                        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                                                student.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-red-100 text-red-800'
                                            }`
                                    }, student.role)
                                ]),
                                React.createElement('td', {
                                    key: 'joined-cell',
                                    className: `px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
                                }, formatDate(student.created_at)),
                                React.createElement('td', {
                                    key: 'actions-cell',
                                    className: 'px-6 py-4 whitespace-nowrap text-sm font-medium'
                                }, [
                                    React.createElement('button', {
                                        key: 'view-btn',
                                        className: 'text-blue-600 hover:text-blue-900 mr-3',
                                        onClick: () => {
                                            setSelectedStudent(student);
                                            setShowDetailModal(true);
                                        }
                                    }, 'View'),
                                    student.role === 'STUDENT' && React.createElement('button', {
                                        key: 'promote-btn',
                                        className: 'text-purple-600 hover:text-purple-900',
                                        onClick: () => {
                                            setSelectedStudent(student);
                                            setShowPromoteModal(true);
                                        }
                                    }, 'Promote')
                                ])
                            ])
                        ))
                    ])
                ]) :
                // Admins table
                activeTab === 'admins' && admins.length > 0 ?
                    React.createElement('div', {
                        key: 'admins-table',
                        className: 'overflow-x-auto'
                    }, [
                        React.createElement('table', {
                            key: 'admin-table',
                            className: 'w-full'
                        }, [
                            React.createElement('thead', {
                                key: 'admin-thead',
                                className: `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`
                            }, [
                                React.createElement('tr', { key: 'admin-header-row' }, [
                                    React.createElement('th', {
                                        key: 'admin-name-header',
                                        className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                    }, 'Admin'),
                                    React.createElement('th', {
                                        key: 'admin-email-header',
                                        className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                    }, 'Email'),
                                    React.createElement('th', {
                                        key: 'admin-role-header',
                                        className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                    }, 'Role'),
                                    React.createElement('th', {
                                        key: 'admin-joined-header',
                                        className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                    }, 'Joined'),
                                    React.createElement('th', {
                                        key: 'admin-actions-header',
                                        className: `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`
                                    }, 'Actions')
                                ])
                            ]),
                            React.createElement('tbody', {
                                key: 'admin-tbody',
                                className: `${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`
                            }, admins.map((admin, index) =>
                                React.createElement('tr', {
                                    key: admin.id,
                                    className: `hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`
                                }, [
                                    React.createElement('td', {
                                        key: 'admin-name-cell',
                                        className: 'px-6 py-4 whitespace-nowrap'
                                    }, [
                                        React.createElement('div', {
                                            key: 'admin-info',
                                            className: 'flex items-center'
                                        }, [
                                            React.createElement('div', {
                                                key: 'admin-avatar',
                                                className: 'flex-shrink-0 h-8 w-8'
                                            }, [
                                                admin.avatar_url ?
                                                    React.createElement('img', {
                                                        key: 'admin-avatar-img',
                                                        className: 'h-8 w-8 rounded-full object-cover',
                                                        src: admin.avatar_url,
                                                        alt: admin.full_name || admin.name
                                                    }) :
                                                    React.createElement('div', {
                                                        key: 'admin-avatar-placeholder',
                                                        className: 'h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-red-600 flex items-center justify-center'
                                                    }, [
                                                        React.createElement('span', {
                                                            key: 'admin-initial',
                                                            className: 'text-white text-xs font-medium'
                                                        }, (admin.full_name || admin.name).charAt(0))
                                                    ])
                                            ]),
                                            React.createElement('div', {
                                                key: 'admin-name-info',
                                                className: 'ml-3'
                                            }, [
                                                React.createElement('div', {
                                                    key: 'admin-name',
                                                    className: `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`
                                                }, admin.full_name || admin.name),
                                                React.createElement('div', {
                                                    key: 'admin-id',
                                                    className: `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                                                }, `ID: ${admin.id}`)
                                            ])
                                        ])
                                    ]),
                                    React.createElement('td', {
                                        key: 'admin-email-cell',
                                        className: `px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`
                                    }, admin.email),
                                    React.createElement('td', {
                                        key: 'admin-role-cell',
                                        className: 'px-6 py-4 whitespace-nowrap'
                                    }, [
                                        React.createElement('span', {
                                            key: 'admin-role-badge',
                                            className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'
                                                }`
                                        }, admin.role)
                                    ]),
                                    React.createElement('td', {
                                        key: 'admin-joined-cell',
                                        className: `px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
                                    }, formatDate(admin.created_at)),
                                    React.createElement('td', {
                                        key: 'admin-actions-cell',
                                        className: 'px-6 py-4 whitespace-nowrap text-sm font-medium'
                                    }, [
                                        admin.role !== 'SUPER_ADMIN' && React.createElement('button', {
                                            key: 'demote-btn',
                                            className: 'text-red-600 hover:text-red-900',
                                            onClick: () => handleDemoteAdmin(admin.id)
                                        }, 'Demote')
                                    ])
                                ])
                            ))
                        ])
                    ]) :
                    // Empty state
                    React.createElement('div', {
                        key: 'empty-state',
                        className: 'text-center py-12'
                    }, [
                        React.createElement(activeTab === 'students' ? Users : Shield, {
                            key: 'icon',
                            className: `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4`
                        }),
                        React.createElement('p', {
                            key: 'title',
                            className: `text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
                        }, `No ${activeTab} found`),
                        React.createElement('p', {
                            key: 'subtitle',
                            className: `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`
                        }, `${activeTab === 'students' ? 'Students' : 'Admins'} will appear here once available`)
                    ])
        ])
    ]);
};

export default StudentManagement;