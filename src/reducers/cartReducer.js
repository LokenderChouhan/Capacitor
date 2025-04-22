// reducers/counterReducer.js
import { filter } from 'lodash';
import { ADD_PRODUCT, REMOVE_PRODUCT, CLEAR_CART, TOGGLE_CART_VIEW, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, MOVE_FROM_WISHLIST_TO_CART } from '../actions/CartActions';

const initialState = {
    showCart: false,
    products: [],
    wishlist: [],
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PRODUCT:
            return {...state, products: [...state.products, action.id]};
        case REMOVE_PRODUCT:
            return {...state, products: filter(state.products, { id: action.id })};
        case CLEAR_CART:
            return {...state, products: []};
        case TOGGLE_CART_VIEW:
            console.log("Here : ", state.showCart,'->',!state.showCart )
            return {...state, showCart: !state.showCart}
        case ADD_TO_WISHLIST:
            return {...state, wishlist: [...state.wishlist, action.id]};
        case REMOVE_FROM_WISHLIST:
            return {...state, wishlist: filter(state.wishlist, { id: action.id })};
        case MOVE_FROM_WISHLIST_TO_CART:
            return {
                ...state,
                wishlist: filter(state.wishlist, { id: action.id }),
                products: [...state.products, action.id]
            };
        default:
            return state;
    }
};

export default cartReducer;