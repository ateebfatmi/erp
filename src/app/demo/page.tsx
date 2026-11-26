'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  CreditCard,
  Bus,
  Award,
  FileText,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw,
  Send,
  Layers,
  Check,
  Play,
  Activity,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface ScenarioPreset {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  metrics: { label: string; value: string }[];
  targetUrl: string;
  targetName: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'k12-standard',
    title: 'Standard CBSE K-12 Academy (AY 2025-26)',
    badge: 'Flagship Preset',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description:
      'Complete operational setup: 500 enrolled students, 42 faculty, full 8-period timetable, 220-day CBSE calendar, and automated fee collections.',
    metrics: [
      { label: 'Active Students', value: '500' },
      { label: 'Faculty & Staff', value: '42' },
      { label: 'Fee Collection', value: '96.4%' },
      { label: 'Instruction Days', value: '224 Days' },
    ],
    targetUrl: '/portal/admin',
    targetName: 'Explore Executive Dashboard',
  },
  {
    id: 'exams-board',
    title: 'Board Examinations & CBSE Pariksha Sangam',
    badge: 'Curriculum & LOC',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description:
      'Classes 9–12 LOC data, Pariksha Sangam blueprints, question bank with 180+ CBSE questions, Hall Tickets with QR codes, and 360° HPC report cards.',
    metrics: [
      { label: 'LOC Candidates', value: '160 Students' },
      { label: 'Subject Questions', value: '184 Items' },
      { label: 'HPC Readiness', value: '100% NEP' },
      { label: 'Admit Cards', value: 'Generated' },
    ],
    targetUrl: '/portal/admin/exams',
    targetName: 'Open Examination Desk',
  },
  {
    id: 'fleet-ops',
    title: 'Smart Fleet Telematics & Campus Operations',
    badge: 'Live GPS & Gates',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description:
      '18 bus routes with GPS coordinates, RTO fitness tracking, RFID gatepass security, infirmary logs, and campus store/canteen POS balances.',
    metrics: [
      { label: 'Live Bus Routes', value: '18 Routes' },
      { label: 'Fleet Compliance', value: '100% Fitness' },
      { label: 'Gate Pass Active', value: '28 Passes' },
      { label: 'Store Uniforms', value: '820 Kits' },
    ],
    targetUrl: '/portal/admin/transport',
    targetName: 'Open Fleet & Campus Desk',
  },
  {
    id: 'approvals-governance',
    title: 'Executive Approvals & Workflow Governance',
    badge: 'Actionable Queue',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description:
      'Actionable decision queues: Staff leave applications, EWS fee concession waivers, purchase indents, and student transfer clearance (TC) sign-offs.',
    metrics: [
      { label: 'Pending Approvals', value: '8 Requests' },
      { label: 'SLA Response', value: '< 4 Hours' },
      { label: 'Decision Audit', value: 'Encrypted' },
      { label: 'Sequential Tiers', value: '3-Level' },
    ],
    targetUrl: '/portal/admin/approvals',
    targetName: 'Open Approvals Inbox',
  },
];

