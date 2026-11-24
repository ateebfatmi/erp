'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Receipt,
  Download,
  ShieldCheck,
  FileText,
  Award,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ParentTaxCertificateManager } from './parent-tax-certificate';

interface ParentFeesClientProps {
  child: any;
  feeAllocations: any[];
  childTransactions: any[];
  totalDue: number;
  unpaidAllocations: any[];
  onPayAction: (allocationIds: string[], amount: number) => Promise<void>;
}

export function ParentFeesClient({
  child,
  feeAllocations,
  childTransactions,
  totalDue,
  unpaidAllocations,
  onPayAction,
}: ParentFeesClientProps) {
  const [activeTab, setActiveTab] = useState<'payments' | 'tax-80c'>('payments');
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    try {
      await onPayAction(
        unpaidAllocations.map((a) => a.id),
        totalDue
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Student Fee Payments & Statutory Tax Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Student: <span className="font-bold text-slate-800">{child?.student?.full_name || 'Aarav Mehta'}</span> (
            {child?.student?.admission_number || 'ADM-2024-001'} &bull; Class 10A)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Secured by Razorpay PCI-DSS</Badge>
          <Badge variant="outline" className="text-slate-600 border-slate-300">
            CBSE Statutory Compliant
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'payments'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Fee Allocations, Dues & Receipts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tax-80c')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'tax-80c'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="h-4 w-4" />
          Section 80C Tuition Fee Certificate
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            ITR Ready
          </span>
        </button>
      </div>

      {activeTab === 'payments' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Outstanding Dues & Direct Checkout (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-sm font-semibold">
                  Quarterly Fee Allocations & Dues
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Paid</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeAllocations.map((alloc) => (
                        <tr key={alloc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {alloc.title}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {formatDate(alloc.due_date)}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {formatCurrency(alloc.due_amount)}
                          </td>
                          <td className="py-3 px-3 font-medium text-emerald-600">
                            {formatCurrency(alloc.paid_amount)}
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant={alloc.status === 'paid' ? 'success' : 'destructive'}>
                              {alloc.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Paid Receipts History */}
            <Card>
              <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-blue-600" />
                  Payment Receipts History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100 text-xs">
                  {childTransactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div>
                        <span className="font-mono font-bold text-blue-600 block">
                          Receipt: {tx.receipt_number}
                        </span>
                        <span className="text-slate-500">
                          Paid on {formatDate(tx.recorded_at)} via {tx.payment_method.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(tx.total_amount)}
                        </span>
                        <a href={`/api/documents/fee-receipt/${tx.id}`} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="text-xs gap-1 text-blue-600 cursor-pointer">
                            <Download className="h-3 w-3" /> PDF Receipt
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Immediate Razorpay Pay Box */}
          <div>
            <Card className="border-emerald-200 bg-emerald-50/20">
              <CardHeader className="border-b border-emerald-100">
                <CardTitle className="text-sm font-semibold text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Quick Online Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-3 rounded-lg bg-white border border-emerald-100 text-xs space-y-1">
                  <span className="text-slate-500 block">Total Payable Now</span>
                  <span className="text-2xl font-bold text-slate-900 block">
                    {formatCurrency(totalDue)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Includes Quarter 4 Tuition & Lab Maintenance
                  </span>
                </div>

                {totalDue > 0 ? (
                  <Button
                    type="button"
                    onClick={handlePay}
                    disabled={paying}
                    size="sm"
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold py-2 cursor-pointer"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{paying ? 'Processing...' : 'Pay with Razorpay (UPI / Cards)'}</span>
                  </Button>
                ) : (
                  <div className="p-3 text-center text-xs text-emerald-700 font-medium bg-emerald-100/60 rounded-lg">
                    All term fee dues are fully cleared!
                  </div>
                )}

                <p className="text-[10px] text-slate-400 text-center leading-tight">
                  Official GST / CBSE fee receipt generated instantly upon successful transaction confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <ParentTaxCertificateManager
          studentName={child?.student?.full_name || 'Aarav Mehta'}
          admissionNumber={child?.student?.admission_number || 'ADM-2024-001'}
          gradeClass="Class 10A"
        />
      )}
    </div>
  );
}
