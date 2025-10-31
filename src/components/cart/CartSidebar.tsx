import { X, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/services/paystackService';
import { useLaravelAuth } from '@/store/laravelAuthStore';
import { toast } from 'sonner';
import { PaystackButton } from 'react-paystack';
import { createPaystackConfig } from '@/services/paystackService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, removeItem, clearCart, totalPrice, totalItems } = useCartStore();
  const { user, isAuthenticated } = useLaravelAuth();

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! You have been enrolled in all courses.');
    clearCart();
    onClose();
  };

  const handlePaymentClose = () => {
    toast.info('Payment cancelled');
  };

  const paystackConfig = createPaystackConfig({
    amount: totalPrice,
    email: user?.email || '',
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative ml-auto w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Cart ({totalItems})</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 border rounded-lg p-3">
                    <img
                      src={item.thumbnail_url || '/lovable-uploads/bd0b0eb0-6cfd-4fc4-81b8-d4b8002811c9.png'}
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{item.instructor}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(item.price)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-xl text-blue-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="space-y-2">
                {isAuthenticated ? (
                  <PaystackButton
                    {...paystackConfig}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay with Paystack
                  </PaystackButton>
                ) : (
                  <Button className="w-full" disabled>
                    Please log in to checkout
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
