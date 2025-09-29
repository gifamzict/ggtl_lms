import { useState } from 'react';
import { useCartStore } from './cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Cart = () => {
    const { items, removeFromCart, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const totalPrice = items.reduce((total, item) => total + item.price, 0);

    const handleCheckout = async () => {
        if (items.length !== 1) {
            toast.error("You can only check out with one course at a time for now.");
            return;
        }

        setIsCheckingOut(true);
        try {
            const courseId = items[0].id;
            const { data, error } = await supabase.functions.invoke('paystack-initialize', {
                body: { courseId },
            });

            if (error) {
                throw new Error(error.message);
            }

            if (data?.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error('Failed to initialize payment');
            }
        } catch (error) {
            toast.error(error.message || 'Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {items.length > 1 && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Multiple Items in Cart</AlertTitle>
                    <AlertDescription>
                        Please note that you can only check out with one course at a time.
                    </AlertDescription>
                </Alert>
            )}
            {items.length === 0 ? (
                <Card>
                    <CardContent className="text-center p-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
                        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
                        <Button onClick={() => navigate('/courses')} className="mt-6">Browse Courses</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Cart Items ({items.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <img src={item.thumbnail_url} alt={item.title} className="w-24 h-16 object-cover rounded-md" />
                                                <div>
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">Price: ₦{item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Cart Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₦{totalPrice.toLocaleString()}</span>
                                </div>
                                <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut || items.length > 1}>
                                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                                </Button>
                                <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
