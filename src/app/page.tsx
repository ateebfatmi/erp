import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Building2,
  Sparkles,
  PhoneCall,
  Laptop,
  Check,
} from 'lucide-react';

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <nav className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Vidya<span className="text-blue-600">OS</span>
          </span>
          <Badge variant="outline" className="hidden sm:inline-flex text-[10px] ml-1 bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            Enterprise School ERP
          </Badge>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link href="/features" className="hover:text-blue-600 transition-colors">
            Modules & Features
          </Link>
          <Link href="/pricing" className="hover:text-blue-600 transition-colors">
            Pricing Plans
          </Link>
          <Link href="/demo" className="hover:text-blue-600 transition-colors">
            Book Live Demo
          </Link>
          <Link href="/docs/PRD.md" className="hover:text-blue-600 transition-colors">
            Architecture Docs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/portal/admin">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              Live Portals
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="text-xs font-semibold bg-blue-600 hover:bg-blue-700">
              Get Started <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />
          <span>India’s Leading Multi-Tenant School Operating System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          The Centralized Digital Operating System for <span className="text-blue-600">Modern Educational Institutions.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Unify multi-campus K-12 school operations, CBSE/ICSE academics, automated Razorpay fee collection, biometric HRIS, and parent communication into one secure SaaS platform.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/portal/admin">
            <Button size="lg" className="w-full sm:w-auto text-sm font-semibold px-8 bg-blue-600 hover:bg-blue-700 h-11 gap-2 shadow-xs">
              <Laptop className="h-4 w-4" />
              <span>Launch School Admin Portal</span>
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm font-semibold px-8 h-11 gap-2 bg-white">
              <PhoneCall className="h-4 w-4 text-slate-600" />
              <span>Schedule Institutional Walkthrough</span>
            </Button>
          </Link>
        </div>

        {/* Security & Compliance Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            India DPDP Act 2023 Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            PostgreSQL Row Level Security (RLS)
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-indigo-600" />
            Razorpay PCI-DSS Level 1 Verified
          </span>
        </div>
      </section>

      {/* Stakeholder Experiences Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold text-blue-700 bg-blue-50">
            5 Tailored Portals
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            One Core Database. Five Tailored Experiences.
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From the Principal’s office to teachers in classrooms and parents at home, every stakeholder enjoys a dedicated, role-authorized interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">1. School Administrator Portal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete operational cockpit: SIS, admissions, double-entry fee reconciliation, teacher allocation, payroll, and statutory reports.
              </p>
              <Link href="/portal/admin" className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-1">
                Explore Admin Desk <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">2. Teacher Faculty Portal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Daily period-by-period attendance marking, CBSE term marks entry, lesson planning, and digital homework management.
              </p>
              <Link href="/portal/teacher" className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
                Explore Teacher View <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all">
            <CardContent className="p-6 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">3. Parent Guardian Portal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Multi-child switcher, instant Razorpay/UPI fee payment, live bus alerts, attendance tracking, and term report cards.
              </p>
              <Link href="/portal/parent" className="text-xs font-semibold text-amber-600 flex items-center gap-1 pt-1">
                Explore Parent View <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SaaS Pricing Preview */}
      <section className="py-16 px-6 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Predictable, Transparent SaaS Subscriptions
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              No hidden per-SMS or per-transaction fees. Simple annual billing scaled to your institution’s student capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="font-bold text-base text-slate-900">Starter Tier</div>
              <div className="text-3xl font-extrabold text-slate-900">₹49,999<span className="text-xs font-normal text-slate-500"> / year</span></div>
              <p className="text-xs text-slate-500">Up to 500 students &bull; 1 Campus</p>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Student Information System</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Attendance Register</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Offline Fee Counter</li>
              </ul>
            </div>

            {/* Growth */}
            <div className="p-6 rounded-xl border-2 border-blue-600 bg-white shadow-sm space-y-4 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold py-0.5 px-3 rounded-full uppercase">
                Most Popular
              </span>
              <div className="font-bold text-base text-slate-900">Growth Tier</div>
              <div className="text-3xl font-extrabold text-slate-900">₹1,49,999<span className="text-xs font-normal text-slate-500"> / year</span></div>
              <p className="text-xs text-slate-500">Up to 2,500 students &bull; 3 Campuses</p>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> All Starter Features</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Razorpay UPI / Card Gateway</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> CBSE / ICSE Report Cards</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> WhatsApp Cloud API Alerts</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Staff HR & Indian Payroll</li>
              </ul>
              <Link href="/onboarding" className="block pt-2">
                <Button className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700">
                  Provision School Now
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="font-bold text-base text-slate-900">Enterprise Trust</div>
              <div className="text-3xl font-extrabold text-slate-900">₹2,99,999<span className="text-xs font-normal text-slate-500"> / year</span></div>
              <p className="text-xs text-slate-500">Up to 10,000 students &bull; 10 Campuses</p>
              <ul className="text-xs space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Multi-Campus Trust Console</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> White-Label Custom Domains</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Bus Fleet GPS Integration</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Dedicated 24/7 Account Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-slate-100 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <GraduationCap className="h-4 w-4 text-blue-600" /> VidyaOS Enterprise Platform
          </div>
          <div>
            Built with Next.js 16, Supabase PostgreSQL & Clerk Authentication.
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <Link href="/docs/PRIVACY.md" className="hover:underline">DPDP Privacy Policy</Link>
            <Link href="/docs/SECURITY.md" className="hover:underline">Security Architecture</Link>
            <Link href="/demo" className="hover:underline">Contact Sales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
