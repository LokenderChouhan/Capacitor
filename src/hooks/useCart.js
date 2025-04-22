import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
      throw new Error("useStateContext must be used within a StateProvider");
    }
    const {state, dispatch} = context
    const actions = {
        addProduct: (id) => dispatch({ type: 'ADD_PRODUCT', id }),
        addToRejected: (id) => dispatch({ type: 'REJECTED', id }),
        removeProduct: (id) => dispatch({ type: 'REMOVE_PRODUCT', id }),
        clearCart: () => dispatch({ type: 'CLEAR_CART'}),
        addToWishlist: (id) => dispatch({type: 'ADD_TO_WISHLIST', id }),
        removeFromWishlist: (id) => dispatch({type: 'REMOVE_FROM_WISHLIST', id }),
        moveFromWishlistToCart: (id) => dispatch({type: 'MOVE_FROM_WISHLIST_TO_CART', id }),
        toggleCartView: () => dispatch({type: 'TOGGLE_CART_VIEW' }) // Make sure this name matches what Header uses
    };
    return { state, actions };
};