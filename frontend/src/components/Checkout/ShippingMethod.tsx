import React, { useState } from "react";
import Image from "next/image";

const ShippingMethod = () => {
  const [shippingMethod, setShippingMethod] = useState("fedex");
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="fedex"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="fedex"
                id="fedex"
                className="sr-only"
                onChange={() => setShippingMethod("fedex")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  shippingMethod === "fedex"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div 
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-300 w-[280px]
                ${shippingMethod === "fedex" 
                  ? "border-blue bg-blue/5 shadow-md" 
                  : "border-gray-4 hover:bg-gray-2 hover:border-transparent"
                }`}
            >
              <div className="flex items-center">
                <div className={`pr-4 ${shippingMethod !== "fedex" ? "opacity-60" : ""}`}>
                  <Image
                    src="/images/checkout/fedex.svg"
                    alt="fedex"
                    width={64}
                    height={18}
                  />
                </div>

                <div className="border-l border-gray-4 pl-4">
                  <p className={`font-semibold text-dark ${shippingMethod === "fedex" ? "text-blue" : ""}`}>$15.00</p>
                  <p className="text-custom-xs">Standard Shipping</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="dhl"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="dhl"
                id="dhl"
                className="sr-only"
                onChange={() => setShippingMethod("dhl")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  shippingMethod === "dhl"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div 
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-300 w-[280px]
                ${shippingMethod === "dhl" 
                  ? "border-blue bg-blue/5 shadow-md" 
                  : "border-gray-4 hover:bg-gray-2 hover:border-transparent"
                }`}
            >
              <div className="flex items-center">
                <div className={`pr-4 ${shippingMethod !== "dhl" ? "opacity-60" : ""}`}>
                  <Image
                    src="/images/checkout/dhl.svg"
                    alt="dhl"
                    width={64}
                    height={20}
                  />
                </div>

                <div className="border-l border-gray-4 pl-4">
                  <p className={`font-semibold text-dark ${shippingMethod === "dhl" ? "text-blue" : ""}`}>$15.00</p>
                  <p className="text-custom-xs">Standard Shipping</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
