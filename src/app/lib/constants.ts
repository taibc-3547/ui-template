export type SortFilterItem = {
  name: string;
  slug: string | null;
  sortKey: 'BEST_SELLING' | 'ID' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  name: 'Latest arrivals',
  slug: null,
  sortKey: 'ID',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { name: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: true },
  { name: 'Latest arrivals', slug: 'latest-desc', sortKey: 'ID', reverse: true },
  { name: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { name: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
