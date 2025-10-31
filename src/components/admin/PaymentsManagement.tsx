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
    BookOpen,
    Check
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
            .reduce((sum, p) => sum + parseFloat(p.amount), 0)
    };

    // Filter payments based on search and filters
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch = !searchTerm || 
            payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

        const matchesDate = (() => {
            if (dateFilter === 'all') return true;
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
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        Payments Management
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Track transactions, manage payments, and monitor revenue
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={fetchPayments}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    {stats.pending_payments > 0 && (
                        <button
                            onClick={approveAllPendingPayments}
                            disabled={isApproving}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {isApproving ? 'Approving...' : `Approve All (${stats.pending_payments})`}
                        </button>
                    )}
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Total Revenue
                            </p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {formatPrice(stats.total_revenue.toString())}
                            </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Total Transactions
                            </p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {stats.total_transactions}
                            </p>
                        </div>
                        <CreditCard className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Success Rate
                            </p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {stats.total_transactions > 0
                                    ? Math.round((stats.successful_payments / stats.total_transactions) * 100)
                                    : 0}%
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Pending Payments
                            </p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {stats.pending_payments}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by customer, course, or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    darkMode 
                                        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as any)}
                            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {payment.user.avatar_url ? (
                                                    <img 
                                                        className="h-10 w-10 rounded-full object-cover" 
                                                        src={payment.user.avatar_url} 
                                                        alt={payment.user.name}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} max-w-xs truncate`}>
                                                    {payment.user.name}
                                                </div>
                                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {payment.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {payment.course.thumbnail_url ? (
                                                    <img 
                                                        className="h-10 w-10 rounded object-cover" 
                                                        src={payment.course.thumbnail_url} 
                                                        alt={payment.course.title}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-green-600 flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} max-w-xs truncate`}>
                                                    {payment.course.title}
                                                </div>
                                                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Course ID: {payment.course_id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {formatPrice(payment.amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                            {formatDate(payment.enrolled_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedPayment(payment);
                                                    setShowDetailModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {payment.status === 'pending' && (
                                                <button
                                                    onClick={() => approvePayment(payment.id)}
                                                    disabled={isApproving}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Approve Payment"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPayments.length === 0 && (
                        <div className="text-center py-12">
                            <CreditCard className={`w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4`} />
                            <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                No payments found
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                Try adjusting your search criteria or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Detail Modal */}
            {showDetailModal && selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    Payment Details
                                </h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className={`text-gray-400 hover:text-gray-600 transition-colors`}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Transaction ID
                                        </label>
                                        <p className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {selectedPayment.transaction_id}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Amount
                                        </label>
                                        <p className={`text-sm font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {formatPrice(selectedPayment.amount)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Status
                                        </label>
                                        {getStatusBadge(selectedPayment.status)}
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Payment Method
                                        </label>
                                        <p className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {selectedPayment.payment_method}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Customer Information
                                    </label>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {selectedPayment.user.name}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {selectedPayment.user.email}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Course Information
                                    </label>
                                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                                        <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {selectedPayment.course.title}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Course ID: {selectedPayment.course_id}
                                        </p>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Price: {formatPrice(selectedPayment.course.price)}
                                        </p>
                                    </div>
                                </div>

                                {selectedPayment.status === 'pending' && (
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={() => {
                                                approvePayment(selectedPayment.id);
                                                setShowDetailModal(false);
                                            }}
                                            disabled={isApproving}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <Check className="w-4 h-4" />
                                            {isApproving ? 'Approving...' : 'Approve Payment'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full`}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    Payment Settings
                                </h3>
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className={`text-gray-400 hover:text-gray-600 transition-colors`}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Paystack Public Key
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentSettings.paystack_public_key}
                                        onChange={(e) => setPaymentSettings(prev => ({
                                            ...prev,
                                            paystack_public_key: e.target.value
                                        }))}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            darkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="pk_test_..."
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Paystack Secret Key
                                    </label>
                                    <input
                                        type="password"
                                        value={paymentSettings.paystack_secret_key}
                                        onChange={(e) => setPaymentSettings(prev => ({
                                            ...prev,
                                            paystack_secret_key: e.target.value
                                        }))}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            darkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="sk_test_..."
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="liveMode"
                                        checked={paymentSettings.is_live_mode}
                                        onChange={(e) => setPaymentSettings(prev => ({
                                            ...prev,
                                            is_live_mode: e.target.checked
                                        }))}
                                        className="mr-2"
                                    />
                                    <label htmlFor="liveMode" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Live Mode (Production)
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setShowSettingsModal(false)}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            darkMode 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            // updatePaymentSettings();
                                            toast.info('Payment settings will be implemented in backend');
                                            setShowSettingsModal(false);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsManagement;