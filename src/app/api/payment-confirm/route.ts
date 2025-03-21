import { getOrder, updateOrderStatus } from '../../lib/fastschema';
import { NextRequest, NextResponse } from 'next/server';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();
  const orderID = body.orderId;
  const confirmationToken = body.confirmationToken;

  if (!orderID || !confirmationToken) {
    return NextResponse.json({
      error: 'Missing orderId or confirmationToken'
    });
  }

  const order = await getOrder(orderID);
  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: parseInt((order.total * 1000).toString()),
      currency: order.currency,
      payment_method: confirmationToken.paymentMethodId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      confirmation_token: confirmationToken.id
    });

    if (intent.status !== 'succeeded') {
      await updateOrderStatus(orderID, 'payment_failed');
      throw new Error('Payment failed');
    }

    await updateOrderStatus(orderID, 'payment_success');
    return NextResponse.json({
      message: 'Payment confirmed'
    });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message
    });
  }
}
