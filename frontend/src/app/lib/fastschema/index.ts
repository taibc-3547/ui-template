import { FastSchema } from 'fastschema';
export * from 'fastschema';
import { Cart, Category, Menu, Order, Product } from './types';
import { OrderInfoFormValues } from '@/components/Checkout/data';

export const useFastSchema = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_FASTSCHEMA_BASE_URL;
  if (!globalThis._fastschema) {
    console.log('> Initializing FastSchema');
    globalThis._fastschema = new FastSchema(baseUrl);
    await globalThis._fastschema.init();
  }

  return globalThis._fastschema;
};

export const createOrder = async (cartId: string, info: OrderInfoFormValues) => {
  const fastschema = await useFastSchema();
  const order = await fastschema.request().post('/ec/order', {
    cartId,
    info
  });
  return order;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const fastschema = await useFastSchema();
  const order = await fastschema.request().put('/ec/order/' + orderId + '/status', {
    status
  });
  return order;
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const fastschema = await useFastSchema();
  const order = await fastschema.request().get('/ec/order/' + orderId);
  return order;
};

export async function createCart(): Promise<Cart> {
  const fastschema = await useFastSchema();
  const cart = await fastschema.request().post('/ec/cart');
  return cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const fastschema = await useFastSchema();
  const cart = await fastschema.request().post('/ec/cart/' + cartId, {
    lines: lines.map((l) => ({
      id: l.merchandiseId,
      quantity: l.quantity
    }))
  });

  return cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const fastschema = await useFastSchema();
  const cart = await fastschema.request().post('/ec/cart/' + cartId + '/remove', {
    lineIds
  });

  return cart;
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const fastschema = await useFastSchema();
  const cart = await fastschema.request().put('/ec/cart/' + cartId, {
    lines: lines.map((l) => ({
      id: l.id,
      quantity: l.quantity
    }))
  });

  return cart;
}

export async function getCart(cartId: string | undefined): Promise<Cart | undefined> {
  if (!cartId) {
    return undefined;
  }
  const fastschema = await useFastSchema();
  const cart = await fastschema.request().get('/ec/cart/' + cartId);
  return cart;
}

export async function getCategory(handle: string): Promise<Category | undefined> {
  const fastschema = await useFastSchema();
  const category = await fastschema.schema('category').get({
    filter: {
      slug: handle
    },
    select: 'id,name,slug,description,image'
  });

  if (!category?.items?.[0]) return undefined;
  
  const cat = category.items[0];
  return {
    id: cat.id as number,
    slug: cat.slug,
    name: cat.name,
    description: cat.description ?? '',
    seo: {
      title: cat.name,
      description: cat.description ?? ''
    },
    path: '/search/' + cat.slug,
    updatedAt: cat.updated_at ?? new Date().toISOString(),
    image: cat.image ? { url: cat.image.url } : undefined
  };
}

export async function getCollectionProducts({
  collection,
  category,
  reverse,
  sortKey,
  page = 1,
  limit = 18
}: {
  collection?: string;
  category?: string;
  reverse?: boolean;
  sortKey?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Product[]; total: number }> {
  const fastschema = await useFastSchema();
  const filter: Record<string, any> = {};
  if (collection) {
    filter['collections.name'] = collection;
  }
  if (category) {
    filter['categories.slug'] = category;
  }

  let sort = '-id';
  if (sortKey) {
    sort = sortKey.toLowerCase();
  }

  if (reverse) {
    sort = '-' + sort;
  }

  const offset = (page - 1) * limit;

  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    limit,
    offset,
    filter,
    sort,
    count: true
  });

  return {
    items: products.items,
    total: products.total
  };
}

