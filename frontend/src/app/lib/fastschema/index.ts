import { FastSchema } from 'fastschema';
export * from 'fastschema';
import { Cart, Collection, Menu, Order, Product } from './types';
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

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const fastschema = await useFastSchema();
  const category = await fastschema.schema('category').get({
    filter: {
      slug: handle
    }
  });

  return category?.items?.[0] ?? undefined;
}

export async function getCollectionProducts({
  collection,
  category,
  reverse,
  sortKey
}: {
  collection?: string;
  category?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
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

  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    filter,
    sort
  }) as { items: Product[] };
  return products.items;
}

export async function getCollections(): Promise<Collection[]> {
  const fastschema = await useFastSchema();
  const filter: Record<string, any> = {};
  const categories = await fastschema.schema('category').get({
    limit: 100,
    filter
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
        updatedAt: cat.updated_at ?? new Date().toISOString()
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
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
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

  const products = await fastschema.schema('product').get({
    select: 'id,name,slug,featured_image,images,price,description,content',
    limit: 18,
    filter,
    sort
  });

  return products.items;
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
