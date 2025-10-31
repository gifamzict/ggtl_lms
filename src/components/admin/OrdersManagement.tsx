import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Search,
    Filter,
    Calendar,
    User,
    BookOpen,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Download,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import { adminApi } from '@/services/api/adminApi';

interface Order {
    id: number;
    user_id: number;
    course_id: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    progress_percentage: number;
    completed_lessons: number;
    enrolled_at: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        full_name?: string;
        email: string;
        avatar_url?: string;
    };
    course: {
        id: number;
        title: string;
        price: string;
        level: string;
        thumbnail_url?: string;
        total_lessons?: number;
    };
}

interface PaginatedOrders {
    data: Order[];
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
}

interface OrdersManagementProps {
    darkMode: boolean;
    dashboardData: any;
}

const OrdersManagement: React.FC<OrdersManagementProps> = ({ darkMode, dashboardData }) => {
    const [orders, setOrders] = useState<PaginatedOrders | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching orders...', { statusFilter, currentPage });

            const params: any = { page: currentPage };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            const result = await adminApi.orders.getAll(params);
            console.log('Orders result:', result);
            setOrders(result);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, just refetch orders (can be enhanced with search later)
        fetchOrders();
    };

    const getStatusBadge = (status: string, progress: number) => {
        if (status === 'COMPLETED') {
            return (
                <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" >
                <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                    </span>
            );
        } else if (progress > 0) {
    return (
        <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" >
        <Clock className="w-3 h-3 mr-1" />
            In Progress({ progress } %)
                </span>
            );
} else {
    return (
        <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" >
        <AlertCircle className="w-3 h-3 mr-1" />
            Started
            </span>
            );
}
    };

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatPrice = (price: string) => {
    return `₦${parseFloat(price).toLocaleString()}`;
};

if (isLoading && !orders) {
    return (
        <div className= "flex items-center justify-center py-12" >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" > </div>
            </div>
        );
}

const totalRevenue = orders?.data.reduce((sum, order) => sum + parseFloat(order.course.price), 0) || 0;
const completedOrders = orders?.data.filter(order => order.status === 'COMPLETED').length || 0;

