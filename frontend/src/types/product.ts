export type Product = {
  reviews: any;
  title: string;
  id: number;
  name: string;
  slug: string;
  featured_image: any;
  images?: string[];
  price: number;
  description?: string;
  content?: string;
  categories?: any[];
  for_sale?: boolean;
  discountedPrice?: number;
  imgs?: {
    thumbnails: any;
    previews: any;
  };
};
