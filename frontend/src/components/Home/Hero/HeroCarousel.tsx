"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import Link from "next/link";

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
    link: "/shop-with-sidebar"
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
    link: "/shop-with-sidebar"
  }
];

const HeroCarousal = () => {
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
      {heroSlides.map((slide, index) => (
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

              <Link
                href={slide.link}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
              >
                Shop Now
              </Link>
            </div>

            <div>
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                width={slide.image.width}
                height={slide.image.height}
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
