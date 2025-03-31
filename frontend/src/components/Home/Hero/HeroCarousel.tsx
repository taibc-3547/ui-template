"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { getPromotedProducts } from "@/app/lib/fastschema";
import { Product } from "@/app/lib/fastschema/types";
import { useEffect, useState } from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

// Keep the original heroSlides as fallback
const heroSlides = [
  {
    discount: "50%",
    title: "Winter Collection Fashion & Style",
    description: "Discover our latest winter collection featuring cozy sweaters, stylish coats and trendy accessories to keep you warm and fashionable.",
    image: {
      src: "/images/hero/hero-01.png",
      alt: "winter fashion",
      width: 351,
      height: 358
    },
    slug: "winter-collection-fashion-style",
  },
  {
    discount: "30%",
    title: "New Arrivals - Spring Collection",
    description: "Refresh your wardrobe with our new spring styles. Light fabrics, vibrant colors, and contemporary designs.",
    image: {
      src: "/images/hero/hero-02.png", 
      alt: "spring fashion",
      width: 351,
      height: 358
    },
    slug: "new-arrivals-spring-collection",
  }
];

const HeroCarousal = () => {
  const [slides, setSlides] = useState(heroSlides);
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPromotedProducts = async () => {
      try {
        const products = await getPromotedProducts(5);
        // Map products to match heroSlides structure
        const productSlides = products.map(product => ({
          discount: `${Math.round((1 - product.price / (product.price * 1.5)) * 100)}%`, // Example discount calculation
          title: product.name,
          description: product.description,
          image: {
            src: product.featured_image.url,
            alt: product.name,
            width: 351,
            height: 358
          },
          link: `/products/${product.slug}`,
          id: product.id,
          price: product.price,
          slug: product.slug,
        }));
        
        setSlides(productSlides.length > 0 ? productSlides : heroSlides);
      } catch (error) {
        console.error('Error fetching promoted products:', error);
        // Fallback to heroSlides if API fails
        setSlides(heroSlides);
      }
    };

    fetchPromotedProducts();
  }, []);

  const handleQuickView = (product) => {
    dispatch(updateQuickView({ ...product }));
    openModal();
  };

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                  {slide.discount}
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <Link href="#">{slide.title}</Link>
              </h1>

              <p>{slide.description}</p>

              <button
                onClick={() => {
                  console.log("slide", slide)
                  handleQuickView({
                    name: slide.title,
                    description: slide.description,
                    price: 0, // You'll need to add price to your slides data
                    images: [{
                      url: slide.image.src
                    }],
                    slug: slide.slug,
                  })
                }}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                Shop Now
              </button>
            </div>

            <div className="py-10 flex-shrink-0">
              <div className="relative w-[351px] h-[358px] rounded-lg overflow-hidden">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;