import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, CheckCircle2, CreditCard, Users, CalendarCheck, BookOpen, Briefcase, Bus, Library, Boxes, Bell } from 'lucide-react';

const MODULES_LIST = [
  { icon: Users, title: 'Student Information System', desc: 'Permanent student identity, session enrollments, roll numbers, and CBSE transfer certificates.' },
  { icon: CreditCard, title: 'Fee Management & Razorpay', desc: 'Tuition fees, lab charges, transport installments, and instant UPI checkout with immutable receipts.' },
  { icon: CalendarCheck, title: 'Attendance Engine', desc: 'Daily period marking, shortage alerts, and automated WhatsApp absence notices to parents.' },
  { icon: BookOpen, title: 'Examinations & Grading', desc: 'Configurable 9-point CBSE/ICSE grading schemes, schedules, and batch PDF report card printing.' },
  { icon: Briefcase, title: 'Staff HRIS & Payroll', desc: 'Teacher allocations, leave management, and statutory Indian EPF, ESI, and TDS salary slips.' },
  { icon: Bus, title: 'Transport Fleet Operations', desc: 'Bus route optimization, driver verification, bus stops, and student pickup allocation.' },
  { icon: Library, title: 'Library Circulation', desc: 'ISBN book cataloging, barcode scanning, check-in/out, and automated overdue fine calculation.' },
  { icon: Boxes, title: 'Inventory & Fixed Assets', desc: 'Smart board equipment, physics lab apparatus, answer booklet stocks, and purchase audits.' },
  { icon: Bell, title: 'Communication Hub', desc: 'Official WhatsApp Business Cloud API alerts, Resend transactional emails, and DLT SMS broadcasts.' },
];

export default function FeaturesPage() {
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

      <div className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Complete Suite of 21 Integrated School Modules
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Everything your school needs to replace legacy spreadsheets and disconnected point solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULES_LIST.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Card key={i} className="p-6 space-y-3 bg-white border-slate-200 shadow-xs">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{mod.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{mod.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
