export const instant = false;

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  Building2,
  PackageCheck,
  TrendingUp,
  Users2,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Boxes,
  CreditCard,
  Truck,
  CheckCircle2,
  Bell,
  Search,
  Activity,
  Layers,
} from "lucide-react";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                Enterprise<span className="text-indigo-400">ERP</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Clerk Session Active</span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-200">
                    {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}` : "Organization Admin"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user?.emailAddresses?.[0]?.emailAddress ?? "admin@enterprise.internal"}
                  </p>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-indigo-500/30",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1">
        {/* SIGNED IN VIEW - ERP DASHBOARD */}
        <SignedIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Welcome back, {user?.firstName ?? "Admin"} 👋
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Here is the operational overview of your enterprise systems today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search invoices, SKUs, staff..."
                    className="pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64"
                  />
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Revenue (Q4)
                  </span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">$1,284,950</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +14.2%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">vs. previous period</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Active Inventory
                  </span>
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Boxes className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">48,210 units</span>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    98.4% in-stock
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">across 6 regional hubs</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Workforce & HR
                  </span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Users2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">342 active</span>
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    12 onboarding
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Payroll automated via Clerk ID</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Pending Purchase Orders
                  </span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">18 Orders</span>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Requires Review
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Est. fulfillment 24-48h</p>
              </div>
            </div>

            {/* ERP Modules Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Core Enterprise Modules</h2>
                  <p className="text-xs text-slate-400">Select an operational module to manage workflows</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Module 1 */}
                <div className="group p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-indigo-500/5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Inventory & Warehouse</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Multi-location stock tracking, barcode audits, automated reorder thresholds, and bin allocations.
                  </p>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-indigo-400 font-medium">
                    <span>Manage SKUs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 2 */}
                <div className="group p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-indigo-500/5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Financials & Invoicing</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    General ledger, accounts receivable/payable, automated GST/tax calculation, and audit trails.
                  </p>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-emerald-400 font-medium">
                    <span>View Ledgers</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Module 3 */}
                <div className="group p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-sm hover:shadow-indigo-500/5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4">Human Capital & Staff</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Employee directory, time & attendance, role-based access permissions, and payroll dispatch.
                  </p>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-blue-400 font-medium">
                    <span>Manage Workforce</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">System Audit Log</h3>
                  <span className="text-xs text-slate-500">Live Clerk Sync</span>
                </div>
                <div className="divide-y divide-slate-800/80 text-sm">
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div>
                        <p className="font-medium text-slate-200">User session authenticated</p>
                        <p className="text-xs text-slate-500">User ID: {user?.id ?? "usr_active"}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Just now</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <div>
                        <p className="font-medium text-slate-200">Clerk Production & Development linked</p>
                        <p className="text-xs text-slate-500">App ID: app_3MYWgwxqeOHjcX5Uxm9BCdOzJ5L</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Today</span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium text-slate-200">Repository connected to GitHub remote</p>
                        <p className="text-xs text-slate-500">ateebfatmi/erp</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">Today</span>
                  </div>
                </div>
              </div>

              {/* Status panel */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <h3 className="text-base font-semibold text-white">Security & Auth Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Auth Engine</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Clerk v7
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Framework</span>
                    <span className="text-slate-200 font-medium">Next.js 16 (App Router)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Remote Repository</span>
                    <span className="text-indigo-400 font-medium truncate max-w-[140px]">
                      ateebfatmi/erp
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SignedIn>

        {/* SIGNED OUT VIEW - ENTERPRISE LANDING PAGE */}
        <SignedOut>
          <div className="relative overflow-hidden">
            {/* Background glowing gradients */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Resource Planning & Auth Ready</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
                Modern Operations, Supply Chain & Financials in One Platform
              </h1>

              <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
                Streamline operations across inventory, multi-entity finances, procurement, and staff management with unified enterprise security powered by Clerk.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <SignUpButton mode="modal">
                  <button className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <span>Deploy Organization</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                    Sign in to Existing Workspace
                  </button>
                </SignInButton>
              </div>

              {/* Feature pillars */}
              <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left w-full max-w-5xl">
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Intelligent Inventory</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Automated replenishment alerts, multi-warehouse balance sync, and purchase order lifecycle management.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Consolidated Ledgers</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Real-time GAAP-compliant accounting, automated journal entries, and automated financial statements.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Enterprise Clerk Auth</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Multi-factor authentication, SSO, and strict role-based access controls for corporate governance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ERP Core. Connected to GitHub & Clerk.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Documentation</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
            <span className="hover:text-slate-400 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
