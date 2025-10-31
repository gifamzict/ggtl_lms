import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    instructor: string;
    thumbnail_url?: string;
    description?: string;
    duration?: number;
    level?: 'beginner' | 'intermediate' | 'advanced';
    addedAt: string;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    totalItems: number;
    totalAmount: number;

    // Actions
    addItem: (course: Omit<CartItem, 'addedAt'>) => void;
    removeItem: (courseId: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    isInCart: (courseId: number) => boolean;
    getCartItem: (courseId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            totalItems: 0,
            totalAmount: 0,

            addItem: (course) => {
                const { items } = get();

                // Check if item already exists
                const existingItem = items.find(item => item.id === course.id);
                if (existingItem) {
                    console.log('Course already in cart');
                    return;
                }

                const newItem: CartItem = {
                    ...course,
                    addedAt: new Date().toISOString(),
                };

                const newItems = [...items, newItem];

                set({
                    items: newItems,
                    totalItems: newItems.length,
                    totalAmount: newItems.reduce((total, item) => total + item.price, 0),
                });
            },

            removeItem: (courseId) => {
                const { items } = get();
                const newItems = items.filter(item => item.id !== courseId);

                set({
                    items: newItems,
                    totalItems: newItems.length,
                    totalAmount: newItems.reduce((total, item) => total + item.price, 0),
                });
            },

            clearCart: () => {
                set({
                    items: [],
                    totalItems: 0,
                    totalAmount: 0,
                    isOpen: false,
                });
            },

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            isInCart: (courseId) => {
                const { items } = get();
                return items.some(item => item.id === courseId);
            },

            getCartItem: (courseId) => {
                const { items } = get();
                return items.find(item => item.id === courseId);
            },
        }),
        {
            name: 'ggtl-cart-storage',
            partialize: (state) => ({
                items: state.items,
                totalItems: state.totalItems,
                totalAmount: state.totalAmount,
            }),
        }
    )
);