export default function InteractiveDemoPage() {
  const [activePreset, setActivePreset] = useState<string>('k12-standard');
  const [isSimulating, setIsSimulating] = useState<string | null>(null);
  const [simResults, setSimResults] = useState<Record<string, string>>({});
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Simulation Triggers
  const runSimulator = (simId: string, durationMs: number, resultText: string) => {
    setIsSimulating(simId);
    setTimeout(() => {
      setIsSimulating(null);
      setSimResults((prev) => ({ ...prev, [simId]: resultText }));
    }, durationMs);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight">VidyaOS Enterprise ERP</span>
            <span className="text-[10px] text-slate-400 font-medium">Interactive Demo Sandbox</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/portal/admin">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 gap-1.5 shadow-xs">
              <Compass className="h-3.5 w-3.5" />
              <span>Launch Live Admin Portal</span>
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-10">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Multi-Role Sandbox & Pre-Loader</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Test-Drive VidyaOS with Instant Datasets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select an institutional scenario below to preload realistic CBSE student records, fee ledgers, bus GPS routes, and examination blueprints. Experience any role instantly with zero configuration.
          </p>
        </div>

        {/* Rapid Role Jump Bar */}
        <Card className="border-slate-200 bg-white shadow-xs p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Instant Multi-Role Switcher
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Switch workspaces without logging out to inspect cross-functional workflows.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link href="/portal/admin">
                <Button variant="outline" size="sm" className="w-full text-xs h-9 font-semibold hover:border-blue-400 hover:text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600 mr-1.5" />
                  School Admin
                </Button>
              </Link>
              <Link href="/portal/teacher">
                <Button variant="outline" size="sm" className="w-full text-xs h-9 font-semibold hover:border-emerald-400 hover:text-emerald-700">
                  <Users className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
                  Teacher Portal
                </Button>
              </Link>
              <Link href="/portal/parent">
                <Button variant="outline" size="sm" className="w-full text-xs h-9 font-semibold hover:border-purple-400 hover:text-purple-700">
                  <HeartPulse className="h-3.5 w-3.5 text-purple-600 mr-1.5" />
                  Parent Guardian
                </Button>
              </Link>
              <Link href="/portal/student">
                <Button variant="outline" size="sm" className="w-full text-xs h-9 font-semibold hover:border-amber-400 hover:text-amber-700">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-600 mr-1.5" />
                  Student Portal
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* SECTION 1: Scenario Pre-Loaders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                1-Click Institutional Scenario Presets
              </h2>
              <p className="text-xs text-slate-500">
                Choose a pre-configured school model to inspect its corresponding desks and modules.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <Card
                  key={preset.id}
                  className={`transition-all shadow-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                        {isSelected && (
                          <Badge variant="success" className="text-[10px] flex items-center gap-1">
                            <Check className="h-3 w-3" /> Active Scenario
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {preset.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {preset.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        {preset.metrics.map((m, i) => (
                          <div key={i} className="space-y-0.5">
                            <span className="font-extrabold text-xs text-slate-900 block truncate">
                              {m.value}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-3">
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActivePreset(preset.id)}
                      className={`text-xs h-8 ${
                        isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Scenario Selected' : 'Activate Preset'}
                    </Button>

                    <Link href={preset.targetUrl}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-8 text-blue-600 hover:text-blue-800 gap-1"
                      >
                        <span>{preset.targetName}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Live Operational Event Simulators */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Live Operational Event Simulators
            </h2>
            <p className="text-xs text-slate-500">
              Trigger real-time institutional events to verify automated calculations and multi-portal sync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SIMULATOR 1 */}
            <Card className="border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                    <Activity className="h-4 w-4" />
                    RFID Morning Muster Roll
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Simulate Gate RFID Tap-Ins
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Simulates 480 automated RFID morning entries and triggers absentee alerts for 20 students.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs">
                  {simResults['rfid'] ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Muster Roll Updated</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">{simResults['rfid']}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px]">
                      Ready to process batch RFID gate events across 3 turnstiles.
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() =>
                    runSimulator(
                      'rfid',
                      1200,
                      '480 student biometric pings logged. 20 absentees identified. Automated SMS notifications queued to parents.'
                    )
                  }
                  disabled={isSimulating === 'rfid'}
                  size="sm"
                  className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  {isSimulating === 'rfid' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Scanning Turnstiles...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>Simulate Gate RFID Pings</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* SIMULATOR 2 */}
            <Card className="border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                    <CreditCard className="h-4 w-4" />
                    Quarter 4 Fee Collection
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Simulate Bulk Fee Receipts
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Processes ₹12,45,000 in term fee transactions, generates receipts, and updates Tally bridge ledger.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs">
                  {simResults['fees'] ? (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span>Ledger Synchronized</span>
                      </div>
                      <p className="text-[11px] text-blue-800">{simResults['fees']}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px]">
                      Ready to batch-settle tuition dues with instant ledger posting.
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() =>
                    runSimulator(
                      'fees',
                      1400,
                      '82 student fee receipts settled. Cash ledger posted: ₹12,45,000. Tally XML bridge payload generated.'
                    )
                  }
                  disabled={isSimulating === 'fees'}
                  size="sm"
                  className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                >
                  {isSimulating === 'fees' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Posting Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>Simulate ₹12.45L Collection</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* SIMULATOR 3 */}
            <Card className="border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700 mb-1">
                    <Bus className="h-4 w-4" />
                    Fleet GPS Telematics
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Simulate Live Bus Telematics
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Streams mock GPS lat/long pings for Route 4 & 7, recalculating parent arrival ETAs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs">
                  {simResults['transport'] ? (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span>Telemetry Streaming</span>
                      </div>
                      <p className="text-[11px] text-purple-800">{simResults['transport']}</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-[11px]">
                      Ready to stream real-time speed, geofencing, and ETA pings.
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={() =>
                    runSimulator(
                      'transport',
                      1500,
                      'Bus DL-01-TA-4920 broadcasting at 34 km/h. Next stop: Vasant Vihar (ETA 4 mins). Parent tracking active.'
                    )
                  }
                  disabled={isSimulating === 'transport'}
                  size="sm"
                  className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
                >
                  {isSimulating === 'transport' ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Receiving Sat Telematics...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>Simulate Fleet GPS Pings</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* SECTION 3: Book a 1-on-1 Consultation */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <Badge variant="indigo" className="text-xs">
                  Tailored Implementation
                </Badge>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Need a Dedicated Multi-Campus Demonstration?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our educational architecture team will walk your board of trustees, principal, and finance committee through bespoke deployment scenarios, legacy database migration, and CBSE compliance audits.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Custom Domain
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    White-label App
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Zero Data Lock-in
                  </span>
                </div>
              </div>

              <div>
                {leadSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-900">Consultation Scheduled!</h4>
                    <p className="text-xs text-slate-600">
                      Our specialist will reach out within 2 working hours with calendar credentials and private sandbox access.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setLeadSubmitted(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <Input required placeholder="Your Name (e.g. Principal Dr. A.K. Nair)" className="text-xs h-9" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="email" required placeholder="Official School Email" className="text-xs h-9" />
                      <Input required placeholder="Mobile / WhatsApp Number" className="text-xs h-9" />
                    </div>
                    <div>
                      <Input required placeholder="Institution Name & City" className="text-xs h-9" />
                    </div>
                    <Button type="submit" size="sm" className="w-full text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Schedule Guided Walkthrough
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Icon helper
function HeartPulse(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
}
