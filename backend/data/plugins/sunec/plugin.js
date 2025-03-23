// @ts-nocheck

const {
  emptyCartData,
  deliveryFees,
  randomString,
  keyBy,
  getCartFromDb,
  getCartDetail,
} = require('./utils');

/** @param {FsContext} ctx */
const createCartSql = `INSERT INTO carts (hash, detail) VALUES ($1, '{}') RETURNING *`;
const createCart = async (ctx) => {
  const hash = randomString(32);
  const carts = await $db().Query(ctx, createCartSql, hash);
  return carts.length > 0
    ? { ...emptyCartData, id: carts[0].Get('hash') }
    : null;
};

/** @param {FsContext} ctx */
const getCart = async (ctx) => {
  const cart = await getCartFromDb(ctx);
  const dbCartProductsById = keyBy(cart.detail.lines ?? [], 'id');
  return await getCartDetail(ctx, cart, dbCartProductsById);
};

/** @param {FsContext} ctx */
const updateCartSql = 'UPDATE carts SET detail = $1 WHERE id = $2 RETURNING *';
const addToCart = async (ctx) => {
  const dbCart = await getCartFromDb(ctx);
  const payload = ctx.Payload().ToMap();
  const dbCartProductsById = keyBy(dbCart.detail.lines ?? [], 'id');
  const payloadCartProductsById = keyBy(payload.lines, 'id');

  // increase quantity if product already exists
  for (const item of payload.lines) {
    const dbItem = dbCartProductsById[item.id];
    if (dbCartProductsById[item.id]) {
      dbCartProductsById[item.id].quantity += item.quantity;
    } else {
      dbCartProductsById[item.id] = item;
    }
  }

  const lines = JSON.stringify({ lines: Object.values(dbCartProductsById) });
  await $db().Query(ctx, updateCartSql, lines, dbCart.id);
  return await getCartDetail(ctx, dbCart, dbCartProductsById);
};

/** @param {FsContext} ctx */
const updateCartLine = async (ctx) => {
  const dbCart = await getCartFromDb(ctx);
  const payload = ctx.Payload().ToMap();
  const dbCartProductsById = keyBy(dbCart.detail.lines ?? [], 'id');

  for (const item of payload.lines) {
    if (dbCartProductsById[item.id]) {
      dbCartProductsById[item.id].quantity = item.quantity;
    }
  }

  const lines = JSON.stringify({ lines: Object.values(dbCartProductsById) });
  await $db().Query(ctx, updateCartSql, lines, dbCart.id);
  return await getCartDetail(ctx, dbCart, dbCartProductsById);
};

/** @param {FsContext} ctx */
const removeCartLines = async (ctx) => {
  const dbCart = await getCartFromDb(ctx);
  const payload = ctx.Payload().ToMap();
  const dbCartProductsById = keyBy(dbCart.detail.lines ?? [], 'id');

  for (const lineId of payload.lineIds) {
    delete dbCartProductsById[lineId];
  }

  const lines = JSON.stringify({ lines: Object.values(dbCartProductsById) });
  await $db().Query(ctx, updateCartSql, lines, dbCart.id);
  return await getCartDetail(ctx, dbCart, dbCartProductsById);
};

/** @param {FsContext} ctx */
const createOrder = async (ctx) => {
  const payload = ctx.Payload();
  const cartId = payload.Get('cartId');
  const info = payload.Get('info').ToMap();
  const dbCart = await getCartFromDb(ctx, cartId);
  const dbCartProductsById = keyBy(dbCart.detail.lines ?? [], 'id');
  const dbCartDetail = await getCartDetail(ctx, dbCart, dbCartProductsById);
  const deliveryFee = deliveryFees[info.delivery_method] ?? 0;
  const subtotalAmount = parseFloat(dbCartDetail.cost.subtotalAmount.amount);
  const tax = parseFloat(dbCartDetail.cost.totalTaxAmount.amount);
  const totalAmount = subtotalAmount + tax + deliveryFee;

  const hash = randomString(32);
  const orderData = {
    hash,
    cart_id: dbCart.id,
    status: 'payment_pending',
    name: info.name,
    email: info.email,
    country: info.country,
    city: info.city,
    address: info.address,
    phone: info.phone,
    delivery_method: info.delivery_method,
    currency: 'USD',
    subtotal: subtotalAmount,
    total: totalAmount,
    tax,
    delivery_fee: deliveryFee,
  };

  const order = await $db().Builder('order').Create(ctx, orderData);
  order.Delete('id');
  order.Delete('hash');
  order.Delete('cart_id');

  return {
    id: hash,
    ...(order.ToMap() ?? {}),
  };
};

/** @param {FsContext} ctx */
const getOrder = async (ctx) => {
  const order = await $db()
    .Builder('order')
    .Where({
      hash: ctx.Arg('hash'),
    })
    .Select('cart')
    .First(ctx);
  return order.ToMap();
};

/** @param {FsContext} ctx */
const updateOrderStatus = async (ctx) => {
  const order = await $db()
    .Builder('order')
    .Where({
      hash: ctx.Arg('hash'),
    })
    .Update(ctx, {
      status: ctx.Payload().Get('status'),
    });
  return order;
};

/** @param {FsPlugin} plugin */
const Init = async (plugin) => {
  plugin.resources
    .Find('api')
    .Group('ec')
    .Add(createCart, {
      public: true,
      post: '/cart',
    })
    .Add(getCart, {
      public: true,
      get: '/cart/:hash',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    })
    .Add(addToCart, {
      public: true,
      post: '/cart/:hash',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    })
    .Add(updateCartLine, {
      public: true,
      put: '/cart/:hash',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    })
    .Add(removeCartLines, {
      public: true,
      post: '/cart/:hash/remove',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    })
    .Add(createOrder, {
      public: true,
      post: '/order',
    })
    .Add(getOrder, {
      public: true,
      get: '/order/:hash',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    })
    .Add(updateOrderStatus, {
      public: true,
      put: '/order/:hash/status',
      args: {
        hash: {
          Type: 'string',
          Required: true,
        },
      },
    });
};
