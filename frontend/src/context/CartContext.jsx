/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const { addToast } = useToast();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const handleClearCart = () => setCartItems([]);
        window.addEventListener('cart-clear', handleClearCart);
        return () => window.removeEventListener('cart-clear', handleClearCart);
    }, []);

    const addToCart = (product, quantity = 1) => {
        if (!user) {
            addToast('Please log in to add items to your cart.', 'error');
            return;
        }

        const existingItem = cartItems.find(item => item._id === product._id);
        const currentQty = existingItem ? existingItem.quantity : 0;

        // Check if adding this quantity exceeds total stock
        if (currentQty + quantity > product.countInStock) {
            addToast(`Sorry, only ${product.countInStock} items in stock`, 'error');
            return;
        }

        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
            addToast(`${product.name} quantity updated in cart`, 'success');
        } else {
            setCartItems([...cartItems, { ...product, quantity }]);
            addToast(`${product.name} added to cart`, 'success');
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
        addToast('Item removed from cart', 'info');
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;

        const item = cartItems.find(i => i._id === id);
        if (item && quantity > item.countInStock) {
            addToast(`Cannot add more. Only ${item.countInStock} in stock.`, 'error');
            return; // Return unchanged
        }

        setCartItems(cartItems.map(i => i._id === id ? { ...i, quantity } : i));
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
