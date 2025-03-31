"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPromotedProducts } from "@/app/lib/fastschema";
import Link from "next/link";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateQuickView } from "@/redux/features/quickView-slice";

// Default banner data for fallback
const defaultBanners = {
  main: {
    title: "Apple iPhone 14 Plus",
    subtitle: "UP TO 30% OFF",
    description: "iPhone 14 features the A15 Bionic chip with a 5-core GPU for top performance.",
    image: "/images/promo/promo-01.png",
    link: "#",
  },
  secondary: [
    {
      title: "Foldable Motorised Treadmill",
      subtitle: "Workout At Home",
      discount: "Flat 20% off",
      image: "/images/promo/promo-02.png",
      link: "#",
      theme: "bg-[#DBF4F3]",
      buttonTheme: "bg-teal hover:bg-teal-dark",
    },
    {
      title: "Apple Watch Ultra",
      subtitle: "Up to 40% off",
      description: "Aerospace-grade titanium offers durability and style in perfect harmony.",
      image: "/images/promo/promo-03.png",
      link: "#",
      theme: "bg-[#FFECE1]",
      buttonTheme: "bg-orange hover:bg-orange-dark",
    },
  ],
};

const PromoBanner = () => {
  const [banners, setBanners] = useState(defaultBanners);
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPromoBanners = async () => {
      try {
        const products = await getPromotedProducts(3); // Fetch 3 promoted products
        if (products.length > 0) {
          const mainProduct = products[0];
          const secondaryProducts = products.slice(1, 3);

          const newBanners = {
            main: {
              title: mainProduct.name,
              subtitle: "",
              description: mainProduct.description,
              image: mainProduct.featured_image.url,
              link: `/products/${mainProduct.slug}`,
            },
            secondary: secondaryProducts.map((product, index) => ({
              title: product.name,
              subtitle: "",
              discount: "",
              description: product.description,
              image: product.featured_image.url,
              link: `/products/${product.slug}`,
              theme: index === 0 ? "bg-[#DBF4F3]" : "bg-[#FFECE1]",
              buttonTheme: index === 0 ? "bg-teal hover:bg-teal-dark" : "bg-orange hover:bg-orange-dark",
            })),
          };

          setBanners(newBanners as typeof defaultBanners);
        }
      } catch (error) {
        console.error("Error fetching promo banners:", error);
        // Fallback to defaultBanners (already set)
      }
    };

    fetchPromoBanners();
  }, []);

  const handleQuickView = (product) => {
    dispatch(updateQuickView({ ...product }));
    openModal();
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Main Banner */}
        <div className="relative rounded-lg bg-[#F5F5F7] py-12 px-4 sm:px-8 lg:px-14 xl:px-19 mb-7.5 overflow-hidden flex justify-between items-center">
          <div className="max-w-[550px] relative z-10">
            <span className="block text-xl font-medium text-dark mb-3">{banners.main.title}</span>
            <h2 className="text-xl lg:text-3xl xl:text-4xl font-bold text-dark mb-5">{banners.main.subtitle}</h2>
            <p className="text-dark">{banners.main.description}</p>
            <button
              onClick={() => handleQuickView({
                name: banners.main.title,
                description: banners.main.description,
                images: [{
                  url: banners.main.image
                }],
                slug: banners.main.link.replace('/products/', ''),
                price: 0
              })}
              className="inline-flex mt-7.5 bg-blue text-white text-sm font-medium py-3 px-9 rounded-md hover:bg-blue-dark transition duration-200"
            >
              Buy Now
            </button>
          </div>
          <div className="relative w-[200px] h-[200px] flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={banners.main.image}
              alt={banners.main.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Secondary Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7.5">
          {banners.secondary.map((banner, index) => (
            <div
              key={index}
              className={`relative rounded-lg ${banner.theme} py-10 px-4 sm:px-8 xl:px-10 overflow-hidden`}
            >
              <div className={`absolute top-1/2 -translate-y-1/2 ${index === 0 ? "left-3 sm:left-10" : "right-3 sm:right-8"} w-[200px] h-[200px] rounded-lg overflow-hidden`}>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className={`relative z-10 ${index === 0 ? "text-right" : ""}`}>
                <span className="block text-lg text-dark mb-1.5">{banner.title}</span>
                <h2 className="text-xl lg:text-3xl font-bold text-dark mb-2.5">{banner.subtitle}</h2>
                {banner.discount && (
                  <p className="text-teal text-base font-semibold">{banner.discount}</p>
                )}
                {banner.description && (
                  <p className={`text-sm text-dark max-w-[220px] ${index === 0 ? "ml-auto" : ""}`}>
                    {banner.description}
                  </p>
                )}
                <button
                  onClick={() => handleQuickView({
                    name: banner.title,
                    description: banner.description || '',
                    images: [{
                      url: banner.image
                    }],
                    slug: banner.link.replace('/products/', ''),
                    price: 0
                  })}
                  className={`inline-flex mt-${index === 0 ? "9" : "9"} ${banner.buttonTheme} text-white text-sm font-medium py-2.5 px-8 rounded-md transition duration-200`}
                >
                  {index === 0 ? "Grab Now" : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;