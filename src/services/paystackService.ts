import { PaystackProps } from 'react-paystack/dist/types';

// Paystack configuration
export const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_a88eed026b20662ed411de5ab2351008f35417d9';

interface PaymentData {
    email: string;
    amount: number; // Amount in kobo (multiply naira by 100)
    metadata: {
        courseId: number;
        courseName: string;
        userId: number;
        userName: string;
    };
}

interface PaystackConfig extends Omit<PaystackProps, 'children'> {
    reference: string;
    email: string;
    amount: number;
    publicKey: string;
    metadata: any;
    onSuccess: (response: any) => void;
    onClose: () => void;
}

// Generate unique payment reference
export const generatePaymentReference = (courseId: number, userId: number): string => {
    const timestamp = Date.now();
    return `GGTL-${courseId}-${userId}-${timestamp}`;
};

// Convert amount from Naira to Kobo (Paystack uses kobo)
export const convertToKobo = (nairaAmount: number): number => {
    return Math.round(nairaAmount * 100);
};

// Convert amount from Kobo to Naira
export const convertToNaira = (koboAmount: number): number => {
    return koboAmount / 100;
};

// Create Paystack configuration for course purchase
export const createPaystackConfig = (
    paymentData: PaymentData,
    onSuccess: (response: any) => void,
    onClose: () => void
): PaystackConfig => {
    const reference = generatePaymentReference(
        paymentData.metadata.courseId,
        paymentData.metadata.userId
    );

    return {
        reference,
        email: paymentData.email,
        amount: convertToKobo(paymentData.amount),
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
            course_id: paymentData.metadata.courseId,
            user_id: paymentData.metadata.userId,
            course_name: paymentData.metadata.courseName,
            user_name: paymentData.metadata.userName,
            paymentReference: reference,
        },
        onSuccess,
        onClose,
        currency: 'NGN',
        channels: ['card', 'bank', 'ussd', 'mobile_money'],
        label: `Purchase: ${paymentData.metadata.courseName}`,
    };
};

// Laravel API endpoints for payment processing
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    // Use the same localStorage key as the main auth system
    return localStorage.getItem('auth_token');
};

// Make authenticated API request for payment operations
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    if (!token) {
        console.error('❌ No authentication token found for payment request');
        throw new Error('Authentication required for payment operations');
    }

    console.log('🔐 Making payment API request with token present:', !!token);

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // For payment operations, don't auto-logout on 401 to prevent disrupting payment flow
        if (response.status === 401) {
            console.warn('Payment API authentication failed - token may be expired or invalid');
            throw new Error(`Authentication failed: ${response.status}`);
        }
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
};

// Payment API functions
export const paystackApi = {
    // Initialize payment in Laravel backend
    initializePayment: async (paymentData: PaymentData) => {
        try {
            return await apiRequest('/payment/initialize', {
                method: 'POST',
                body: JSON.stringify({
                    course_id: paymentData.metadata.courseId,
                    amount: paymentData.amount,
                    email: paymentData.email,
                    metadata: paymentData.metadata,
                }),
            });
        } catch (error) {
            console.error('Error initializing payment:', error);
            throw error;
        }
    },

    // Verify payment after successful Paystack transaction
    verifyPayment: async (reference: string, courseId: number) => {
        try {
            return await apiRequest('/payment/verify', {
                method: 'POST',
                body: JSON.stringify({
                    reference,
                    course_id: courseId,
                }),
            });
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },

    // Complete enrollment after payment verification
    completeEnrollment: async (reference: string, courseId: number) => {
        try {
            return await apiRequest('/enroll', {
                method: 'POST',
                body: JSON.stringify({
                    course_id: courseId,
                    payment_reference: reference,
                }),
            });
        } catch (error) {
            console.error('Error completing enrollment:', error);
            throw error;
        }
    },
};

// Format currency for display
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Validate Paystack public key
export const validatePaystackKey = (): boolean => {
    return PAYSTACK_PUBLIC_KEY.startsWith('pk_');
};

// Payment status types
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export interface PaymentResponse {
    status: PaymentStatus;
    reference: string;
    message: string;
    trans: any;
    transaction: any;
    trxref: string;
}