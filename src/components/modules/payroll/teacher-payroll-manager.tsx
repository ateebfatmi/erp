'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Download,
  Calendar,
  Building2,
  Receipt,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  ExternalLink,
  ShieldCheck,
  Calculator,
  User,
  Info,
} from 'lucide-react';
import {
  calculateSalaryBreakdown,
  amountInWords,
  SalaryBreakdown,
} from '@/modules/payroll/calculator';

interface PayslipHistoryItem {
  id: string;
  month: string;
  year: number;
  basic: number;
  gross: number;
  deductions: number;
  net: number;
  disbursedOn: string;
  transactionRef: string;
}

const HISTORICAL_PAYSLIPS: PayslipHistoryItem[] = [
  {
    id: 'pay-2024-10',
    month: 'October',
    year: 2024,
    basic: 54000,
    gross: 92300,
    deductions: 12267,
    net: 80033,
    disbursedOn: '2024-10-31',
    transactionRef: 'NEFT/HDFC/982348123',
  },
  {
    id: 'pay-2024-09',
    month: 'September',
    year: 2024,
    basic: 54000,
    gross: 92300,
    deductions: 12267,
    net: 80033,
    disbursedOn: '2024-09-30',
    transactionRef: 'NEFT/HDFC/873461823',
  },
  {
    id: 'pay-2024-08',
    month: 'August',
    year: 2024,
    basic: 54000,
    gross: 92300,
    deductions: 12267,
    net: 80033,
    disbursedOn: '2024-08-31',
    transactionRef: 'NEFT/HDFC/761928341',
  },
  {
    id: 'pay-2024-07',
    month: 'July',
    year: 2024,
    basic: 52000,
    gross: 89000,
    deductions: 11843,
    net: 77157,
    disbursedOn: '2024-07-31',
    transactionRef: 'NEFT/HDFC/651092834',
  },
];

