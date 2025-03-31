"use client";
import React, { useEffect, useState } from "react";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { getProduct } from "@/app/lib/fastschema";
import { CartItem, Product } from "@/app/lib/fastschema/types";
import { addItemToWishlist, removeItemFromWishlist, selectWishlistItems } from "@/redux/features/wishlist-slice";
import { useSelector } from "react-redux";

const QuickViewModal = () => {
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // get the product handle/slug from redux
  const quickViewProduct = useAppSelector((state) => state.quickViewReducer.value);

  const [activePreview, setActivePreview] = useState(0);

  // Add wishlist selector
  const wishlistItems = useSelector(selectWishlistItems);
  const isInWishlist = productData ? wishlistItems.some((wishlistItem) => wishlistItem.id === productData.id.toString()) : false;

  // Fetch product data when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      // console.log("quickViewProduct", quickViewProduct)
      if (isModalOpen && quickViewProduct?.slug) {
        setLoading(true);
        try {
          const product = await getProduct(quickViewProduct.slug);
          if (product) {
            setProductData(product);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [isModalOpen, quickViewProduct?.slug]);

  // handle add to cart with proper product data
  const handleAddToCart = () => {
    if (productData) {
      dispatch(
        addItemToCart({
          id: productData.id,
          quantity,
          cost: {
            totalAmount: {
              amount: productData.price.toString(),
              currencyCode: "USD"
            }
          },
          merchandise: {
            id: productData.id,
            title: productData.name,
            selectedOptions: [],
            product: {
              id: productData.id,
              handle: productData.slug,
              title: productData.name,
              featuredImage: productData.featured_image
            }
          }
        } as CartItem)
      );
      closeModal();
    }
  };

  // Update preview handling with proper image data
  const handlePreviewSlider = () => {
    if (productData) {
      dispatch(updateproductDetails(productData));
      openPreviewModal();
    }
  };

  // Add handleItemToWishList function
  const handleItemToWishList = () => {
    if (!productData) return;

    if (isInWishlist) {
      dispatch(removeItemFromWishlist(productData.id.toString()));
    } else {
      dispatch(
        addItemToWishlist({
          id: productData.id.toString(),
          quantity: 1,
          cost: {
            totalAmount: {
              amount: productData.price.toString(),
              currencyCode: "USD"
            }
          },
          merchandise: {
            id: productData.id.toString(),
            title: productData.name,
            selectedOptions: [],
            product: {
              id: productData.id.toString(),
              handle: productData.slug,
              title: productData.name,
              featuredImage: productData.featured_image
            }
          }
        } as CartItem)
      );
    }
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, closeModal]);

  return (
    <div
      className={`${
        isModalOpen ? "z-99999" : "hidden"
      } fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5`}
    >
      <div className="flex items-center justify-center ">
        <div className="w-full max-w-[1100px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={() => closeModal()}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-6 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <span>Loading...</span>
            </div>
          ) : productData ? (
            <div className="flex flex-wrap items-center gap-12.5">
              <div className="max-w-[526px] w-full">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-5">
                    {productData.images?.map((img, key) => (
                      <button
                        onClick={() => setActivePreview(key)}
                        key={key}
                        className={`flex items-center justify-center w-20 h-20 overflow-hidden rounded-lg bg-gray-1 ease-out duration-200 hover:border-2 hover:border-blue ${
                          activePreview === key && "border-2 border-blue"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          width={61}
                          height={61}
                          className="aspect-square"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="relative z-1 overflow-hidden flex items-center justify-center w-full sm:min-h-[508px] bg-gray-1 rounded-lg border border-gray-3">
                    <Image
                      src={productData.images?.[activePreview]?.url || productData.featured_image.url}
                      alt={productData.name}
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-[445px] w-full">
                <span className="inline-block text-custom-xs font-medium text-white py-1 px-3 bg-green mb-6.5">
                  SALE 20% OFF
                </span>

                <h3 className="font-semibold text-xl xl:text-heading-5 text-dark mb-4">
                  {productData.name}
                </h3>

                <div className="flex flex-wrap items-center gap-5 mb-6">
                  <div className="flex items-center gap-1.5">
                    {/* <!-- stars --> */}
                    <div className="flex items-center gap-1">
                      <svg
                        className="fill-[#FFA645]"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9172">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <svg
                        className="fill-[#FFA645]"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9172">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <svg
                        className="fill-[#FFA645]"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9172">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <svg
                        className="fill-gray-4"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9172">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>

                      <svg
                        className="fill-gray-4"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9172)">
                          <path
                            d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                            fill=""
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9172">
                            <rect width="18" height="18" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    <span>
                      <span className="font-medium text-dark"> 4.7 Rating </span>
                      <span className="text-dark-2"> (5 reviews) </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_375_9221)">
                        <path
                          d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                          fill="#22AD5C"
                        />
                        <path
                          d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                          fill="#22AD5C"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_375_9221">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span className="font-medium text-dark"> In Stock </span>
                  </div>
                </div>

                <p>
                  {productData.description}
                </p>

                <div className="flex flex-wrap justify-between gap-5 mt-6 mb-7.5">
                  <div>
                    <h4 className="font-semibold text-lg text-dark mb-3.5">
                      Price
                    </h4>

                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-dark text-xl xl:text-heading-4">
                        ${productData.price}
                      </span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-dark mb-3.5">
                      Quantity
                    </h4>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        aria-label="button for remove product"
                        className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                        disabled={quantity < 0 && true}
                      >
                        <svg
                          className="fill-current"
                          width="16"
                          height="2"
                          viewBox="0 0 16 2"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M-8.548e-08 0.977778C-3.82707e-08 0.437766 0.437766 3.82707e-08 0.977778 8.548e-08L15.0222 1.31328e-06C15.5622 1.36049e-06 16 0.437767 16 0.977779C16 1.51779 15.5622 1.95556 15.0222 1.95556L0.977778 1.95556C0.437766 1.95556 -1.32689e-07 1.51779 -8.548e-08 0.977778Z"
                            fill=""
                          />
                        </svg>
                      </button>

                      <span
                        className="flex items-center justify-center w-20 h-10 rounded-[5px] border border-gray-4 bg-white font-medium text-dark"
                        x-text="quantity"
                      >
                        {quantity}
                      </span>

                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="button for add product"
                        className="flex items-center justify-center w-10 h-10 rounded-[5px] bg-gray-2 text-dark ease-out duration-200 hover:text-blue"
                      >
                        <svg
                          className="fill-current"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.08889 0C8.6289 2.36047e-08 9.06667 0.437766 9.06667 0.977778L9.06667 15.0222C9.06667 15.5622 8.6289 16 8.08889 16C7.54888 16 7.11111 15.5622 7.11111 15.0222L7.11111 0.977778C7.11111 0.437766 7.54888 -2.36047e-08 8.08889 0Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 7.91111C4.72093e-08 7.3711 0.437766 6.93333 0.977778 6.93333L15.0222 6.93333C15.5622 6.93333 16 7.3711 16 7.91111C16 8.45112 15.5622 8.88889 15.0222 8.88889L0.977778 8.88889C0.437766 8.88889 -4.72093e-08 8.45112 0 7.91111Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    disabled={quantity === 0 && true}
                    onClick={() => handleAddToCart()}
                    className={`inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark
                    `}
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => handleItemToWishList()}
                    className={`inline-flex items-center gap-2 font-medium py-3 px-6 rounded-md ease-out duration-200 
                      bg-dark text-white hover:bg-opacity-95`}
                  >
                    <svg
                      className="fill-current"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {isInWishlist ? (
                        <path fill="red" d="M10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z" />
                      ) : (
                        <path d="M10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z" />
                      )}
                    </svg>
                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <span>Product not found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
