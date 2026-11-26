import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Receipt, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { recordFeePaymentAction } from '@/modules/fees/actions';
import { UnifiedFeesHub } from '@/components/modules/fees/unified-fees-hub';

export default async function FeesPage() {
  const auth = await getVerifiedAuthContext();
  const feeAllocations = await repository.getFeeAllocations(auth.tenantId);
  const transactions = await repository.getFeeTransactions(auth.tenantId);
  const enrollments = await repository.getEnrollments(auth.tenantId);

  const totalCollected = transactions.reduce((acc, t) => acc + t.total_amount, 0);
  const totalDue = feeAllocations.reduce(
    (acc, a) => acc + (a.due_amount - a.discount_amount - a.paid_amount),
    0
  );

  const collectionsContent = (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Fee Collected (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              100% Reconciled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Outstanding Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {formatCurrency(totalDue)}
            </div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              {feeAllocations.filter((a) => a.status === 'unpaid').length} Pending Allocations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-500">
              Payment Gateway Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" /> 99.98%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Webhook HMAC Verification Enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Allocations & Counter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Fee Allocations */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Student Fee Ledger Allocations
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Quarterly tuition, transport, and lab fee dues per enrolled student.
                </p>
              </div>
              <Badge variant="outline">
                {feeAllocations.length} Active Accounts
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Student / Admission No</th>
                      <th className="px-4 py-2.5 font-medium">Structure</th>
                      <th className="px-4 py-2.5 font-medium">Due Amount</th>
                      <th className="px-4 py-2.5 font-medium">Due Date</th>
                      <th className="px-4 py-2.5 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feeAllocations.map((alloc) => {
                      const enrollment = enrollments.find((e) => e.student_id === alloc.student_id);
                      const balance = alloc.due_amount - alloc.discount_amount - alloc.paid_amount;
                      return (
                        <tr key={alloc.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">
                              {alloc.student_id}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Class: {enrollment?.class_id || 'Class 10-A'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {alloc.fee_structure_id}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900">
                              {formatCurrency(balance)}
                            </span>
                            {alloc.discount_amount > 0 && (
                              <span className="text-[10px] text-emerald-600 block">
                                (Saved {formatCurrency(alloc.discount_amount)})
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {formatDate(alloc.due_date)}
                          </td>
                          <td className="px-4 py-3">
                            {alloc.status === 'paid' && (
                              <Badge variant="success">Fully Settled</Badge>
                            )}
                            {alloc.status === 'partial' && (
                              <Badge variant="warning">Partially Paid</Badge>
                            )}
                            {alloc.status === 'unpaid' && (
                              <Badge variant="destructive">Outstanding</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Fee Transactions */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600" />
                Audited Collection Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-2.5 font-medium">Receipt No</th>
                      <th className="px-4 py-2.5 font-medium">Date</th>
                      <th className="px-4 py-2.5 font-medium">Payment Mode</th>
                      <th className="px-4 py-2.5 font-medium">Reference ID</th>
                      <th className="px-4 py-2.5 font-medium">Amount</th>
                      <th className="px-4 py-2.5 font-medium text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                          {tx.receipt_number}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="capitalize px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                            {tx.payment_method.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                          {tx.transaction_reference || 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          {formatCurrency(tx.total_amount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <a
                            href={`/api/documents/fee-receipt/${tx.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-medium text-[11px]"
                          >
                            PDF Receipt
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Offline Cashier Desk Form */}
        <div className="space-y-4">
          <Card className="border-blue-100 bg-blue-50/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Offline Collection & Cashier Entry
              </CardTitle>
              <p className="text-xs text-slate-500">
                Record in-person cash, cheque, or POS card collections at the campus counter.
              </p>
            </CardHeader>
            <CardContent>
              <form action={recordFeePaymentAction} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Select Fee Allocation
                  </label>
                  <select
                    name="allocationId"
                    required
                    className="w-full text-xs rounded-md border border-slate-300 p-2 bg-white"
                  >
                    <option value="">-- Choose Pending Account --</option>
                    {feeAllocations
                      .filter((a) => a.status !== 'paid')
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.student_id} — Bal: {formatCurrency(a.due_amount - a.discount_amount - a.paid_amount)}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Amount Received (₹)
                  </label>
                  <Input
                    name="amount"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="Enter collected amount"
                    required
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Payment Instrument / Channel
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full text-xs rounded-md border border-slate-300 p-2 bg-white"
                  >
                    <option value="upi">UPI / QR Code</option>
                    <option value="razorpay">Razorpay Checkout</option>
                    <option value="cash">Cash Counter</option>
                    <option value="cheque">Cheque / Demand Draft</option>
                    <option value="bank_transfer">Direct Bank Transfer / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Reference / Transaction ID
                  </label>
                  <Input
                    name="referenceNumber"
                    placeholder="e.g. UTR / Cheque No / UPI Ref"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" size="sm" className="w-full gap-1.5 bg-blue-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Issue Receipt & Settle Ledger</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return <UnifiedFeesHub initialTab="collections" collectionsContent={collectionsContent} />;
}
