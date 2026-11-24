'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  BookOpen,
  Calendar,
  FileText,
  Briefcase,
  Bus,
  Library,
  Boxes,
  Bell,
  Settings,
  ShieldAlert,
  ChevronDown,
  Building2,
  Sparkles,
  ClipboardList,
  HeartPulse,
  CheckCircle2,
  Bed,
  Trophy,
  UtensilsCrossed,
  Wrench,
  LifeBuoy,
  Layers,
  Award,
  Compass,
  MapPin,
  HeartHandshake,
  Gauge,
  ShoppingBag,
  Scale,
  Fingerprint,
  Percent,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  tenantName: string;
  affiliation: string;
}

export function Sidebar({ currentRole, tenantName, affiliation }: SidebarProps) {
  const pathname = usePathname();

  // Navigation schema configured by role
  const getNavLinks = () => {
    switch (currentRole) {
      case 'platform_super_admin':
        return [
          { label: 'Platform Overview', href: '/platform', icon: LayoutDashboard },
          { label: 'School Tenants', href: '/platform/tenants', icon: Building2 },
          { label: 'Subscription Plans', href: '/platform/plans', icon: CreditCard },
          { label: 'System Health', href: '/platform/health', icon: Sparkles },
          { label: 'Global Audit Logs', href: '/platform/audit', icon: ShieldAlert },
        ];

      case 'teacher':
        return [
          { label: 'Teacher Dashboard', href: '/portal/teacher', icon: LayoutDashboard },
          { label: 'Daily Attendance', href: '/portal/teacher/attendance', icon: CalendarCheck },
          { label: 'Gradebook & Marks', href: '/portal/teacher/marks', icon: BookOpen },
          { label: '360° Holistic Card (HPC)', href: '/portal/teacher/hpc', icon: Sparkles },
          { label: 'Question Bank', href: '/portal/teacher/question-bank', icon: BookOpen },
          { label: 'Homework & Tasks', href: '/portal/teacher/homework', icon: FileText },
          { label: 'Teaching Diary', href: '/portal/teacher/diary', icon: BookOpen },
          { label: 'NEP 2020 Lesson Plans', href: '/portal/teacher/lesson-plans', icon: Sparkles },
          { label: 'Syllabus Tracker', href: '/portal/teacher/syllabus', icon: ClipboardList },
          { label: 'Lab & Facility Booking', href: '/portal/teacher/facilities', icon: Layers },
          { label: 'Material Requisitions', href: '/portal/teacher/requisition', icon: Boxes },
          { label: 'Faculty Leaves', href: '/portal/teacher/leave', icon: Briefcase },
          { label: '50-Hr Teacher CPD', href: '/portal/teacher/cpd', icon: Award },
          { label: 'My Payslips & Tax', href: '/portal/teacher/payroll', icon: CreditCard },
          { label: 'PTM Consultations', href: '/portal/teacher/ptm', icon: Users },
          { label: 'My Timetable', href: '/portal/teacher/timetable', icon: Calendar },
          { label: 'My Biometric Clock-In', href: '/portal/teacher/my-attendance', icon: Fingerprint },
          { label: 'Academic Calendar', href: '/portal/teacher/calendar', icon: Calendar },
        ];

      case 'parent':
        return [
          { label: 'Parent Dashboard', href: '/portal/parent', icon: LayoutDashboard },
          { label: 'Fee Payments', href: '/portal/parent/fees', icon: CreditCard },
          { label: 'Attendance History', href: '/portal/parent/attendance', icon: CalendarCheck },
          { label: 'Leave Applications', href: '/portal/parent/leave', icon: Calendar },
          { label: 'Digital Consent & Trips', href: '/portal/parent/consent', icon: CheckCircle2 },
          { label: 'Report Cards', href: '/portal/parent/reports', icon: BookOpen },
          { label: 'Exam Admit Card', href: '/portal/parent/admit-card', icon: FileText },
          { label: 'Bookstore & Uniform Kits', href: '/portal/parent/store', icon: ShoppingBag },
          { label: 'Academic Calendar', href: '/portal/parent/calendar', icon: Calendar },
          { label: 'Live Bus Tracking', href: '/portal/parent/transport', icon: Bus },
          { label: 'Smart Canteen', href: '/portal/parent/canteen', icon: UtensilsCrossed },
          { label: 'Health & Medical', href: '/portal/parent/health', icon: HeartPulse },
          { label: 'PTM Slot Booking', href: '/portal/parent/ptm', icon: Users },
          { label: 'Parent Helpdesk', href: '/portal/parent/helpdesk', icon: LifeBuoy },
          { label: 'Circulars & Notices', href: '/portal/parent/notices', icon: Bell },
          { label: 'Daily Timetable', href: '/portal/parent/timetable', icon: Calendar },
        ];

      case 'student':
        return [
          { label: 'Student Dashboard', href: '/portal/student', icon: LayoutDashboard },
          { label: 'My Timetable', href: '/portal/student/timetable', icon: Calendar },
          { label: 'Assignments & CBT', href: '/portal/student/homework', icon: FileText },
          { label: 'Exam Results', href: '/portal/student/results', icon: BookOpen },
          { label: 'Exam Admit Card', href: '/portal/student/admit-card', icon: FileText },
          { label: 'Bookstore & Uniform Kits', href: '/portal/parent/store', icon: ShoppingBag },
          { label: '360° Holistic Card (HPC)', href: '/portal/student/hpc', icon: Sparkles },
          { label: 'Stream & Career Pathways', href: '/portal/student/career', icon: Compass },
          { label: 'Alumni Mentorship', href: '/portal/student/alumni', icon: GraduationCap },
          { label: 'House Championship', href: '/portal/student/activities', icon: Trophy },
          { label: '10 Bagless Days', href: '/portal/student/bagless-days', icon: Sparkles },
          { label: 'Digital Library', href: '/portal/student/library', icon: Library },
          { label: 'My Health Card', href: '/portal/student/health', icon: HeartPulse },
          { label: 'Digital Student ID', href: '/portal/student/id-card', icon: CreditCard },
          { label: 'Circulars & Dates', href: '/portal/student/notices', icon: Bell },
          { label: 'Academic Calendar', href: '/portal/student/calendar', icon: Calendar },
          { label: 'Attendance Record', href: '/portal/student/attendance', icon: CalendarCheck },
        ];

      case 'school_admin':
      default:
        return [
          { label: 'Executive Dashboard', href: '/portal/admin', icon: LayoutDashboard },
          { label: 'Students & SIS', href: '/portal/admin/students', icon: Users },
          { label: 'CWSN & Inclusive IEP', href: '/portal/admin/students/cwsn', icon: HeartHandshake },
          { label: 'House & Discipline', href: '/portal/admin/students/discipline', icon: Trophy },
          { label: 'No-Dues Clearance', href: '/portal/admin/students/clearance', icon: CheckCircle2 },
          { label: 'Certificates & Documents', href: '/portal/admin/documents', icon: Award },
          { label: 'Transfer Certificates (TC)', href: '/portal/admin/students/tc', icon: Award },
          { label: 'Admissions Desk', href: '/portal/admin/admissions', icon: UserCheck },
          { label: 'RTE 25% EWS Quota', href: '/portal/admin/admissions/rte', icon: Scale },
          { label: 'Attendance Hub', href: '/portal/admin/attendance', icon: CalendarCheck },
          { label: 'Fees & Collections', href: '/portal/admin/fees', icon: CreditCard },
          { label: 'Fee Concessions', href: '/portal/admin/fees/concessions', icon: Percent },
          { label: 'Exams & Grading', href: '/portal/admin/exams', icon: BookOpen },
          { label: 'Admit Cards (Roll Slips)', href: '/portal/admin/exams/admit-cards', icon: FileText },
          { label: 'Board LOC Pariksha Desk', href: '/portal/admin/exams/loc', icon: ShieldCheck },
          { label: '360° HPC Cell', href: '/portal/admin/exams/hpc', icon: Sparkles },
          { label: 'Question Bank', href: '/portal/admin/exams/question-bank', icon: BookOpen },
          { label: 'Syllabus Oversight', href: '/portal/admin/syllabus', icon: BookOpen },
          { label: 'Teaching Diaries', href: '/portal/admin/academics/diary', icon: BookOpen },
          { label: 'NEP Lesson Plans (HOD)', href: '/portal/admin/academics/lesson-plans', icon: Sparkles },
          { label: 'Master Timetable', href: '/portal/admin/timetable', icon: Calendar },
          { label: 'Academic Calendar (220-Day)', href: '/portal/admin/calendar', icon: Calendar },
          { label: '10 Bagless Days Hub', href: '/portal/admin/academics/bagless-days', icon: Sparkles },
          { label: 'Arrangement Matrix', href: '/portal/admin/staff/substitution', icon: Sparkles },
          { label: 'Health & Infirmary', href: '/portal/admin/health', icon: HeartPulse },
          { label: 'Campus Gate Security', href: '/portal/admin/security', icon: ShieldAlert },
          { label: 'Hostel & Residence', href: '/portal/admin/hostel', icon: Bed },
          { label: 'Campus Facility Desk', href: '/portal/admin/facilities', icon: Layers },
          { label: 'Campus Canteen POS', href: '/portal/admin/canteen', icon: UtensilsCrossed },
          { label: 'House Activities', href: '/portal/admin/activities', icon: Trophy },
          { label: 'Sahodaya & Competitions', href: '/portal/admin/activities/sahodaya', icon: Award },
          { label: 'Staff & HRIS', href: '/portal/admin/staff', icon: Briefcase },
          { label: 'Faculty Biometric Muster', href: '/portal/admin/staff/attendance', icon: Fingerprint },
          { label: 'Teacher CPD (50-Hr)', href: '/portal/admin/staff/cpd', icon: Award },
          { label: 'Transport Fleet', href: '/portal/admin/transport', icon: Bus },
          { label: 'Bus Routes & Stops', href: '/portal/admin/transport/routes', icon: MapPin },
          { label: 'Fleet Maintenance', href: '/portal/admin/transport/maintenance', icon: Wrench },
          { label: 'Trip Sheets & Fuel', href: '/portal/admin/transport/trips', icon: Gauge },
          { label: 'Library Catalog', href: '/portal/admin/library', icon: Library },
          { label: 'Inventory & Assets', href: '/portal/admin/inventory', icon: Boxes },
          { label: 'Store Indents & Issues', href: '/portal/admin/inventory/requisition', icon: Boxes },
          { label: 'Campus Book & Uniform Store', href: '/portal/admin/inventory/store', icon: ShoppingBag },
          { label: 'Alumni Network', href: '/portal/admin/alumni', icon: GraduationCap },
          { label: 'Circulars & Notices', href: '/portal/admin/notices', icon: Bell },
          { label: 'Communication Hub', href: '/portal/admin/communication', icon: Bell },
          { label: 'Grievance Cell', href: '/portal/admin/helpdesk', icon: LifeBuoy },
          { label: 'Parental Consent Desk', href: '/portal/admin/consent', icon: CheckCircle2 },
          { label: 'Reports & Analytics', href: '/portal/admin/reports', icon: ClipboardList },
          { label: 'School Settings', href: '/portal/admin/settings', icon: Settings },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 select-none">
      {/* School Brand Header */}
      <div className="h-16 border-b border-slate-200 px-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-slate-900 truncate">
            {tenantName}
          </span>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {affiliation} Affiliated
          </span>
        </div>
      </div>

      {/* Campus Selector Pill */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Main Campus (VK-01)</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Navigation
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/portal/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-600' : 'text-slate-400')} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Role Indicator */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Role Mode:</span>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px] capitalize">
            {currentRole.replace('_', ' ')}
          </span>
        </div>
      </div>
    </aside>
  );
}
