import React, { createContext, useReducer } from "react";
import { filter, includes } from "lodash";

// Create the context
export const CartContext = createContext();

const initialState = {
  showCart: false,
  products: [],
  wishlist: [],
  rejected: []
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      if (includes(state.products, action.id)) return state;
      return { ...state, products: [...state.products, action.id] };
    case "REJECTED":
      if (includes(state.rejected, action.id)) return state;
        return { ...state, rejected: [...state.rejected, action.id] };
    case "REMOVE_PRODUCT":
      return { ...state, products: filter(state.products, (id) => id !== action.id) };
    case "CLEAR_CART":
      return { ...state, products: [], rejected: [] };
    case "TOGGLE_CART_VIEW":
      return { ...state, showCart: !state.showCart };
    case "ADD_TO_WISHLIST":
        if (includes(state.wishlist, action.id)) return state
      return { ...state, wishlist: [...state.wishlist, action.id] };
    case "REMOVE_FROM_WISHLIST":
      return { ...state, wishlist: filter(state.wishlist, (id) => id !== action.id) };
    case "MOVE_FROM_WISHLIST_TO_CART":
      if (includes(state.products, action.id)) return state;
      return {
        ...state,
        wishlist: filter(state.wishlist, (id) => id !== action.id),
        products: [...state.products, action.id],
      };
    default:
      return state;
  }
};

// Create the Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