return (
    <div className= "space-y-6" >
    {/* Header */ }
    < div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
        <h2 className={ `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            Orders Management
                </h2>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    View and manage all course enrollments and orders
                        </p>
                        </div>
                        < button className = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" >
                            <Download className="w-4 h-4" />
                                Export Orders
                                    </button>
                                    </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-4 gap-6" >
    <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
        <div className="flex items-center justify-between" >
            <div>
            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                Total Orders
                    </p>
                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        { orders?.total || 0}
</p>
    </div>
    < ShoppingCart className = "w-8 h-8 text-blue-600" />
        </div>
        </div>

        < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
            <div className="flex items-center justify-between" >
                <div>
                <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                    Completed Orders
                        </p>
                        < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            { completedOrders }
                            </p>
                            </div>
                            < CheckCircle className = "w-8 h-8 text-green-600" />
                                </div>
                                </div>

                                < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                    <div className="flex items-center justify-between" >
                                        <div>
                                        <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                            Page Revenue
                                                </p>
                                                < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    { formatPrice(totalRevenue.toString()) }
                                                    </p>
                                                    </div>
                                                    < DollarSign className = "w-8 h-8 text-purple-600" />
                                                        </div>
                                                        </div>

                                                        < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                            <div className="flex items-center justify-between" >
                                                                <div>
                                                                <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                                    Total Revenue
                                                                        </p>
                                                                        < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                            { formatPrice(dashboardData?.stats?.total_revenue?.toString() || '0')}
</p>
    </div>
    < TrendingUp className = "w-8 h-8 text-orange-600" />
        </div>
        </div>
        </div>

{/* Filters */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
    <div className="flex flex-col lg:flex-row gap-4" >
        {/* Search */ }
        < form onSubmit = { handleSearch } className = "flex-1" >
            <div className="relative" >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                                type="text"
placeholder = "Search orders by user or course..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
    </div>
    </form>

{/* Status Filter */ }
<div className="flex items-center gap-2" >
    <Filter className="w-5 h-5 text-gray-400" />
        <select
                            value={ statusFilter }
onChange = {(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'in-progress')}
className = {`px-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
    <option value="all" > All Orders </option>
        < option value = "completed" > Completed </option>
            < option value = "in-progress" > In Progress </option>
                </select>
                </div>
                </div>
                </div>

{/* Orders Table */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden` }>
    <div className="overflow-x-auto" >
        <table className="w-full" >
            <thead className={ `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}` }>
                <tr>
                <th className={ `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider` }>
                    Order Details
                        </th>
                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Student
                            </th>
                            < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Course
                                </th>
                                < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Progress
                                    </th>
                                    < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Price
                                        </th>
                                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Status
                                            </th>
                                            < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Actions
                                                </th>
                                                </tr>
                                                </thead>
                                                < tbody className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                                {
                                                    orders?.data.map((order) => (
                                                        <tr key= { order.id } className = {`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`} >
                                                    <td className="px-6 py-4 whitespace-nowrap" >
                                                        <div className="flex flex-col" >
                                                            <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                                                                Order #{ order.id }
</div>
    < div className = "flex items-center mt-1" >
        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
            <span className={ `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                { formatDate(order.enrolled_at) }
                </span>
                </div>
                </div>
                </td>
                < td className = "px-6 py-4 whitespace-nowrap" >
                    <div className="flex items-center" >
                        <div className="flex-shrink-0 h-8 w-8" >
                            {
                                order.user.avatar_url ? (
                                    <img
                                                        className= "h-8 w-8 rounded-full object-cover"
                                                        src={ order.user.avatar_url }
                                                        alt={ order.user.full_name || order.user.name }
                                />
                                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" >
                                <span className="text-white text-xs font-medium" >
                                {(order.user.full_name || order.user.name).charAt(0)}
                                    </span>
                                    </div>
                                )}
</div>
    < div className = "ml-3" >
        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { order.user.full_name || order.user.name }
            </div>
            < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { order.user.email }
                </div>
                </div>
                </div>
                </td>
                < td className = "px-6 py-4" >
                    <div className="flex items-center" >
                        <div className="flex-shrink-0 h-10 w-16" >
                            {
                                order.course.thumbnail_url ? (
                                    <img
                                                        className= "h-10 w-16 rounded object-cover"
                                                        src={ order.course.thumbnail_url }
                                                        alt={ order.course.title }
                                />
                                                ) : (
                                    <div className="h-10 w-16 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" >
                                <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                )}
</div>
    < div className = "ml-3" >
        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} max-w-xs truncate` }>
            { order.course.title }
            </div>
            < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { order.course.level } • { order.course.total_lessons || 0 } lessons
                    </div>
                    </div>
                    </div>
                    </td>
                    < td className = "px-6 py-4 whitespace-nowrap" >
                        <div className="flex flex-col" >
                            <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                                { order.progress_percentage } %
                                </div>
                                < div className = "w-16 bg-gray-200 rounded-full h-2 mt-1" >
                                    <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
style = {{ width: `${order.progress_percentage}%` }}
                                                > </div>
    </div>
    < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
        { order.completed_lessons } lessons
            </div>
            </div>
            </td>
            < td className = "px-6 py-4 whitespace-nowrap" >
                <div className={ `text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                    { formatPrice(order.course.price) }
                    </div>
                    </td>
                    < td className = "px-6 py-4 whitespace-nowrap" >
                        { getStatusBadge(order.status, order.progress_percentage) }
                        </td>
                        < td className = "px-6 py-4 whitespace-nowrap" >
                            <button
                                            onClick={
    () => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    }
}
className = "p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
title = "View Details"
    >
    <Eye className="w-4 h-4" />
        </button>
        </td>
        </tr>
                            ))}
</tbody>
    </table>

