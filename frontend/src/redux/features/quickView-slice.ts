import { Product } from "@/app/lib/fastschema/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: Product;
};

const initialState = {
  value: {
    slug: "",
    for_sale: false,
    name: "",
    description: "",
    featured_image: "",
    title: "",
    reviews: 0,
    price: 0,
    discountedPrice: 0,
    img: "",
    id: 0,
    images: [],
    imgs: { thumbnails: [], previews: [] },
  } as unknown as Product,
} as InitialState;

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },

    resetQuickView: () => {
      return {
        value: initialState.value,
      };
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;
