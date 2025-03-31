import { OrderInfoFormValues } from "@/components/Checkout/data";


export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<SiteCart, 'lines'> & {
  lines: CartItem[];
};

export type Order = {
  id: string;
  hash?: string;
  name: string;
  email: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  delivery_method: string;
  currency: string;
  subtotal: number;
  total: number;
  tax: number;
  delivery_fee: number;
  status: string;
  payment_method: string;
  cart?: {
    hash: string;
  };
} & OrderInfoFormValues;

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Category = SiteCategory & {
  id: number;
  path: string;
};

export type Image = {
  url: string;
  name?: string;
  width?: number;
  height?: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = Omit<SiteProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
  categories: Category[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type SiteCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
    deliveryAmount?: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type SiteCategory = {
  slug: string;
  name: string;
  description: string;
  seo?: SEO;
  updatedAt: string;
};

export type SiteProduct = {
  id: string;
  slug: string;
  for_sale: boolean;
  name: string;
  description: string;
  content?: string;
  options?: ProductOption[];
  price: number;
  promoted: boolean;
  sales_count: number;
  size: string;
  color: string;
  featured_image: Image;
  images: Connection<Image>;
  seo?: SEO;
  tags?: string[];
  updatedAt?: string;
};
