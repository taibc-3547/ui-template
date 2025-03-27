import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItem } from "@/app/lib/fastschema/types";
import Cookies from 'js-cookie';

type InitialState = {
  items: CartItem[];
};

// Load initial state from cookies if available
const loadInitialState = (): { items: CartItem[] } => {
  if (typeof window !== 'undefined') {
    const savedCart = Cookies.get('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  }
  return { items: [] };
};

// Helper function to save cart to cookies
const saveCartToCookies = (state: InitialState) => {
  Cookies.set('cart', JSON.stringify(state), {
    expires: 7, // 7 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
};

const initialState: InitialState = loadInitialState();

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, merchandise, quantity, cost } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          merchandise,
          quantity,
          cost
        });
      }
      // Save to cookies
      saveCartToCookies(state);
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      // Save to cookies
      saveCartToCookies(state);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      // Save to cookies
      saveCartToCookies(state);
    },
    removeAllItemsFromCart: (state) => {
      state.items = [];
      // Remove cookie
      Cookies.remove('cart');
    },
    // New reducer to update item prices
    updateItemPrices: (
      state,
      action: PayloadAction<Array<{ id: string; updatedCost: CartItem['cost'] }>>
    ) => {
      action.payload.forEach(({ id, updatedCost }) => {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.cost = updatedCost;
        }
      });
      saveCartToCookies(state);
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + parseFloat(item.cost.totalAmount.amount) * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  updateItemPrices,
} = cart.actions;
export default cart.reducer;
