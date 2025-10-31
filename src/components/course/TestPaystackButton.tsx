import React from 'react';
import { PaystackButton } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface TestPaystackButtonProps {
    amount: number;
    email: string;
    courseName: string;
}

export const TestPaystackButton: React.FC<TestPaystackButtonProps> = ({
    amount,
    email,
    courseName
}) => {
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_a88eed026b20662ed411de5ab2351008f35417d9';

    const componentProps = {
        email,
        amount: amount * 100, // Convert to kobo
        publicKey,
        text: 'Pay Now',
        onSuccess: (response: any) => {
            console.log('Payment successful:', response);
            toast.success(`Payment successful for ${courseName}!`);
        },
        onClose: () => {
            console.log('Payment modal closed');
            toast.info('Payment cancelled');
        },
        reference: `GGTL-${Date.now()}`,
        currency: 'NGN',
        channels: ['card', 'bank'],
        metadata: {
            courseName,
            custom_fields: [
                {
                    display_name: "Course",
                    variable_name: "course",
                    value: courseName
                }
            ]
        }
    };

    return (
        <PaystackButton
      { ...componentProps }
      className = "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
        <CreditCard className="w-4 h-4" />
            Test Buy Now - ₦{ amount.toLocaleString() }
    </PaystackButton>
  );
};