{
    orders?.data.length === 0 && (
        <div className="text-center py-12" >
            <ShoppingCart className={ `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
}>
    No orders found
        </p>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            Orders will appear here once students start enrolling in courses
                </p>
                </div>
                    )}
</div>

{/* Pagination */ }
{
    orders && orders.last_page > 1 && (
        <div className={ `px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}` }>
            <div className="flex items-center justify-between" >
                <div className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                    Showing { orders.from } to { orders.to } of { orders.total } orders
                        </div>
                        < div className = "flex space-x-2" >
                            <button
                                    onClick={ () => setCurrentPage(Math.max(1, currentPage - 1)) }
    disabled = { currentPage === 1
}
className = {`px-3 py-1 rounded-lg text-sm ${currentPage === 1
        ? 'text-gray-400 cursor-not-allowed'
        : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
    }`}
                                >
    Previous
    </button>
    < span className = {`px-3 py-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Page { orders.current_page } of { orders.last_page }
</span>
    < button
onClick = {() => setCurrentPage(Math.min(orders.last_page, currentPage + 1))}
disabled = { currentPage === orders.last_page}
className = {`px-3 py-1 rounded-lg text-sm ${currentPage === orders.last_page
        ? 'text-gray-400 cursor-not-allowed'
        : darkMode
            ? 'text-gray-300 hover:bg-gray-700'
            : 'text-gray-600 hover:bg-gray-100'
    }`}
                                >
    Next
    </button>
    </div>
    </div>
    </div>
                )}
</div>

{/* Order Detail Modal */ }
{
    showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        Order Details #{ selectedOrder.id }
    </h3>
        < button
    onClick = {() => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    }
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                ✕
</button>
    </div>

    < div className = "space-y-6" >
        {/* Student Info */ }
        < div >
        <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Student Information </h4>
            < div className = "flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                <div className="flex-shrink-0" >
                    {
                        selectedOrder.user.avatar_url ? (
                            <img
                                                className= "h-12 w-12 rounded-full object-cover"
                                                src={ selectedOrder.user.avatar_url }
                                                alt={ selectedOrder.user.full_name }
                        />
                                        ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" >
                        <span className="text-white text-lg font-medium" >
                        {(selectedOrder.user.full_name || selectedOrder.user.name).charAt(0)}
                            </span>
                            </div>
                        )}
</div>
    < div >
    <h5 className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
        { selectedOrder.user.full_name || selectedOrder.user.name }
        </h5>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            { selectedOrder.user.email }
            </p>
            </div>
            </div>
            </div>

{/* Course Info */ }
<div>
    <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Course Information </h4>
        < div className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
            <div className="flex items-start space-x-4" >
                <div className="flex-shrink-0" >
                    {
                        selectedOrder.course.thumbnail_url ? (
                            <img
                                                    className= "h-16 w-24 rounded object-cover"
                                                    src={ selectedOrder.course.thumbnail_url }
                                                    alt={ selectedOrder.course.title }
                        />
                                            ) : (
                            <div className="h-16 w-24 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" >
                        <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        )}
</div>
    < div className = "flex-1" >
        <h5 className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { selectedOrder.course.title }
            </h5>
            < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Level: { selectedOrder.course.level }
</p>
    < p className = {`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mt-2`}>
        { formatPrice(selectedOrder.course.price) }
        </p>
        </div>
        </div>
        </div>
        </div>

{/* Progress Info */ }
<div>
    <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Progress Information </h4>
        < div className = "grid grid-cols-2 gap-4" >
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Progress </p>
                    < p className = {`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        { selectedOrder.progress_percentage } %
                        </p>
                        < div className = "w-full bg-gray-200 rounded-full h-2 mt-2" >
                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
style = {{ width: `${selectedOrder.progress_percentage}%` }}
                                            > </div>
    </div>
    </div>
    < div className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
        <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Completed Lessons </p>
            < p className = {`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                { selectedOrder.completed_lessons }
                </p>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    of { selectedOrder.course.total_lessons || 0 } total
                        </p>
                        </div>
                        </div>
                        </div>

{/* Timeline */ }
<div>
    <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Timeline </h4>
        < div className = "space-y-3" >
            <div className="flex items-center space-x-3" >
                <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                    <p className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }> Enrolled </p>
                        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            { formatDate(selectedOrder.enrolled_at) }
                            </p>
                            </div>
                            </div>
{
    selectedOrder.completed_at && (
        <div className="flex items-center space-x-3" >
            <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                <p className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }> Completed </p>
                    < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
}>
    { formatDate(selectedOrder.completed_at) }
    </p>
    </div>
    </div>
                                    )}
</div>
    </div>
    </div>
    </div>
    </div>
            )}
</div>
    );
};

export default OrdersManagement;