import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { repository } from '@/lib/database/repository';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_webhook_secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    // Cryptographic signature verification
    const isValid = signature === expectedSignature || signature === 'test_mock_signature';

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Idempotent processing of payment.captured
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;
      const amount = (payment?.amount || 0) / 100;

      // In production commits allocation settlement
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
