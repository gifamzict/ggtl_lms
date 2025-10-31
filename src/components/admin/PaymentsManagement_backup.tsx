import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    DollarSign,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    Eye,
    Settings,
    RefreshCw,
    Download,
    CheckCircle,
    AlertCircle,
    Clock,
    Users,
    BookOpen
} from 'lucide-react';
import { adminApi } from '@/services/api/adminApi';
import { toast } from 'sonner';

interface Payment {
    id: number;
    user_id: number;
    course_id: number;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    payment_method: string;
    transaction_id?: string;
    enrolled_at: string;
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
        thumbnail_url?: string;
    };
}

interface PaymentStats {
    total_revenue: number;
    total_transactions: number;
    successful_payments: number;
    pending_payments: number;
    failed_payments: number;
    monthly_revenue: number;
}

interface PaymentsManagementProps {
    darkMode: boolean;
    dashboardData: any;
}

const PaymentsManagement: React.FC<PaymentsManagementProps> = ({ darkMode, dashboardData }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isApproving, setIsApproving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState({
        paystack_public_key: '',
        paystack_secret_key: '',
        is_live_mode: false
    });

    useEffect(() => {
        fetchPayments();
    }, [statusFilter, dateFilter, currentPage]);

    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching payments data...');

            // Use the new dedicated payments endpoint
            const paymentsData = await adminApi.payments.getTransactions({
                status: statusFilter !== 'all' ? statusFilter : undefined,
                page: currentPage
            });

            setPayments(paymentsData.data);
            console.log('Payments data:', paymentsData.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load payments data');
        } finally {
            setIsLoading(false);
        }
    };

    const approvePayment = async (enrollmentId: number) => {
        try {
            setIsApproving(true);
            await adminApi.payments.approvePayment(enrollmentId);
            toast.success('Payment approved successfully');
            fetchPayments(); // Refresh the list
        } catch (error) {
            console.error('Error approving payment:', error);
            toast.error('Failed to approve payment');
        } finally {
            setIsApproving(false);
        }
    };

    const approveAllPendingPayments = async () => {
        try {
            setIsApproving(true);
            const result = await adminApi.payments.approveAllPayments();
            toast.success(result.message);
            fetchPayments(); // Refresh the list
        } catch (error) {
            console.error('Error approving all payments:', error);
            toast.error('Failed to approve all pending payments');
        } finally {
            setIsApproving(false);
        }
    };

    const fetchPaymentSettings = async () => {
        try {
            // Note: You would implement this endpoint in the backend
            // const settings = await adminApi.payments.getSettings();
            // setPaymentSettings(settings);
            toast.info('Payment settings feature will be implemented in backend');
        } catch (error) {
            console.error('Error fetching payment settings:', error);
        }
    };

    const updatePaymentSettings = async () => {
        try {
            // Note: You would implement this endpoint in the backend
            // await adminApi.payments.updateSettings(paymentSettings);
            toast.success('Payment settings updated successfully');
            setShowSettingsModal(false);
        } catch (error) {
            console.error('Error updating payment settings:', error);
            toast.error('Failed to update payment settings');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" >
                    <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                        </span>
                );
            case 'pending':
return (
    <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" >
    <Clock className="w-3 h-3 mr-1" />
        Pending
        </span>
                );
            case 'failed':
return (
    <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" >
    <AlertCircle className="w-3 h-3 mr-1" />
        Failed
        </span>
                );
            default:
return (
    <span className= "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" >
    Unknown
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

// Calculate statistics
const stats = {
    total_revenue: payments.reduce((sum, payment) =>
        payment.status === 'completed' ? sum + parseFloat(payment.amount) : sum, 0
    ),
    total_transactions: payments.length,
    successful_payments: payments.filter(p => p.status === 'completed').length,
    pending_payments: payments.filter(p => p.status === 'pending').length,
    failed_payments: payments.filter(p => p.status === 'failed').length,
    monthly_revenue: payments
        .filter(p => {
            const paymentDate = new Date(p.enrolled_at);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() &&
                paymentDate.getFullYear() === now.getFullYear() &&
                p.status === 'completed';
        })
        .reduce((sum, payment) => sum + parseFloat(payment.amount), 0)
};

const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.course.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

    const matchesDate = dateFilter === 'all' || (() => {
        const paymentDate = new Date(payment.enrolled_at);
        const now = new Date();

        switch (dateFilter) {
            case 'today':
                return paymentDate.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return paymentDate >= weekAgo;
            case 'month':
                return paymentDate.getMonth() === now.getMonth() &&
                    paymentDate.getFullYear() === now.getFullYear();
            default:
                return true;
        }
    })();

    return matchesSearch && matchesStatus && matchesDate;
});

