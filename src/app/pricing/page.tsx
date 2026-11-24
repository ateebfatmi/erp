import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <span>VidyaOS</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Button>
        </Link>
      </nav>

      <div className="py-16 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Pricing for Indian Institutions
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Choose the subscription plan that fits your current student capacity. Upgrade seamlessly as your institution expands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-base text-slate-900">Starter Plan</h3>
            <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(49999)}<span className="text-xs font-normal text-slate-500"> / yr</span></div>
            <p className="text-xs text-slate-500">Ideal for preschools and standalone primary schools.</p>
            <ul className="text-xs space-y-2 text-slate-600 pt-2">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 500 Students</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> 1 Physical Campus</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Admissions & Student SIS</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Offline Fee Receipts</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl border-2 border-blue-600 bg-white shadow-sm space-y-4 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold py-0.5 px-3 rounded-full uppercase">
              Recommended
            </span>
            <h3 className="font-bold text-base text-slate-900">Growth Plan</h3>
            <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(149999)}<span className="text-xs font-normal text-slate-500"> / yr</span></div>
            <p className="text-xs text-slate-500">Perfect for K-12 CBSE and ICSE Senior Secondary Schools.</p>
            <ul className="text-xs space-y-2 text-slate-600 pt-2">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 2,500 Students</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 3 Campuses</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Razorpay Online UPI & Card Fees</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> CBSE 9-Point Grading & Report Cards</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> WhatsApp Cloud API Alerts</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Staff HR & Indian EPF/ESI Payroll</li>
            </ul>
            <Link href="/onboarding" className="block pt-2">
              <Button className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                Start 14-Day Free Trial
              </Button>
            </Link>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-base text-slate-900">Enterprise Trust</h3>
            <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(299999)}<span className="text-xs font-normal text-slate-500"> / yr</span></div>
            <p className="text-xs text-slate-500">Designed for multi-city educational conglomerates.</p>
            <ul className="text-xs space-y-2 text-slate-600 pt-2">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 10,000 Students</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Up to 10 Campuses</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Custom Domain White-Labeling</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Bus Fleet GPS Integration</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Dedicated Account Manager & 99.95% SLA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
