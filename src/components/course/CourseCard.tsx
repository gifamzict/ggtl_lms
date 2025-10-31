import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, Clock, Star, User, BookOpen } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { useCartStore } from '@/store/cartStore';
import {
  createPaystackConfig,
  paystackApi,
  formatCurrency,
  validatePaystackKey,
  PaymentResponse
} from '@/services/paystackService';
import { toast } from 'sonner';
import { TestPaystackButton } from './TestPaystackButton';

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  instructor: string;
  thumbnail_url?: string;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  students_count?: number;
  lessons_count?: number;
  is_free?: boolean;
  is_enrolled?: boolean;
}

interface CourseCardProps {
  course: Course;
  onEnrollmentSuccess?: (courseId: number) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnrollmentSuccess
}) => {
  const { user, isAuthenticated } = useLaravelAuth();
  const { addItem, removeItem, isInCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const inCart = isInCart(course.id);
  const isFree = course.is_free || course.price === 0;

  // Handle successful payment
  async function handlePaymentSuccess(response: PaymentResponse) {
    console.log('🎉 Payment successful:', response);

    try {
      setIsProcessing(true);

      console.log('🔄 Verifying payment with backend...');
      // Verify payment with backend
      const verificationResult = await paystackApi.verifyPayment(response.reference, course.id);

      console.log('✅ Payment verification result:', verificationResult);

      if (verificationResult.success) {
        // Complete enrollment after payment verification
        console.log('🎓 Completing enrollment...');
        const enrollmentResult = await paystackApi.completeEnrollment(response.reference, course.id);

        if (enrollmentResult.success) {
          toast.success(`🎉 Payment successful! You are now enrolled in ${course.title}`);
          onEnrollmentSuccess?.(course.id);
        } else {
          toast.error('Payment succeeded but enrollment failed. Please contact support.');
        }
      } else {
        toast.error('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      toast.error('Failed to complete enrollment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  } function handlePaymentClose() {
    console.log('Payment modal closed');
  }

  const paystackConfig = user ? createPaystackConfig(
    {
      email: user.email,
      amount: course.price,
      metadata: {
        courseId: course.id,
        courseName: course.title,
        userId: user.id,
        userName: user.name || user.email,
      },
    },
    handlePaymentSuccess,
    handlePaymentClose
  ) : null;

  // Debug PayStack configuration
  React.useEffect(() => {
    if (user && course) {
      console.log('PayStack Config Debug:', {
        user: user.email,
        coursePrice: course.price,
        courseId: course.id,
        configExists: !!paystackConfig
      });
    }
  }, [user, course, paystackConfig]);

  // Create a default config to avoid hook errors
  const defaultConfig = {
    publicKey: 'pk_test_a88eed026b20662ed411de5ab2351008f35417d9',
    email: '',
    amount: 0,
    onSuccess: () => { },
    onClose: () => { }
  };

  const initializePayment = usePaystackPayment(paystackConfig || defaultConfig);

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('=== BUY NOW CLICKED ===');
    console.log('Course:', course.title);
    console.log('User authenticated:', isAuthenticated);
    console.log('User object:', user);
    console.log('Is free course:', isFree);
    console.log('PayStack config exists:', !!paystackConfig);

    if (!isAuthenticated) {
      console.log('❌ User not authenticated, showing toast');
      toast.error('Please log in to purchase courses');
      return;
    }

    if (!user) {
      console.log('❌ User object is null');
      toast.error('User information not available');
      return;
    }

    if (isFree) {
      console.log('✅ Free course enrollment');
      try {
        setIsProcessing(true);
        toast.success(`Successfully enrolled in ${course.title}!`);
        onEnrollmentSuccess?.(course.id);
      } catch (error) {
        console.error('Free course enrollment error:', error);
        toast.error('Failed to enroll in free course');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Validate PayStack configuration
    if (!paystackConfig) {
      console.error('❌ PayStack configuration is null');
      console.log('User email:', user.email);
      console.log('Course price:', course.price);
      toast.error('Payment configuration error. Please contact support.');
      return;
    }

    console.log('✅ PayStack config valid, initializing payment...');
    console.log('PayStack config:', paystackConfig);

    try {
      setIsProcessing(true);
      console.log('🔄 Calling initializePayment...');

      // Call the payment initialization
      const result = initializePayment(paystackConfig);
      console.log('💳 PayStack result:', result);

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add courses to cart');
      return;
    }

    if (isFree) {
      toast.info('Free courses can be enrolled directly');
      return;
    }

    setIsAddingToCart(true);

    try {
      if (inCart) {
        removeItem(course.id);
        toast.success(`${course.title} removed from cart`);
      } else {
        addItem({
          id: course.id,
          title: course.title,
          price: course.price,
          instructor: course.instructor,
          thumbnail_url: course.thumbnail_url,
          description: course.description,
          duration: course.duration,
          level: course.level,
        });
        toast.success(`${course.title} added to cart`);
      }
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className= "h-full flex flex-col hover:shadow-lg transition-shadow duration-300" >
    <div className="relative h-48 overflow-hidden rounded-t-lg" >
      <img
          src={ course.thumbnail_url || '/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png' }
  alt = { course.title }
  className = "w-full h-full object-cover"
    />
    { isFree && (
      <Badge className="absolute top-2 right-2 bg-green-500 text-white" >
        Free
        </Badge>
        )}
{
  course.level && (
    <Badge className={ `absolute top-2 left-2 ${getLevelColor(course.level)}` }>
      { course.level.charAt(0).toUpperCase() + course.level.slice(1) }
      </Badge>
        )
}
</div>

  < CardHeader className = "flex-1" >
    <div className="space-y-2" >
      <h3 className="font-semibold text-lg line-clamp-2" > { course.title } </h3>
        < p className = "text-sm text-gray-600 line-clamp-3" > { course.description } </p>

          < div className = "flex items-center gap-4 text-sm text-gray-500" >
            <div className="flex items-center gap-1" >
              <User className="w-4 h-4" />
                <span>{ course.instructor } </span>
                </div>
{
  course.duration && (
    <div className="flex items-center gap-1" >
      <Clock className="w-4 h-4" />
        <span>{ course.duration }h </span>
          </div>
            )
}
{
  course.lessons_count && (
    <div className="flex items-center gap-1" >
      <BookOpen className="w-4 h-4" />
        <span>{ course.lessons_count } lessons </span>
          </div>
            )
}
</div>
  </div>
  </CardHeader>

  < CardContent className = "pt-0" >
    <div className="mb-4" >
      <span className="text-2xl font-bold text-blue-600" >
        { isFree? 'Free': formatCurrency(course.price) }
        </span>
        </div>

        < div className = "flex flex-col gap-2" >
        {
          course.is_enrolled ? (
            <Button
              onClick= {() => {
  // Navigate to course learning page
  window.location.href = `/learn/${course.id}`;
}}
className = "w-full bg-green-600 hover:bg-green-700"
type = "button"
  >
  <BookOpen className="w-4 h-4 mr-2" />
    Continue Learning
      </Button>
          ) : (
  <Button
              onClick= { handleBuyNow }
disabled = { isProcessing }
className = "w-full"
type = "button"
  >
  <CreditCard className="w-4 h-4 mr-2" />
    { isProcessing? 'Processing...': isFree ? 'Enroll Now' : 'Buy Now' }
    </Button>
          )}

{/* Test PayStack Button removed for production */ }
{
  !isFree && !course.is_enrolled && (
    <Button
              variant="outline"
  onClick = { handleAddToCart }
  disabled = { isAddingToCart }
  className = "w-full"
    >
    <ShoppingCart className="w-4 h-4 mr-2" />
    {
      isAddingToCart
      ? 'Updating...'
        : inCart
          ? 'Remove from Cart'
          : 'Add to Cart'
    }
      </Button>
          )
}
</div>
  </CardContent>
  </Card>
  );
};
