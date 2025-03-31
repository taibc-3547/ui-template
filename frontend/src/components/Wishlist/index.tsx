"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { useAppSelector } from "@/redux/store";
import SingleItem from "./SingleItem";
import { useDispatch } from "react-redux";
import { clearWishlist } from "@/redux/features/wishlist-slice";
import { CartItem } from "@/app/lib/fastschema/types";

export const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items) as CartItem[];

  console.log('wishlistItems', wishlistItems);
  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Your Wishlist</h2>
            <button 
              onClick={handleClearWishlist}
              className="text-blue hover:text-blue-dark transition-colors"
              disabled={wishlistItems.length === 0}
            >
              Clear Wishlist
            </button>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* <!-- table header --> */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px]">
                    <p className="text-dark">Product</p>
                  </div>

                  <div className="min-w-[205px]">
                    <p className="text-dark">Unit Price</p>
                  </div>

                  <div className="min-w-[265px]">
                    <p className="text-dark">Stock Status</p>
                  </div>

                  <div className="min-w-[150px]">
                    <p className="text-dark text-right">Action</p>
                  </div>
                </div>

                {wishlistItems.length > 0 ? (
                  // Display wishlist items
                  wishlistItems.map((item) => (
                    <SingleItem key={item.id} item={item} />
                  ))
                ) : (
                  // Display empty state
                  <div className="flex items-center justify-center py-10 px-10">
                    <p className="text-dark-4">Your wishlist is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
