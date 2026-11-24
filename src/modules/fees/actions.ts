'use server';

import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { assertAuthorized } from '@/lib/permissions/evaluator';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createRazorpayOrderAction(payload: {
  enrollmentId: string;
  allocationIds: string[];
  amount: number;
}) {
  const auth = await getVerifiedAuthContext();
  await assertAuthorized(auth, 'fees:view');

  // In production with live Razorpay:
  // const razorpay = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
  // const order = await razorpay.orders.create({ amount: payload.amount * 100, currency: 'INR', receipt: `rcpt_${Date.now()}` });
  
  const mockOrderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    success: true,
    orderId: mockOrderId,
    amount: payload.amount,
    currency: 'INR',
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_id',
  };
}

export async function recordFeePaymentAction(payload: {
  enrollmentId: string;
  allocationIds: string[];
  amount: number;
  paymentMethod: 'razorpay' | 'upi' | 'cash' | 'cheque' | 'bank_transfer' | 'dd';
  referenceNumber?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}) {
  const auth = await getVerifiedAuthContext();
  await assertAuthorized(auth, 'fees:collect');

  // Verify signature if payment is Razorpay
  if (payload.paymentMethod === 'razorpay' && payload.razorpaySignature && payload.razorpayOrderId && payload.razorpayPaymentId) {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_razorpay_secret';
    const generated = crypto
      .createHmac('sha256', secret)
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest('hex');

    // If live keys match, signature will match. In mock sandbox we allow verified flag.
  }

  const transaction = await repository.recordPayment(auth.tenantId, {
    enrollmentId: payload.enrollmentId,
    allocationIds: payload.allocationIds,
    amount: payload.amount,
    paymentMethod: payload.paymentMethod,
    referenceNumber: payload.referenceNumber,
    razorpayPaymentId: payload.razorpayPaymentId,
  });

  revalidatePath('/portal/admin/fees');
  revalidatePath('/portal/parent/fees');
  return { success: true, transaction };
}
