import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const SAAS_PLANS = [
  {
    name: 'Starter Plan',
    slug: 'starter',
    price: 49999,
    maxStudents: 500,
    maxCampuses: 1,
    features: ['Student Information System', 'Daily Attendance Tracking', 'Fee Management', 'Offline Receipts'],
  },
  {
    name: 'Growth Plan (Most Popular)',
    slug: 'growth',
    price: 149999,
    maxStudents: 2500,
    maxCampuses: 3,
    popular: true,
    features: ['Everything in Starter', 'Razorpay UPI & Card Checkouts', 'CBSE / ICSE Examination Engine', 'Staff HR & Indian Payroll', 'WhatsApp Cloud API Notices'],
  },
  {
    name: 'Enterprise Trust Tier',
    slug: 'enterprise',
    price: 299999,
    maxStudents: 10000,
    maxCampuses: 10,
    features: ['Multi-Campus Centralised Hub', 'White-Label Branding & Custom Domain', 'Bus Fleet GPS Integration', 'Dedicated Account Manager & SLA'],
  },
];

export default function PlatformPlansPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            SaaS Subscription Tiers & Quota Policies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage global product entitlements, pricing tiers, campus capacities, and billing cycles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAAS_PLANS.map((plan) => (
          <Card key={plan.slug} className={plan.popular ? 'border-blue-600 shadow-sm relative' : ''}>
            {plan.popular ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold py-0.5 px-3 rounded-full uppercase tracking-wider">
                Flagship Plan
              </div>
            ) : null}
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(plan.price)}</span>
                <span className="text-xs text-slate-500"> / year</span>
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Up to {plan.maxStudents.toLocaleString()} students across {plan.maxCampuses} campus(es)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-xs text-slate-600">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant={plan.popular ? 'default' : 'outline'} className="w-full text-xs">
                Configure Entitlements
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
