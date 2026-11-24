import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { recordFeePaymentAction } from '@/modules/fees/actions';
import { ParentFeesClient } from '@/components/modules/fees/parent-fees-client';

export default async function ParentFeesPage() {
  const auth = await getVerifiedAuthContext();
  const enrollments = await repository.getEnrollments(auth.tenantId);
  const child = enrollments[0]; // Aarav Mehta
  const feeAllocations = child ? await repository.getFeeAllocations(auth.tenantId, child.id) : [];
  const transactions = await repository.getFeeTransactions(auth.tenantId);
  const childTransactions = transactions.filter((t) => t.enrollment_id === child?.id);

  const unpaidAllocations = feeAllocations.filter((a) => a.status === 'unpaid');
  const totalDue = unpaidAllocations.reduce(
    (acc, a) => acc + (a.due_amount - a.discount_amount - a.paid_amount),
    0
  );

  async function handlePay(allocationIds: string[], amount: number) {
    'use server';
    if (!child) return;
    await recordFeePaymentAction({
      enrollmentId: child.id,
      allocationIds,
      amount,
      paymentMethod: 'razorpay',
      razorpayPaymentId: `pay_rzp_${Date.now()}`,
      referenceNumber: `RZP-ONLINE-${Date.now()}`,
    });
  }

  return (
    <ParentFeesClient
      child={child}
      feeAllocations={feeAllocations}
      childTransactions={childTransactions}
      totalDue={totalDue}
      unpaidAllocations={unpaidAllocations}
      onPayAction={handlePay}
    />
  );
}
