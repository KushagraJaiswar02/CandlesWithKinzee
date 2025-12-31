import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const { addToast } = useToast();

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            // Check if adding this quantity exceeds total stock
            const currentQty = existingItem ? existingItem.quantity : 0;
            if (currentQty + quantity > product.countInStock) {
                addToast(`Sorry, only ${product.countInStock} items in stock`, 'error');
                return prevItems; // Return unchanged
            }

            if (existingItem) {
                addToast(`${product.name} quantity updated in cart`, 'success');
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            addToast(`${product.name} added to cart`, 'success');
            // Ensure we store the latest countInStock with the item
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
        addToast('Item removed from cart', 'info');
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;

        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item._id === id) {
                    // Check stock limit
                    if (quantity > item.countInStock) {
                        addToast(`Cannot add more. Only ${item.countInStock} in stock.`, 'error');
                        return item; // Return unchanged
                    }
                    return { ...item, quantity: quantity };
                }
                return item;
            });
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
