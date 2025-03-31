import React, { useState } from "react";
import Image from "next/image";

const PaymentMethod = () => {
  const [payment, setPayment] = useState("cash");

  const handlePaymentChange = (method: string) => {
    if (method === "cash") {
      setPayment(method);
    }
  };

  const DisabledPaymentMethod = ({ id, name, icon, width, height }: { 
    id: string;
    name: string;
    icon: string;
    width: number;
    height: number;
  }) => (
    <div className="relative group">
      <label
        htmlFor={id}
        className="flex select-none items-center gap-4 opacity-60 cursor-not-allowed"
      >
        <div className="relative">
          <input
            type="checkbox"
            name={id}
            id={id}
            className="sr-only"
            onChange={() => handlePaymentChange(id)}
            disabled
          />
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-4 bg-gray-100"></div>
        </div>

        <div className="rounded-md border-[0.5px] py-3.5 px-5 border-gray-4 bg-gray-50">
          <div className="flex items-center">
            <div className="pr-2.5 grayscale">
              <Image src={icon} alt={id} width={width} height={height}/>
            </div>

            <div className="border-l border-gray-4 pl-2.5">
              <p className="relative">
                {name}
                <span className="absolute left-0 top-1/2 h-[1px] w-full bg-gray-400/50"></span>
              </p>
            </div>
          </div>  
        </div>
      </label>
      <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -top-10 bg-dark/90 backdrop-blur-sm text-white text-sm py-2 px-4 rounded-lg whitespace-nowrap shadow-lg">
        Payment method is in development
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <DisabledPaymentMethod 
            id="bank"
            name="Direct bank transfer"
            icon="/images/checkout/bank.svg"
            width={29}
            height={12}
          />

          {/* Enhanced Active Cash on Delivery Option */}
          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="checkbox"
                name="cash"
                id="cash"
                className="sr-only"
                onChange={() => handlePaymentChange("cash")}
                checked={payment === "cash"}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "cash"
                    ? "border-4 border-blue ring-2 ring-blue/30"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 min-w-[240px] ${
                payment === "cash"
                  ? "border-blue/20 bg-blue/5 shadow-[0_0_15px_rgba(60,80,224,0.1)] transform scale-[1.02]"
                  : "border-gray-4 shadow-1"
              }`}
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image 
                    src="/images/checkout/cash.svg" 
                    alt="cash" 
                    width={21} 
                    height={21}
                    className={payment === "cash" ? "transform scale-110" : ""} 
                  />
                </div>

                <div className="border-l border-gray-4 pl-2.5">
                  <p className={`font-medium ${payment === "cash" ? "text-blue" : ""}`}>
                    Cash on delivery
                    {payment === "cash" && (
                      <span className="ml-2 text-xs bg-blue/10 text-blue py-1 px-2 rounded-full">
                        Selected
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </label>

          <DisabledPaymentMethod 
            id="paypal"
            name="Paypal"
            icon="/images/checkout/paypal.svg"
            width={75}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
