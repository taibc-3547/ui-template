import * as z from 'zod';

export const orderInfoFormSchema = z.object({
  name: z.string().min(3, { message: 'Name is required and must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
  delivery_method: z.string().min(1, { message: 'Delivery method is required' })
});

export type OrderInfoFormValues = z.infer<typeof orderInfoFormSchema>;

export const defaultOrderInfoValues: OrderInfoFormValues = {
  name: 'Phuong Nguyen',
  email: 'nguyen.ngoc.phuong@sun-asterisk.com',
  country: 'us',
  city: 'sf',
  address: '55 Ceres St',
  phone: '(415) 206-1794',
  delivery_method: 'dhl_fast'
};

export const paymentMethods = [
  {
    name: 'credit_card',
    label: 'Credit Card',
    description: 'Pay with your credit card',
    disabled: false
  },
  {
    name: 'paypal',
    label: 'PayPal Account',
    description: 'Connect to your account',
    disabled: true
  },
  {
    name: 'cod',
    label: 'Payment on delivery',
    description: '+$15 payment processing fee',
    disabled: true
  }
] as const;

export const deliveryMethods = [
  {
    name: 'dhl_fast',
    price: 15,
    label: 'DHL Fast Delivery',
    deliveryTime: 'Get it by Tommorow',
    disabled: false
  },
  {
    name: 'fedex',
    price: 0,
    label: 'FedEx',
    deliveryTime: 'Get it by Friday, 13 Dec 2023',
    disabled: false
  },
  {
    name: 'express',
    price: 49,
    label: 'Express Delivery',
    deliveryTime: 'Get it today',
    disabled: false
  }
] as const;

export type DeliveryMethod = (typeof deliveryMethods)[number]['name'];

export const getDeliveriesPrice = (method: DeliveryMethod) => {
  return deliveryMethods.find((m) => m.name === method)?.price || 0;
};

export const getDeliveryMethod = (method: DeliveryMethod) => {
  return deliveryMethods.find((m) => m.name === method);
}

export const orderStatuses = {
  payment_pending: {
    label: 'Payment Pending',
    description: 'Your payment is pending. Please complete the payment to proceed.'
  },
  payment_failed: {
    label: 'Payment Failed',
    description: 'Your payment has failed. Please try again.'
  },
  payment_success: {
    label: 'Payment Success',
    description: 'Your payment has been successfully processed. We will start processing your order.'
  },
  reviewing: {
    label: 'Reviewing',
    description: 'We are reviewing your order. Please wait for a moment.'
  },
  delivery_pending: {
    label: 'Delivery Pending',
    description: 'Your order is ready for delivery. We will start shipping soon.'
  },
  delivery_inprogress: {
    label: 'Delivery In Progress',
    description: 'Your order is on the way. Please wait for the delivery.'
  },
  delivery_delivered: {
    label: 'Delivered',
    description: 'Your order has been delivered successfully. Enjoy your items!'
  },
  completed: {
    label: 'Completed',
    description: 'Your order has been completed. Thank you for shopping with us!'
  }
}

export const countries = [
  { key: 'us', value: 'United States' },
  { key: 'as', value: 'Australia' },
  { key: 'fr', value: 'France' },
  { key: 'es', value: 'Spain' },
  { key: 'uk', value: 'United Kingdom' }
] as const;

export const cities = [
  { key: 'sf', value: 'San Francisco' },
  { key: 'ny', value: 'New York' },
  { key: 'la', value: 'Los Angeles' },
  { key: 'ch', value: 'Chicago' },
  { key: 'hu', value: 'Houston' }
] as const;

export const getCountryName = (key: string) => {
  return countries.find((c) => c.key === key)?.value;
}

export const getCityName = (key: string) => {
  return cities.find((c) => c.key === key)?.value;
}
