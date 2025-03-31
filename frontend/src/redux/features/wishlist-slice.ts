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
    const savedWishlist = Cookies.get('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : { items: [] };
  }
  return { items: [] };
};

// Helper function to save wishlist to cookies
const saveWishlistToCookies = (state: InitialState) => {
  Cookies.set('wishlist', JSON.stringify(state), {
    expires: 30, // 30 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
};

const initialState: InitialState = loadInitialState();

export const wishlist = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<CartItem>) => {
      const { id, merchandise, cost } = action.payload;
      
      // Validate required data exists
      if (!id || !merchandise?.product || !cost?.totalAmount) {
        console.warn('Invalid wishlist item data:', action.payload);
        return;
      }

      // Ensure consistent ID format (convert to string)
      const itemId = id.toString();
      
      // Check for existing item using consistent ID comparison
      const existingItem = state.items.find((item) => item.id?.toString() === itemId);

      if (!existingItem) {
        // Create properly structured item
        const newItem: CartItem = {
          id: itemId,
          merchandise: {
            id: merchandise.id?.toString(),
            title: merchandise.title,
            selectedOptions: merchandise.selectedOptions || [],
            product: {
              id: merchandise.product.id?.toString(),
              handle: merchandise.product.handle,
              title: merchandise.product.title,
              featuredImage: merchandise.product.featuredImage
            }
          },
          quantity: 1, // Wishlist items always have quantity 1
          cost: {
            totalAmount: {
              amount: cost.totalAmount.amount?.toString(),
              currencyCode: cost.totalAmount.currencyCode || "USD"
            }
          }
        };

        state.items.push(newItem);
        saveWishlistToCookies(state);
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      // Save to cookies
      saveWishlistToCookies(state);
    },
    clearWishlist: (state) => {
      state.items = [];
      // Remove cookie
      Cookies.remove('wishlist');
    },
    // Update prices when they change
    updateWishlistPrices: (
      state,
      action: PayloadAction<Array<{ id: string; updatedCost: CartItem['cost'] }>>
    ) => {
      action.payload.forEach(({ id, updatedCost }) => {
        const item = state.items.find(item => item.id === id);
        if (item) {
          item.cost = updatedCost;
        }
      });
      saveWishlistToCookies(state);
    },
  },
});

export const selectWishlistItems = (state: RootState) => state.wishlistReducer.items;

export const selectWishlistTotalValue = createSelector([selectWishlistItems], (items) => {
  return items.reduce((total, item) => {
    return total + parseFloat(item.cost.totalAmount.amount);
  }, 0);
});

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  clearWishlist,
  updateWishlistPrices,
} = wishlist.actions;
export default wishlist.reducer;
