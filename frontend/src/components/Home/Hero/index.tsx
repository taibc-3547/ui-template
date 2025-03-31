'use client'
import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { getPromotedProducts } from "@/app/lib/fastschema";
import { useEffect, useState } from "react";

// Keep original promoItems as fallback
const promoItems = [
  {
    title: "Spring Collection 2024",
    description: "limited time offer",
    currentPrice: "$199",
    originalPrice: "$299",
    image: {
      src: "/images/hero/hero-03.png", 
      alt: "spring collection",
      width: 123,
      height: 161
    },
    link: "#"
  },
  {
    title: "Winter Jacket",
    description: "limited time offer",
    currentPrice: "$89", 
    originalPrice: "$129",
    image: {
      src: "/images/hero/hero-01.png",
      alt: "winter jacket",
      width: 123,
      height: 161
    },
    link: "#"
  }
];

const Hero = () => {
  const [promos, setPromos] = useState(promoItems);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const products = await getPromotedProducts(2);
        const promoProducts = products.map(product => ({
          title: product.name,
          description: `${product.description}`,
          currentPrice: `$${product.price}`,
          originalPrice: `$${Math.round(product.price * 1.5)}`,
          image: {
            src: product.featured_image.url,
            alt: product.name,
            width: 123,
            height: 161
          },
          link: `/products/${product.slug}`
        }));
        
        setPromos(promoProducts.length > 0 ? promoProducts : promoItems);
      } catch (error) {
        console.error('Error fetching promo products:', error);
        setPromos(promoItems);
      }
    };

    fetchPromos();
  }, []);

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {promos.map((item, index) => (
                <div key={index} className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-start gap-10">
                      <h2 className="font-semibold text-dark text-xl">
                        <Link href={item.link}>{item.title}</Link>
                      </h2>

                      <div className="flex flex-col justify-start">
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          {item.description}
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">
                            {item.currentPrice}
                          </span>
                          <span className="font-medium text-2xl text-dark-4 line-through">
                            {item.originalPrice}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 relative w-[123px] h-[161px] rounded-lg overflow-hidden">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;