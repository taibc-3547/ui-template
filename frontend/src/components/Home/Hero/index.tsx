import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";

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
              {promoItems.map((item, index) => (
                <div key={index} className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                        <Link href={item.link}>{item.title}</Link>
                      </h2>

                      <div>
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

                    <div>
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
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
