import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface CartCourse {
    id: string;
    title: string;
    price: number;
    thumbnail_url: string;
    slug: string;
}

interface CartState {
    items: CartCourse[];
    addToCart: (course: CartCourse) => void;
    removeFromCart: (courseId: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (course) => {
                const { items } = get();
                const itemExists = items.find((item) => item.id === course.id);

                if (itemExists) {
                    toast.info(`"${course.title}" is already in your cart.`);
                    return;
                }

                set({ items: [...items, course] });
                toast.success(`"${course.title}" has been added to your cart.`);
            },
            removeFromCart: (courseId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== courseId),
                }));
                toast.success('Course removed from cart.');
            },
            clearCart: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'ggtl-cart-storage', // name of the item in the storage (must be unique)
        }
    )
);





