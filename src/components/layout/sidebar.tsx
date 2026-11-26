'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronRight,
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
  Network,
  Languages,
  Flame,
  Cpu,
  Search,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  tenantName: string;
  affiliation: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  id: string;
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
}

export function Sidebar({ currentRole, tenantName, affiliation }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Grouped Navigation Schema for Admin
  const adminSections: NavSection[] = useMemo(
    () => [
      {
        id: 'overview',
        title: 'Overview',
        items: [
          { label: 'Executive Dashboard', href: '/portal/admin', icon: LayoutDashboard },
        ],
      },
      {
        id: 'academics',
        title: 'Academics & Pedagogy',
        icon: BookOpen,
        items: [
          { label: 'NEP Lesson Plans (HOD)', href: '/portal/admin/academics/lesson-plans', icon: Sparkles },
          { label: 'Teaching Diaries', href: '/portal/admin/academics/diary', icon: BookOpen },
          { label: '10 Bagless Days Hub', href: '/portal/admin/academics/bagless-days', icon: Sparkles },
          { label: 'Atal Tinkering Lab (ATL)', href: '/portal/admin/academics/atl', icon: Cpu },
          { label: 'Hubs of Learning (HoL)', href: '/portal/admin/academics/hubs-of-learning', icon: Network },
          { label: 'Career & CUET Cell', href: '/portal/admin/academics/career-guidance', icon: Compass },
          { label: 'Arrangement Matrix', href: '/portal/admin/staff/substitution', icon: Sparkles },
          { label: 'Master Timetable', href: '/portal/admin/timetable', icon: Calendar },
          { label: 'Academic Calendar (220-Day)', href: '/portal/admin/calendar', icon: Calendar },
          { label: 'Syllabus Oversight', href: '/portal/admin/syllabus', icon: ClipboardList },
        ],
      },
      {
        id: 'exams',
        title: 'Exams & Assessment',
        icon: FileText,
        items: [
          { label: 'Board LOC Pariksha Desk', href: '/portal/admin/exams/loc', icon: ShieldCheck },
          { label: '360° HPC Cell', href: '/portal/admin/exams/hpc', icon: Sparkles },
          { label: 'Question Bank', href: '/portal/admin/exams/question-bank', icon: BookOpen },
          { label: 'Admit Cards (Roll Slips)', href: '/portal/admin/exams/admit-cards', icon: FileText },
          { label: 'Exams & Grading', href: '/portal/admin/exams', icon: BookOpen },
        ],
      },
      {
        id: 'students',
        title: 'Students & Inclusion',
        icon: Users,
        items: [
          { label: 'Students & SIS', href: '/portal/admin/students', icon: Users },
          { label: 'CWSN & Inclusive IEP', href: '/portal/admin/students/cwsn', icon: HeartHandshake },
          { label: 'Inclusive Resource Room', href: '/portal/admin/students/resource-room', icon: Building2 },
          { label: 'Admissions Desk', href: '/portal/admin/admissions', icon: UserCheck },
          { label: 'RTE 25% EWS Quota', href: '/portal/admin/admissions/rte', icon: Scale },
          { label: 'Transfer Certificates (TC)', href: '/portal/admin/students/tc', icon: Award },
          { label: 'No-Dues Clearance', href: '/portal/admin/students/clearance', icon: CheckCircle2 },
          { label: 'House & Discipline', href: '/portal/admin/students/discipline', icon: Trophy },
          { label: 'Alumni Network', href: '/portal/admin/alumni', icon: GraduationCap },
        ],
      },
      {
        id: 'safety',
        title: 'Safety, Health & Compliance',
        icon: ShieldAlert,
        items: [
          { label: 'Campus Gate Security', href: '/portal/admin/security', icon: ShieldAlert },
          { label: 'Fire Safety & Mock Drills', href: '/portal/admin/security/disaster-management', icon: Flame },
          { label: 'Health & Infirmary', href: '/portal/admin/health', icon: HeartPulse },
          { label: 'Health & Wellness (SHWP)', href: '/portal/admin/health/wellness', icon: Sparkles },
        ],
      },
      {
        id: 'fees',
        title: 'Fees & Collections',
        icon: CreditCard,
        items: [
          { label: 'Fees & Collections', href: '/portal/admin/fees', icon: CreditCard },
          { label: 'Fee Concessions', href: '/portal/admin/fees/concessions', icon: Percent },
        ],
      },
      {
        id: 'operations',
        title: 'Campus Operations & Fleet',
        icon: Layers,
        items: [
          { label: 'Attendance Hub', href: '/portal/admin/attendance', icon: CalendarCheck },
          { label: 'Transport Fleet Suite', href: '/portal/admin/transport', icon: Bus },
          { label: 'Bus Routes & Stops', href: '/portal/admin/transport/routes', icon: MapPin },
          { label: 'Fleet Maintenance', href: '/portal/admin/transport/maintenance', icon: Wrench },
          { label: 'Trip Sheets & Fuel', href: '/portal/admin/transport/trips', icon: Gauge },
          { label: 'Inventory & Store Suite', href: '/portal/admin/inventory', icon: Boxes },
          { label: 'Store Indents & Issues', href: '/portal/admin/inventory/requisition', icon: Boxes },
          { label: 'Campus Book & Uniform Store', href: '/portal/admin/inventory/store', icon: ShoppingBag },
          { label: 'Library Catalog', href: '/portal/admin/library', icon: Library },
          { label: 'Campus Facility Desk', href: '/portal/admin/facilities', icon: Layers },
          { label: 'Campus Canteen POS', href: '/portal/admin/canteen', icon: UtensilsCrossed },
          { label: 'Hostel & Residence', href: '/portal/admin/hostel', icon: Bed },
        ],
      },
      {
        id: 'staff',
        title: 'Staff & Human Resources',
        icon: Briefcase,
        items: [
          { label: 'Staff & HRIS', href: '/portal/admin/staff', icon: Briefcase },
          { label: 'Faculty Biometric Muster', href: '/portal/admin/staff/attendance', icon: Fingerprint },
          { label: 'Teacher CPD (50-Hr)', href: '/portal/admin/staff/cpd', icon: Award },
        ],
      },
      {
        id: 'activities',
        title: 'Activities & Cultural',
        icon: Trophy,
        items: [
          { label: 'House Activities', href: '/portal/admin/activities', icon: Trophy },
          { label: 'EBSB & Bhasha Sangam', href: '/portal/admin/activities/ebsb', icon: Languages },
          { label: 'Sahodaya & Competitions', href: '/portal/admin/activities/sahodaya', icon: Award },
        ],
      },
      {
        id: 'communication',
        title: 'Communication & Reports',
        icon: Bell,
        items: [
          { label: 'Certificates & Documents', href: '/portal/admin/documents', icon: Award },
          { label: 'Circulars & Notices', href: '/portal/admin/notices', icon: Bell },
          { label: 'Communication Hub', href: '/portal/admin/communication', icon: Bell },
          { label: 'Grievance Cell', href: '/portal/admin/helpdesk', icon: LifeBuoy },
          { label: 'Parental Consent Desk', href: '/portal/admin/consent', icon: CheckCircle2 },
          { label: 'Reports & Analytics', href: '/portal/admin/reports', icon: ClipboardList },
          { label: 'School Settings', href: '/portal/admin/settings', icon: Settings },
        ],
      },
    ],
    []
  );

  // Fallback flat lists for other personas
  const otherRoleSections: Record<string, NavItem[]> = useMemo(
    () => ({
      platform_super_admin: [
        { label: 'Platform Overview', href: '/platform', icon: LayoutDashboard },
        { label: 'School Tenants', href: '/platform/tenants', icon: Building2 },
        { label: 'Subscription Plans', href: '/platform/plans', icon: CreditCard },
        { label: 'System Health', href: '/platform/health', icon: Sparkles },
        { label: 'Global Audit Logs', href: '/platform/audit', icon: ShieldAlert },
      ],
      teacher: [
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
      ],
      parent: [
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
      ],
      student: [
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
        { label: 'EBSB & Bhasha Sangam', href: '/portal/student/ebsb', icon: Languages },
        { label: '10 Bagless Days', href: '/portal/student/bagless-days', icon: Sparkles },
        { label: 'Atal Tinkering Lab (ATL)', href: '/portal/student/atl', icon: Cpu },
        { label: 'Digital Library', href: '/portal/student/library', icon: Library },
        { label: 'My Health Card', href: '/portal/student/health', icon: HeartPulse },
        { label: 'Wellness & Question Box', href: '/portal/student/health/wellness', icon: Sparkles },
        { label: 'Digital Student ID', href: '/portal/student/id-card', icon: CreditCard },
        { label: 'Circulars & Dates', href: '/portal/student/notices', icon: Bell },
        { label: 'Academic Calendar', href: '/portal/student/calendar', icon: Calendar },
        { label: 'Attendance Record', href: '/portal/student/attendance', icon: CalendarCheck },
      ],
    }),
    []
  );

  // Filtered links for non-admin roles
  const filteredOtherItems = useMemo(() => {
    const items = otherRoleSections[currentRole] || [];
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentRole, otherRoleSections, searchQuery]);

  // Filtered sections for admin role
  const filteredAdminSections = useMemo(() => {
    if (!searchQuery.trim()) return adminSections;
    const query = searchQuery.toLowerCase();

    return adminSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [adminSections, searchQuery]);

  const isAdmin = currentRole === 'school_admin' || !currentRole;

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

      {/* Instant Filter Bar (Inspired by Blue's SidebarFilter) */}
      <div className="px-3 py-1">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search desks & tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
        {isAdmin ? (
          // Admin Grouped Collapsible Accordions
          filteredAdminSections.map((section) => {
            const isCollapsed = Boolean(collapsedSections[section.id]) && !searchQuery;
            const hasActiveItem = section.items.some(
              (item) =>
                pathname === item.href ||
                (item.href !== '/portal/admin' && pathname.startsWith(item.href))
            );

            return (
              <div key={section.id} className="pt-1 first:pt-0">
                {/* Section Header (Toggleable) */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-700 transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {section.icon && (
                      <section.icon className="h-3 w-3 text-slate-400 group-hover:text-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{section.title}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-300 group-hover:text-slate-400">
                      {section.items.length}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 mt-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/portal/admin' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-3.5 w-3.5 shrink-0',
                              isActive ? 'text-blue-600' : 'text-slate-400'
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Standard links for Student, Teacher, Parent, Platform Admin
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {currentRole.replace(/_/g, ' ')} Desks
            </div>
            {filteredOtherItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/portal/admin' && pathname.startsWith(item.href));

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
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer / Role Indicator */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-[10px] uppercase shrink-0">
              {currentRole.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-slate-800 text-[11px] truncate capitalize">
                {currentRole.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] text-slate-400 truncate">Online Session</span>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="System Operational" />
        </div>
      </div>
    </aside>
  );
}