export function TeacherPayrollManager() {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'form16'>('current');
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2024');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Investment declaration inputs for Form-16
  const [sec80cTuition, setSec80cTuition] = useState<number>(45000);
  const [sec80cPPF, setSec80cPPF] = useState<number>(50000);
  const [sec80dHealth, setSec80dHealth] = useState<number>(18000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(180000);

  const breakdown = calculateSalaryBreakdown(54000);
  const inWords = amountInWords(breakdown.netSalary);

  // Form 16 Tax computation
  const annualGross = breakdown.grossSalary * 12;
  const standardDeduction = 50000;
  const annualEpf = breakdown.epf * 12;
  const total80c = Math.min(150000, annualEpf + sec80cTuition + sec80cPPF);
  const total80d = Math.min(25000, sec80dHealth);
  const totalTaxDeductions = standardDeduction + total80c + total80d;
  const taxableIncomeOld = Math.max(0, annualGross - totalTaxDeductions);

  const handleSaveTaxDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('Annual Income Tax Declaration (Section 80C/80D) saved and submitted to School Accounts Department.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('current')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'current'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="h-4 w-4" />
          Latest Payslip ({selectedMonth})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Payslip History ({HISTORICAL_PAYSLIPS.length})
        </button>
        <button
          onClick={() => setActiveTab('form16')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'form16'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calculator className="h-4 w-4" />
          IT Form-16 & Tax Declarations
        </button>
      </div>

      {/* TAB 1: CURRENT MONTH PAYSLIP */}
      {activeTab === 'current' && (
        <div className="space-y-6">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Gross Salary</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  ₹{breakdown.grossSalary.toLocaleString('en-IN')}
                </h3>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                  <TrendingUp className="h-3 w-3" />
                  7th CPC Pay Matrix Level 8
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Total Deductions</p>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-mono">
                  ₹{breakdown.totalDeductions.toLocaleString('en-IN')}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">EPF, TDS, PTax</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-emerald-800 font-medium">Net Take-Home Pay</p>
                <h3 className="text-2xl font-bold text-emerald-950 mt-1 font-mono">
                  ₹{breakdown.netSalary.toLocaleString('en-IN')}
                </h3>
                <p className="text-[11px] text-emerald-700 mt-0.5">Disbursed via Direct Bank Transfer</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Official Salary Slip</p>
                <div className="mt-2">
                  <a
                    href="/api/documents/salary-slip/emp-01"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center justify-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PDF Slip
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Printable Stamped Slip Frame */}
          <Card className="border-slate-300 shadow-md bg-white overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  DELHI PUBLIC GLOBAL ACADEMY
                </h3>
                <p className="text-xs text-slate-300">
                  Monthly Faculty Remuneration & Statutory Pay Slip &bull; {selectedMonth}
                </p>
              </div>
              <div className="text-left sm:text-right font-mono text-xs text-slate-300">
                <span>Slip Ref: VOS-SAL-2024-10-048</span>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Employee Name</span>
                  <span className="font-bold text-slate-900">Smt. Ananya Sen</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Designation & Dept</span>
                  <span className="font-bold text-slate-900">PGT Mathematics</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Employee Code</span>
                  <span className="font-bold font-mono text-slate-900">DPGA/EMP/2021/048</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">PAN Number</span>
                  <span className="font-bold font-mono text-slate-900">ABCDE1234F</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">EPFO UAN Number</span>
                  <span className="font-bold font-mono text-slate-900">100982348912</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Bank & Account</span>
                  <span className="font-bold text-slate-900">HDFC Bank (A/C: ****4821)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Total Working Days</span>
                  <span className="font-bold text-slate-900">26 Days</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Attendance Days</span>
                  <span className="font-bold text-emerald-700">26 / 26 Days (100%)</span>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Earnings Component</span>
                    <span>Amount (INR)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-700">Basic Pay</span>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.basic.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-700">House Rent Allowance (HRA 40%)</span>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.hra.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-700">Dearness Allowance (DA 15%)</span>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.da.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-700">Conveyance Allowance</span>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.conveyance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <span className="text-slate-700">Special Teaching Allowance (10%)</span>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.specialAllowance.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 font-bold flex justify-between text-slate-900 border-t border-slate-200">
                      <span>Total Gross Earnings</span>
                      <span className="font-mono">₹{breakdown.grossSalary.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Statutory Deduction</span>
                    <span>Amount (INR)</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="p-3 flex justify-between">
                      <div>
                        <span className="text-slate-700 block">Employees' Provident Fund (EPF)</span>
                        <span className="text-[10px] text-slate-400">12% on (Basic + DA) per EPFO</span>
                      </div>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.epf.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <div>
                        <span className="text-slate-700 block">ESIC Employee Contribution</span>
                        <span className="text-[10px] text-slate-400">Exempt (Gross &gt; ₹21,000)</span>
                      </div>
                      <span className="font-mono font-medium text-slate-900">₹0</span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <div>
                        <span className="text-slate-700 block">Professional Tax (PT)</span>
                        <span className="text-[10px] text-slate-400">State Statutory Standard</span>
                      </div>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.professionalTax.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between">
                      <div>
                        <span className="text-slate-700 block">Income Tax Withholding (TDS)</span>
                        <span className="text-[10px] text-slate-400">Section 192 Monthly Tranche</span>
                      </div>
                      <span className="font-mono font-medium text-slate-900">
                        ₹{breakdown.tds.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 font-bold flex justify-between text-slate-900 border-t border-slate-200">
                      <span>Total Statutory Deductions</span>
                      <span className="font-mono">₹{breakdown.totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Disbursed Highlight */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold block">
                    Net Take-Home Remuneration Disbursed
                  </span>
                  <span className="text-xs text-emerald-700 italic font-serif">
                    Amount in Words: {inWords}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-950">
                    ₹{breakdown.netSalary.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PAYSLIP HISTORY */}
      {activeTab === 'history' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Annual Payslip Archive & Disbursal Register
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Access previous salary statements, NEFT bank transaction reference hashes, and download certified salary certificates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Pay Period</th>
                    <th className="py-3 px-4">Basic Pay</th>
                    <th className="py-3 px-4">Gross Earnings</th>
                    <th className="py-3 px-4">Total Deductions</th>
                    <th className="py-3 px-4">Net Disbursed</th>
                    <th className="py-3 px-4">Disbursed Date & Ref</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white font-mono">
                  {HISTORICAL_PAYSLIPS.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        {p.month} {p.year}
                      </td>
                      <td className="py-3 px-4">₹{p.basic.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">₹{p.gross.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 text-rose-600">₹{p.deductions.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">
                        ₹{p.net.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600">
                        <div>{p.disbursedOn}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.transactionRef}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <a
                          href={`/api/documents/salary-slip/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="h-7 text-xs border-slate-300">
                            <Download className="h-3 w-3 mr-1 text-slate-500" />
                            PDF Slip
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: FORM-16 & TAX DECLARATIONS */}
      {activeTab === 'form16' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  Annual Income Tax Investment Declaration (FY 2024-25)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Declare your statutory investments under Section 80C, 80D, and HRA rent receipts to optimize monthly TDS deductions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveTaxDeclaration} className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      EPF Auto-Calculated Contribution
                    </span>
                    <p className="text-[11px] text-blue-800">
                      Your annual EPF contribution of <strong>₹{(breakdown.epf * 12).toLocaleString('en-IN')}</strong> is automatically included under Section 80C.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Section 80C: Children School Tuition Fees Paid (INR)
                    </label>
                    <Input
                      type="number"
                      value={sec80cTuition}
                      onChange={(e) => setSec80cTuition(Number(e.target.value))}
                      className="text-xs"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Max deductible across Section 80C is ₹1,50,000 annually.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Section 80C: Public Provident Fund (PPF) / ELSS Mutual Funds (INR)
                    </label>
                    <Input
                      type="number"
                      value={sec80cPPF}
                      onChange={(e) => setSec80cPPF(Number(e.target.value))}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Section 80D: Health Insurance Mediclaim Premium (INR)
                    </label>
                    <Input
                      type="number"
                      value={sec80dHealth}
                      onChange={(e) => setSec80dHealth(Number(e.target.value))}
                      className="text-xs"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Max deductible up to ₹25,000 for self/family, ₹50,000 for senior citizen parents.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual House Rent Paid for HRA Exemption (INR)
                    </label>
                    <Input
                      type="number"
                      value={rentPaidAnnual}
                      onChange={(e) => setRentPaidAnnual(Number(e.target.value))}
                      className="text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs"
                  >
                    Save & Submit Investment Declaration
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-200 shadow-xs bg-slate-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-blue-600" />
                  Tax Regime Comparison Preview
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Estimated annual taxable income based on current salary and declarations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Gross Annualized CTC:</span>
                    <strong className="font-mono text-slate-900">
                      ₹{annualGross.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Standard Deduction:</span>
                    <strong className="font-mono text-slate-900">₹50,000</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Section 80C Total:</span>
                    <strong className="font-mono text-slate-900">
                      ₹{total80c.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Section 80D Mediclaim:</span>
                    <strong className="font-mono text-slate-900">
                      ₹{total80d.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                    <span>Taxable Income (Old Regime):</span>
                    <span className="font-mono text-blue-700">
                      ₹{taxableIncomeOld.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block">
                    Form 16 Part A & B Generation
                  </span>
                  <p className="text-[11px] text-emerald-800">
                    Part A (TRACES TDS Certificate) and Part B (Salary Annexure) will be signed by the Principal and made available for direct download at the end of Q4.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
