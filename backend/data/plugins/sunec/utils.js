// @ts-nocheck

const emptyCartData = {
  lines: [],
  totalQuantity: 0,
  checkoutUrl: 'https://example.com/checkout',
  cost: {
    subtotalAmount: { amount: '0', currencyCode: 'USD' },
    totalAmount: { amount: '0', currencyCode: 'USD' },
    totalTaxAmount: { amount: '0', currencyCode: 'USD' },
  },
};

const deliveryFees = {
  dhl_fast: 15,
  fedex: 0,
  express: 49,
};

const randomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
};

const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
};

const keyBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

/** @param {FsContext} ctx */
const getCartFromDb = async (ctx, cartId = '') => {
  if (cartId === '') {
    cartId = ctx.Arg('hash');
  }
  const carts = await $db().Query(
    ctx,
    'SELECT * FROM carts WHERE hash = $1',
    cartId
  );

  if (carts.length === 0) {
    throw new Error('Cart not found');
  }

  const cart = carts[0].ToMap();
  return {
    ...cart,
    detail: JSON.parse(cart.detail || '{}'),
  };
};

/** @param {FsContext} ctx */
/** @param {Record<number, Object>} dbCartProductsById */
const getCartDetail = async (ctx, dbCart, dbCartProductsById) => {
  let subtotalAmount = 0;
  let totalQuantity = 0;
  const products = (
    await $db()
      .Builder('product')
      .Where({
        id: {
          $in: Object.keys(dbCartProductsById),
        },
      })
      .Select('featured_image')
      .Get(ctx)
  ).map((product) => product.ToMap());
  const productsById = keyBy(products, 'id');

  for (const id in dbCartProductsById) {
    if (productsById[id]) {
      const amount =
        parseFloat(productsById[id].price) * dbCartProductsById[id].quantity;
      subtotalAmount += amount;
      totalQuantity += dbCartProductsById[id].quantity;
      dbCartProductsById[id].cost = {
        totalAmount: {
          amount: amount.toFixed(2),
          currencyCode: 'USD',
        },
      };

      dbCartProductsById[id].merchandise = {
        id: productsById[id].id,
        title: productsById[id].name,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Black' },
        ],
        product: {
          id: productsById[id].id,
          handle: productsById[id].slug,
          title: productsById[id].name,
          featuredImage: {
            url: productsById[id].featured_image.url,
            name: productsById[id].name,
            width: 500,
            height: 500,
          },
        },
      };
    }
  }

  const tax = subtotalAmount * 0.1;

  return {
    id: dbCart.hash,
    checkoutUrl: '/checkout',
    totalQuantity,
    cost: {
      subtotalAmount: {
        amount: subtotalAmount.toFixed(2),
        currencyCode: 'USD',
      },
      totalAmount: {
        amount: (subtotalAmount + tax).toFixed(2),
        currencyCode: 'USD',
      },
      totalTaxAmount: {
        amount: tax.toFixed(2),
        currencyCode: 'USD',
      },
    },
    lines: Object.values(dbCartProductsById),
  };
};

module.exports = {
  emptyCartData,
  deliveryFees,
  randomString,
  groupBy,
  keyBy,
  getCartFromDb,
  getCartDetail,
};
