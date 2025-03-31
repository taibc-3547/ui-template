"use client";
import React from "react";
import Image from "next/image";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Link from "next/link";
import { CartItem, Product } from "@/app/lib/fastschema/types";
import { selectWishlistItems } from "@/redux/features/wishlist-slice";

const ProductItem = ({ item }: { item: Product }) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector(selectWishlistItems);
  const isInWishlist = wishlistItems.some((wishlistItem) => wishlistItem.id === item.id.toString());

  // update the QuickView state
  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id: item.id.toString(),
        quantity: 1,
        cost: {
          totalAmount: {
            amount: item.price.toString(),
            currencyCode: "USD"
          }
        },
        merchandise: {
          id: item.id.toString(),
          title: item.name,
          selectedOptions: [],
          product: {
            id: item.id.toString(),
            handle: item.slug,
            title: item.name,
            featuredImage: item.images[0]
          }
        }
      } as CartItem)
    );
  };

  const handleItemToWishList = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishlist(item.id.toString()));
    } else {
      dispatch(
        addItemToWishlist({
          id: item.id.toString(),
          quantity: 1,
          cost: {
            totalAmount: {
              amount: item.price.toString(),
              currencyCode: "USD"
            }
          },
          merchandise: {
            id: item.id.toString(),
            title: item.name,
            selectedOptions: [],
            product: {
              id: item.id.toString(),
              handle: item.slug,
              title: item.name,
              featuredImage: item.images[0]
            }
          }
        } as CartItem)
      );
    }
  };

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4">
      <div className="relative w-[250px] h-[320px]">
          <Image
            src={item.images[0].url}
            alt=""
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
          <button
            onClick={() => {
              openModal();
              handleQuickViewUpdate();
            }}
            id="newOne"
            aria-label="button for quick view"
            className="flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 text-dark bg-white hover:text-blue"
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
                d="M8.00016 5.5C6.61945 5.5 5.50016 6.61929 5.50016 8C5.50016 9.38071 6.61945 10.5 8.00016 10.5C9.38087 10.5 10.5002 9.38071 10.5002 8C10.5002 6.61929 9.38087 5.5 8.00016 5.5ZM6.50016 8C6.50016 7.17157 7.17174 6.5 8.00016 6.5C8.82859 6.5 9.50016 7.17157 9.50016 8C9.50016 8.82842 8.82859 9.5 8.00016 9.5C7.17174 9.5 6.50016 8.82842 6.50016 8Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00016 2.16666C4.99074 2.16666 2.96369 3.96946 1.78721 5.49791L1.76599 5.52546C1.49992 5.87102 1.25487 6.18928 1.08862 6.5656C0.910592 6.96858 0.833496 7.40779 0.833496 8C0.833496 8.5922 0.910592 9.03142 1.08862 9.4344C1.25487 9.81072 1.49992 10.129 1.76599 10.4745L1.78721 10.5021C2.96369 12.0305 4.99074 13.8333 8.00016 13.8333C11.0096 13.8333 13.0366 12.0305 14.2131 10.5021L14.2343 10.4745C14.5004 10.129 14.7455 9.81072 14.9117 9.4344C15.0897 9.03142 15.1668 8.5922 15.1668 8C15.1668 7.40779 15.0897 6.96858 14.9117 6.5656C14.7455 6.18927 14.5004 5.87101 14.2343 5.52545L14.2131 5.49791C13.0366 3.96946 11.0096 2.16666 8.00016 2.16666ZM2.57964 6.10786C3.66592 4.69661 5.43374 3.16666 8.00016 3.16666C10.5666 3.16666 12.3344 4.69661 13.4207 6.10786C13.7131 6.48772 13.8843 6.7147 13.997 6.9697C14.1023 7.20801 14.1668 7.49929 14.1668 8C14.1668 8.50071 14.1023 8.79199 13.997 9.0303C13.8843 9.28529 13.7131 9.51227 13.4207 9.89213C12.3344 11.3034 10.5666 12.8333 8.00016 12.8333C5.43374 12.8333 3.66592 11.3034 2.57964 9.89213C2.28725 9.51227 2.11599 9.28529 2.00334 9.0303C1.89805 8.79199 1.8335 8.50071 1.8335 8C1.8335 7.49929 1.89805 7.20801 2.00334 6.9697C2.11599 6.7147 2.28725 6.48772 2.57964 6.10786Z"
                fill=""
              />
            </svg>
          </button>

          <button
            onClick={() => handleAddToCart()}
            className="inline-flex font-medium text-custom-sm py-[7px] px-5 rounded-[5px] bg-blue text-white ease-out duration-200 hover:bg-blue-dark"
          >
            Add to cart
          </button>

          <button
            onClick={() => handleItemToWishList()}
            aria-label="button for favorite select"
            id="favOne"
            className={`flex items-center justify-center w-9 h-9 rounded-[5px] shadow-1 ease-out duration-200 bg-white 
              ${isInWishlist ? 'text-red-light' : 'text-gray-light hover:text-blue'}`}
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isInWishlist ? (
                <path
                  d="M8 2.97255C6.45863 1.5935 4.73264 1.40058 3.33384 2.03998C1.85647 2.71528 0.833333 4.28336 0.833333 6.0914C0.833333 7.86842 1.57366 9.22404 2.54448 10.3172C3.32191 11.1926 4.27348 11.9253 5.11388 12.5724C5.30439 12.7191 5.48919 12.8614 5.66494 12.9999C6.00644 13.2691 6.37303 13.5562 6.74455 13.7733C7.1159 13.9903 7.53973 14.1667 8 14.1667C8.46026 14.1667 8.88409 13.9903 9.25545 13.7733C9.62697 13.5562 9.99356 13.2691 10.3351 12.9999C10.5108 12.8614 10.6956 12.7191 10.8861 12.5724C11.7265 11.9253 12.6781 11.1926 13.4555 10.3172C14.4263 9.22404 15.1667 7.86842 15.1667 6.0914C15.1667 4.28336 14.1435 2.71528 12.6662 2.03998C11.2674 1.40058 9.54137 1.5935 8 2.97255Z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.99992 2.97255C6.45855 1.5935 4.73256 1.40058 3.33376 2.03998C1.85639 2.71528 0.833252 4.28336 0.833252 6.0914C0.833252 7.86842 1.57358 9.22404 2.5444 10.3172C3.32183 11.1926 4.2734 11.9253 5.1138 12.5724C5.30431 12.7191 5.48911 12.8614 5.66486 12.9999C6.00636 13.2691 6.37295 13.5562 6.74447 13.7733C7.11582 13.9903 7.53965 14.1667 7.99992 14.1667C8.46018 14.1667 8.88401 13.9903 9.25537 13.7733C9.62689 13.5562 9.99348 13.2691 10.335 12.9999C10.5107 12.8614 10.6955 12.7191 10.886 12.5724C11.7264 11.9253 12.678 11.1926 13.4554 10.3172C14.4263 9.22404 15.1666 7.86842 15.1666 6.0914C15.1666 4.28336 14.1434 2.71528 12.6661 2.03998C11.2673 1.40058 9.54129 1.5935 7.99992 2.97255Z"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
        </div>

        {/* <p className="text-custom-sm">({item.reviews})</p> */}
      </div>

      <h3
        className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5"
        onClick={() => handleProductDetails()}
      >
        <Link href="/shop-details"> {item.name} </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">${item.price}</span>
        <span className="text-dark-4 line-through">${item.price}</span>
      </span>
    </div>
  );
};

export default ProductItem;
