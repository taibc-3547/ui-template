import { Product } from "@/app/lib/fastschema/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
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
};

export const productDetails = createSlice({
  name: "productDetails", 
  initialState,
  reducers: {
    updateproductDetails: (_, action) => {
      return {
        value: {
          ...action.payload,
        },
      };
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;