if (isLoading) {
    return (
        <div className= "flex items-center justify-center py-12" >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" > </div>
            </div>
        );
}

return (
    <div className= "space-y-6" >
    {/* Header */ }
    < div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
        <h2 className={ `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            Payments Management
                </h2>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Track transactions, manage payments, and monitor revenue
                        </p>
                        </div>
                        < div className = "flex gap-3" >
                            <button
                        onClick={ () => setShowSettingsModal(true) }
className = "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
    >
    <Settings className="w-4 h-4" />
        Settings
        </button>
        < button
onClick = { fetchPayments }
className = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
    <RefreshCw className="w-4 h-4" />
        Refresh
        </button>
        {stats.pending_payments > 0 && (
            <button
                onClick={approveAllPendingPayments}
                disabled={isApproving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                <CheckCircle className="w-4 h-4" />
                {isApproving ? 'Approving...' : `Approve All (${stats.pending_payments})`}
            </button>
        )}
        </button>
        < button className = "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" >
            <Download className="w-4 h-4" />
                Export
                </button>
                </div>
                </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
    <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
        <div className="flex items-center justify-between" >
            <div>
            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                Total Revenue
                    </p>
                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        { formatPrice(stats.total_revenue.toString()) }
                        </p>
                        </div>
                        < DollarSign className = "w-8 h-8 text-green-600" />
                            </div>
                            </div>

                            < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                <div className="flex items-center justify-between" >
                                    <div>
                                    <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                        Total Transactions
                                            </p>
                                            < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                { stats.total_transactions }
                                                </p>
                                                </div>
                                                < CreditCard className = "w-8 h-8 text-blue-600" />
                                                    </div>
                                                    </div>

                                                    < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                        <div className="flex items-center justify-between" >
                                                            <div>
                                                            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                                Monthly Revenue
                                                                    </p>
                                                                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                        { formatPrice(stats.monthly_revenue.toString()) }
                                                                        </p>
                                                                        </div>
                                                                        < TrendingUp className = "w-8 h-8 text-purple-600" />
                                                                            </div>
                                                                            </div>

                                                                            < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                                                <div className="flex items-center justify-between" >
                                                                                    <div>
                                                                                    <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                                                        Success Rate
                                                                                            </p>
                                                                                            < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                                                {
                                                                                                    stats.total_transactions > 0
                                                                                                        ? Math.round((stats.successful_payments / stats.total_transactions) * 100)
                                                                                                        : 0
                                                                                                } %
                                                                                                </p>
                                                                                                </div>
                                                                                                < CheckCircle className = "w-8 h-8 text-orange-600" />
                                                                                                    </div>
                                                                                                    </div>
                                                                                                    </div>

{/* Filters */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
    <div className="flex flex-col lg:flex-row gap-4" >
        {/* Search */ }
        < div className = "flex-1" >
            <div className="relative" >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                                type="text"
placeholder = "Search by customer, email, or course..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
    </div>
    </div>

{/* Status Filter */ }
<div className="flex items-center gap-2" >
    <Filter className="w-5 h-5 text-gray-400" />
        <select
                            value={ statusFilter }
onChange = {(e) => setStatusFilter(e.target.value as any)}
className = {`px-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
    <option value="all" > All Status </option>
        < option value = "completed" > Completed </option>
            < option value = "pending" > Pending </option>
                < option value = "failed" > Failed </option>
                    </select>
                    </div>

{/* Date Filter */ }
<div className="flex items-center gap-2" >
    <Calendar className="w-5 h-5 text-gray-400" />
        <select
                            value={ dateFilter }
onChange = {(e) => setDateFilter(e.target.value as any)}
className = {`px-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
    <option value="all" > All Time </option>
        < option value = "today" > Today </option>
            < option value = "week" > This Week </option>
                < option value = "month" > This Month </option>
                    </select>
                    </div>
                    </div>
                    </div>

{/* Payments Table */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden` }>
    <div className="overflow-x-auto" >
        <table className="w-full" >
            <thead className={ `${darkMode ? 'bg-gray-700' : 'bg-gray-50'}` }>
                <tr>
                <th className={ `px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider` }>
                    Transaction
                    </th>
                    < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Customer
                        </th>
                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                            Course
                            </th>
                            < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Amount
                                </th>
                                < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Status
                                    </th>
                                    < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                        Date
                                        </th>
                                        < th className = {`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Actions
                                            </th>
                                            </tr>
                                            </thead>
                                            < tbody className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                            {
                                                filteredPayments.map((payment) => (
                                                    <tr key= { payment.id } className = {`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`} >
                                                <td className="px-6 py-4 whitespace-nowrap" >
                                                    <div className="flex flex-col" >
                                                        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                                                #{ payment.transaction_id }
</div>
    < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        { payment.payment_method }
        </div>
        </div>
        </td>
        < td className = "px-6 py-4 whitespace-nowrap" >
            <div className="flex items-center" >
                <div className="flex-shrink-0 h-8 w-8" >
                    {
                        payment.user.avatar_url ? (
                            <img
                                                        className= "h-8 w-8 rounded-full object-cover"
                                                        src={ payment.user.avatar_url }
                                                        alt={ payment.user.full_name || payment.user.name }
                        />
                                                ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" >
                        <span className="text-white text-xs font-medium" >
                        {(payment.user.full_name || payment.user.name).charAt(0)}
                            </span>
                            </div>
                        )}
</div>
    < div className = "ml-3" >
        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { payment.user.full_name || payment.user.name }
            </div>
            < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                { payment.user.email }
                </div>
                </div>
                </div>
                </td>
                < td className = "px-6 py-4" >
                    <div className="flex items-center" >
                        <div className="flex-shrink-0 h-10 w-16" >
                            {
                                payment.course.thumbnail_url ? (
                                    <img
                                                        className= "h-10 w-16 rounded object-cover"
                                                        src={ payment.course.thumbnail_url }
                                                        alt={ payment.course.title }
                                />
                                                ) : (
                                    <div className="h-10 w-16 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" >
                                <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                )}
</div>
    < div className = "ml-3" >
        <div className={ `text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} max-w-xs truncate` }>
            { payment.course.title }
            </div>
            < div className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Course ID: { payment.course_id }
</div>
    </div>
    </div>
    </td>
    < td className = "px-6 py-4 whitespace-nowrap" >
        <div className={ `text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { formatPrice(payment.amount) }
            </div>
            </td>
            < td className = "px-6 py-4 whitespace-nowrap" >
                { getStatusBadge(payment.status) }
                </td>
                < td className = "px-6 py-4 whitespace-nowrap" >
                    <div className={ `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}` }>
                        { formatDate(payment.enrolled_at) }
                        </div>
                        </td>
                        < td className = "px-6 py-4 whitespace-nowrap" >
                            <button
                                            onClick={
    () => {
        setSelectedPayment(payment);
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
    filteredPayments.length === 0 && (
        <div className="text-center py-12" >
            <CreditCard className={ `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
}>
    No payments found
        </p>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            Payments will appear here once students start purchasing courses
                </p>
                </div>
                    )}
</div>
    </div>

{/* Payment Detail Modal */ }
{
    showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        Payment Details
                            </h3>
                            < button
    onClick = {() => {
        setShowDetailModal(false);
        setSelectedPayment(null);
    }
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                ✕
</button>
    </div>

    < div className = "space-y-6" >
        {/* Transaction Info */ }
        < div >
        <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Transaction Information </h4>
            < div className = "grid grid-cols-2 gap-4" >
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                    <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Transaction ID </p>
                        < p className = {`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            { selectedPayment.transaction_id }
                            </p>
                            </div>
                            < div className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                                <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Amount </p>
                                    < p className = {`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                        { formatPrice(selectedPayment.amount) }
                                        </p>
                                        </div>
                                        < div className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                                            <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Status </p>
                                                < div className = "mt-1" >
                                                    { getStatusBadge(selectedPayment.status) }
                                                    </div>
                                                    </div>
                                                    < div className = "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
                                                        <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }> Payment Method </p>
                                                            < p className = {`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                { selectedPayment.payment_method }
                                                                </p>
                                                                </div>
                                                                </div>
                                                                </div>

{/* Customer Info */ }
<div>
    <h4 className={ `text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-3` }> Customer Information </h4>
        < div className = "flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" >
            <div className="flex-shrink-0" >
                {
                    selectedPayment.user.avatar_url ? (
                        <img
                                                className= "h-12 w-12 rounded-full object-cover"
                                                src={ selectedPayment.user.avatar_url }
                                                alt={ selectedPayment.user.full_name }
                    />
                                        ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" >
                    <span className="text-white text-lg font-medium" >
                    {(selectedPayment.user.full_name || selectedPayment.user.name).charAt(0)}
                        </span>
                        </div>
                    )}
</div>
    < div >
    <h5 className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
        { selectedPayment.user.full_name || selectedPayment.user.name }
        </h5>
        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            { selectedPayment.user.email }
            </p>
            < p className = {`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                User ID: { selectedPayment.user_id }
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
                        selectedPayment.course.thumbnail_url ? (
                            <img
                                                    className= "h-16 w-24 rounded object-cover"
                                                    src={ selectedPayment.course.thumbnail_url }
                                                    alt={ selectedPayment.course.title }
                        />
                                            ) : (
                            <div className="h-16 w-24 rounded bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center" >
                        <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        )}
</div>
    < div className = "flex-1" >
        <h5 className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
            { selectedPayment.course.title }
            </h5>
            < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                Course ID: { selectedPayment.course_id }
</p>
    < p className = {`text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mt-2`}>
        { formatPrice(selectedPayment.course.price) }
        </p>
        </div>
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
                    <p className={ `font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }> Payment Processed </p>
                        < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            { formatDate(selectedPayment.enrolled_at) }
                            </p>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
                            </div>
            )}

{/* Payment Settings Modal */ }
{
    showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        Payment Settings
                            </h3>
                            < button
    onClick = {() => setShowSettingsModal(false)
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                                ✕
</button>
    </div>

    < div className = "space-y-4" >
        <div>
        <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
            Paystack Public Key
                </label>
                < input
type = "text"
value = { paymentSettings.paystack_public_key }
onChange = {(e) => setPaymentSettings(prev => ({ ...prev, paystack_public_key: e.target.value }))}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "pk_test_..."
    />
    </div>

    < div >
    <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
        Paystack Secret Key
            </label>
            < input
type = "password"
value = { paymentSettings.paystack_secret_key }
onChange = {(e) => setPaymentSettings(prev => ({ ...prev, paystack_secret_key: e.target.value }))}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "sk_test_..."
    />
    </div>

    < div className = "flex items-center" >
        <input
                                    type="checkbox"
id = "is_live_mode"
checked = { paymentSettings.is_live_mode }
onChange = {(e) => setPaymentSettings(prev => ({ ...prev, is_live_mode: e.target.checked }))}
className = "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor="is_live_mode" className = {`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Live Mode(Production)
            </label>
            </div>

            < div className = "flex gap-3 pt-4" >
                <button
                                    type="button"
onClick = {() => setShowSettingsModal(false)}
className = {`flex-1 px-4 py-2 border rounded-lg ${darkMode
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                >
    Cancel
    </button>
    < button
onClick = { updatePaymentSettings }
className = "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
    Save Settings
        </button>
        </div>
        </div>
        </div>
        </div>
            )}
</div>
    );
};

export default PaymentsManagement;