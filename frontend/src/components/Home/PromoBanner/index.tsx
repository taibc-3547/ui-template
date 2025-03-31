"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPromotedProducts } from "@/app/lib/fastschema";
import Link from "next/link";

// Fallback banner data in case API fails
const defaultBanners = {
  main: {
    title: "Apple iPhone 14 Plus",
    subtitle: "UP TO 30% OFF",
    description: "iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features.",
    image: "/images/promo/promo-01.png",
    link: "#"
  },
  secondary: [
    {
      title: "Foldable Motorised Treadmill",
      subtitle: "Workout At Home",
      discount: "Flat 20% off",
      image: "/images/promo/promo-02.png",
      link: "#",
      theme: "bg-[#DBF4F3]",
      buttonTheme: "bg-teal hover:bg-teal-dark"
    },
    {
      title: "Apple Watch Ultra",
      subtitle: "Up to 40% off",
      description: "The aerospace-grade titanium case strikes the perfect balance of everything.",
      image: "/images/promo/promo-03.png",
      link: "#",
      theme: "bg-[#FFECE1]",
      buttonTheme: "bg-orange hover:bg-orange-dark"
    }
  ]
};

const PromoBanner = () => {
  const [banners, setBanners] = useState(defaultBanners);

  useEffect(() => {
    const fetchPromoBanners = async () => {
      try {
        const products = await getPromotedProducts(3); // Get top 3 promoted products
        
        if (products.length > 0) {
          const mainProduct = products[0];
          const secondaryProducts = products.slice(1, 3);

          const newBanners = {
            main: {
              title: mainProduct.name,
              subtitle: '',
              description: mainProduct.description,
              image: mainProduct.featured_image.url,
              link: `/products/${mainProduct.slug}`
            },
            secondary: secondaryProducts.map((product, index) => ({
              title: product.name,
              subtitle: '',
              discount: '',
              description: product.description,
              image: product.featured_image.url,
              link: `/products/${product.slug}`,
              theme: index === 0 ? "bg-[#DBF4F3]" : "bg-[#FFECE1]",
              buttonTheme: index === 0 ? "bg-teal hover:bg-teal-dark" : "bg-orange hover:bg-orange-dark"
            }))
          };

          setBanners(newBanners as typeof defaultBanners);
        }
      } catch (error) {
        console.error('Error fetching promo banners:', error);
        // Fallback to default banners is automatic since we initialized with them
      }
    };

    fetchPromoBanners();
  }, []);

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Main banner */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              {banners.main.title}
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              {banners.main.subtitle}
            </h2>

            <p>{banners.main.description}</p>

            <Link
              href={banners.main.link}
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Buy Now
            </Link>
          </div>

          <Image
            src={banners.main.image}
            alt={banners.main.title}
            className="absolute bottom-0 right-4 lg:right-26 -z-1"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {banners.secondary.map((banner, index) => (
            <div key={index} className={`relative z-1 overflow-hidden rounded-lg ${banner.theme} py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10`}>
              <Image
                src={banner.image}
                alt={banner.title}
                className={`absolute top-1/2 -translate-y-1/2 ${index === 0 ? 'left-3 sm:left-10' : 'right-3 sm:right-8.5'} -z-1`}
                width={index === 0 ? 241 : 200}
                height={index === 0 ? 241 : 200}
              />

              <div className={index === 0 ? 'text-right' : ''}>
                <span className="block text-lg text-dark mb-1.5">
                  {banner.title}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                  {banner.subtitle}
                </h2>

                {banner.discount && (
                  <p className="font-semibold text-custom-1 text-teal">
                    {banner.discount}
                  </p>
                )}

                {banner.description && (
                  <div className={`${index === 0 ? 'ml-auto' : ''} max-w-[220px]`}>
                    <span className="inline-block text-custom-sm break-words whitespace-normal">
                      {banner.description}
                    </span>
                  </div>
                )}

                <Link
                  href={banner.link}
                  className={`inline-flex font-medium text-custom-sm text-white ${banner.buttonTheme} py-2.5 px-8.5 rounded-md ease-out duration-200 mt-${index === 0 ? '9' : '7.5'}`}
                >
                  {index === 0 ? 'Grab Now' : 'Buy Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
