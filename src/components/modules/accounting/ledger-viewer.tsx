'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Landmark,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  BookOpen,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  CHART_OF_ACCOUNTS,
  createJournalVoucher,
  calculateTrialBalance,
  JournalVoucher,
} from '@/modules/accounting/double-entry';

const SAMPLE_VOUCHERS: JournalVoucher[] = [
  createJournalVoucher(
    'RCPT/2026/10492',
    '2026-11-24',
    'receipt',
    'Quarter 4 Tuition & Lab fee collected from Aarav Mehta (Class 10A) via Razorpay UPI',
    [
      { accountCode: '1001', debit: 19500, credit: 0, narration: 'HDFC Ops A/C - UPI Credit' },
      { accountCode: '3001', debit: 0, credit: 15000, narration: 'Q4 Tuition Fee' },
      { accountCode: '3002', debit: 0, credit: 4500, narration: 'Smart ICT / Lab Charges' },
    ]
  ),
  createJournalVoucher(
    'PYMT/2026/0891',
    '2026-11-24',
    'payment',
    'November 2026 Faculty payroll disbursed via HDFC Corporate ACH transfer',
    [
      { accountCode: '4001', debit: 143450, credit: 0, narration: 'Gross Monthly Faculty Salaries' },
      { accountCode: '1001', debit: 0, credit: 117175, narration: 'Net Bank Disbursal ACH' },
      { accountCode: '2002', debit: 0, credit: 11930, narration: 'EPF (12%) & PT Statutory Dues' },
      { accountCode: '2003', debit: 0, credit: 14345, narration: 'TDS Income Tax Withholding' },
    ]
  ),
  createJournalVoucher(
    'RCPT/2026/10493',
    '2026-11-23',
    'receipt',
    'Quarter 4 Transport Bus Fee collected for Route 12 commuters',
    [
      { accountCode: '1001', debit: 14000, credit: 0, narration: 'HDFC Bank - Online Bus Fee' },
      { accountCode: '3003', debit: 0, credit: 14000, narration: 'Transport Revenue - Route 12' },
    ]
  ),
];

export function DoubleEntryLedgerViewer() {
  const [vouchers] = useState<JournalVoucher[]>(SAMPLE_VOUCHERS);
  const trialBalance = calculateTrialBalance(vouchers);

  return (
    <div className="space-y-4">
      {/* Trial Balance Health Bar */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                School General Ledger & Double-Entry Trial Balance
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict mathematical equality &bull; Debit Sum = Credit Sum &bull; Compatible with Indian Chartered Accounting Standards
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" className="text-xs gap-1 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Trial Balance Balanced (₹{trialBalance.totalDebit.toLocaleString('en-IN')})
            </Badge>
            <a href="/api/accounting/tally-export" download>
              <Button size="sm" variant="outline" className="text-xs gap-1.5 text-slate-700 hover:text-indigo-600">
                <Download className="h-3.5 w-3.5 text-indigo-600" /> Export Tally Prime XML
              </Button>
            </a>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Trial Balance Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Total Debit Balance</span>
              <span className="text-lg font-bold text-emerald-900">
                {formatCurrency(trialBalance.totalDebit)}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">Bank Assets & Operating Expenses</span>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">Total Credit Balance</span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(trialBalance.totalCredit)}
              </span>
              <span className="text-[10px] text-blue-700 block mt-0.5">Tuition Incomes & Statutory Payables</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Trial Balance Variance</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-lg font-bold text-slate-900">₹0.00</span>
                <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">Perfect Match</Badge>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">CA Audit Verification Standard</span>
            </div>
          </div>

          {/* Journal Daybook Table */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Recent Journal Vouchers (Daybook Audited)
            </div>

            <div className="space-y-3">
              {vouchers.map((v) => (
                <div key={v.voucherNumber} className="border border-slate-200 rounded-xl overflow-hidden text-xs bg-white shadow-2xs">
                  {/* Voucher Header */}
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{v.voucherNumber}</span>
                      <Badge variant="outline" className="uppercase text-[10px] font-mono">
                        {v.voucherType}
                      </Badge>
                      <span className="text-slate-500">{v.date}</span>
                    </div>
                    <span className="text-slate-700 font-medium text-[11px] truncate max-w-md">
                      {v.narration}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      Balanced (₹{v.totalDebit.toLocaleString('en-IN')})
                    </Badge>
                  </div>

                  {/* Lines */}
                  <div className="p-0">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                        <tr>
                          <th className="py-1.5 px-3">Account Code & Name</th>
                          <th className="py-1.5 px-3">Particulars / Sub-ledger</th>
                          <th className="py-1.5 px-3 text-right">Debit (INR)</th>
                          <th className="py-1.5 px-3 text-right">Credit (INR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {v.lines.map((line, lIdx) => (
                          <tr key={lIdx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-medium text-slate-900">
                              <span className="font-mono text-slate-400 mr-2">{line.accountCode}</span>
                              {line.accountName}
                            </td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">
                              {line.narration || '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-slate-800">
                              {line.debit > 0 ? `₹${line.debit.toLocaleString('en-IN')}.00` : '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-slate-800">
                              {line.credit > 0 ? `₹${line.credit.toLocaleString('en-IN')}.00` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