export async function getCategories(): Promise<Category[]> {
  const fastschema = await useFastSchema();
  const filter: Record<string, any> = {};
  const categories = await fastschema.schema('category').get({
    limit: 100,
    filter,
    select: 'id,name,slug,description,image'
  });

  return [
    {
      id: 0,
      slug: '',
      name: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    ...categories.items.map((cat) => {
      return {
        id: cat.id as number,
        slug: cat.slug,
        name: cat.name,
        description: cat.description ?? '',
        seo: {
          title: cat.name,
          description: cat.description ?? ''
        },
        path: '/search/' + cat.slug,
        updatedAt: cat.updated_at ?? new Date().toISOString(),
        image: cat.image ? { url: cat.image.url } : undefined
      };
    })
  ];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  return [
    {
      title: 'All',
      path: '/search'
    },
    {
      title: 'Shirts',
      path: '/search/shirts'
    },
    {
      title: 'Stickers',
      path: '/search/stickers'
    }
  ];
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const fastschema = await useFastSchema();
  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content,categories,for_sale',
    limit: 1,
    filter: {
      slug: handle
    }
  });
  return products?.items?.[0];
}

export async function getProductRecommendations(product: Product): Promise<Product[]> {
  const fastschema = await useFastSchema();
  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    limit: 1,
    filter: {
      'categories.id': {
        $in: product.categories.map((cat) => cat.id)
      }
    } as any
  });
  return products?.items;
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  page = 1,
  limit = 18
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Product[]; total: number }> {
  const fastschema = await useFastSchema();
  const filter: Record<string, any> = {};
  if (query) {
    filter['name'] = {
      $like: `%${query}%`
    };
  }

  let sort = '-id';
  if (sortKey) {
    sort = sortKey.toLowerCase();
  }

  if (reverse) {
    sort = '-' + sort;
  }

  const offset = (page - 1) * limit;

  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    limit,
    offset,
    filter,
    sort,
    count: true
  });

  return {
    items: products.items,
    total: products.total
  };
}

export async function getNewArrivals(limit: number = 4): Promise<Product[]> {
  const fastschema = await useFastSchema();
  
  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    limit,
    filter: {
      for_sale: true
    },
    sort: '-id' // should be created_at instead, but it's not sortable for now
  });

  return products.items;
}

export async function getPromotedProducts(limit: number = 5): Promise<Product[]> {
  const fastschema = await useFastSchema();
  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content,promoted,sales_count,size,color',
    limit,
    filter: {
      promoted: true
    }
  });

  return products.items;
}

export async function getBestSellers(limit: number = 8): Promise<Product[]> {
  const fastschema = await useFastSchema();
  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content,promoted,sales_count,size,color',
    limit,
    sort: '-sales_count'
  });

  return products.items;
}

export async function getFilteredProducts({
  priceRange,
  sizes,
  colors,
  sort = '-id',
  page = 1,
  limit = 18
}: {
  priceRange?: { min?: number; max?: number };
  sizes?: string[];
  colors?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Product[]; total: number }> {
  const fastschema = await useFastSchema();
  const filter: Record<string, any> = {};
  const conditions = [];

  // Add price range filter
  if (priceRange) {
    const priceConditions = [];
    if (priceRange.min !== undefined) {
      priceConditions.push({ price: { $gte: priceRange.min } });
    }
    if (priceRange.max !== undefined) {
      priceConditions.push({ price: { $lte: priceRange.max } });
    }
    if (priceConditions.length > 0) {
      conditions.push({ $and: priceConditions });
    }
  }

  // Add size filter
  if (sizes && sizes.length > 0) {
    conditions.push({ size: { $in: sizes } });
  }

  // Add color filter
  if (colors && colors.length > 0) {
    conditions.push({ color: { $in: colors } });
  }

  // Combine all conditions
  if (conditions.length > 0) {
    if (conditions.length === 1) {
      Object.assign(filter, conditions[0]);
    } else {
      filter.$and = conditions;
    }
  }

  const offset = (page - 1) * limit;

  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content,promoted,sales_count,size,color',
    limit,
    offset,
    filter,
    sort,
    count: true
  });

  return {
    items: products.items,
    total: products.total
  };
}
