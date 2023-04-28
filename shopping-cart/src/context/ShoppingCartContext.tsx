import { ReactNode, createContext, useContext, useState } from 'react';
import ShoppingCart from '../components/ShoppingCart';
import { useLocalStorage } from "../hooks/useLocalStorege"

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: number
    quantity: number
}

type ShoppingCartContext = {
    openCart: () => void;
    closeCart: () => void;

    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;

    cartQuantity: number;
    cartItems: CartItem[];
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
    return useContext(ShoppingCartContext)
}

export function ShoppingCardProvider({ children }: ShoppingCartProviderProps) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ cartItems, setCartItems ] = useLocalStorage<CartItem[]>("shopping-cart",[]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    // reduce((previousValue, currentValue) => { /* … */ } , initialValue)
    const cartQuantity = cartItems.reduce(
        (quantity, item) => item.quantity + quantity, 0
    )

    function getItemQuantity(id: number) {
        return cartItems.find(item => item.id === id)?.quantity || 0
    }

    function increaseCartQuantity(id: number) {
        setCartItems(cartItems => {
            if(cartItems.find(item => item.id === id) == null) {
                return [...cartItems, {id, quantity: 1}]
            } else {
                return cartItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: number) {
        setCartItems(cartItems => {
            if(cartItems.find(item => item.id === id)?.quantity == 1) {
                return cartItems.filter(item => item.id !== id);
            } else {
                return cartItems.map(item => {
                    if(item.id === id) {
                        return {...item, quantity: item.quantity - 1 }
                    } else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: number) {
        setCartItems(cartItems => {
            return cartItems.filter(item => item.id !== id)
        })
    }

    return (
        <ShoppingCartContext.Provider 
            value={{ 
                getItemQuantity, 
                increaseCartQuantity, 
                decreaseCartQuantity, 
                removeFromCart,
                openCart,
                closeCart,
                cartItems,
                cartQuantity
            }}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}