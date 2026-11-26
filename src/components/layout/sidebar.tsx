'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Check,
} from 'lucide-react';

interface SidebarProps {
  currentRole: string;
  tenantName: string;
  affiliation: string;
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  searchKeywords?: string[];
}

interface NavSection {
  id: string;
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
}

export function Sidebar({ currentRole, tenantName, affiliation, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [selectedCampus, setSelectedCampus] = useState('Main Campus (VK-01)');
  const [isCampusMenuOpen, setIsCampusMenuOpen] = useState(false);

  const campuses = [
    { id: 'vk-01', name: 'Main Campus (VK-01)', code: 'VK-01', tag: 'Primary' },
    { id: 'rk-02', name: 'Junior Wing (RK-02)', code: 'RK-02', tag: 'Grades 1-5' },
    { id: 'dw-03', name: 'Sports Academy (DW-03)', code: 'DW-03', tag: 'Athletics' },
  ];

  // Curated, User-Friendly Admin Navigation Sections
  const adminSections: NavSection[] = useMemo(
    () => [
      {
        id: 'overview',
        title: 'Executive',
        items: [
          { label: 'Executive Dashboard', href: '/portal/admin', icon: LayoutDashboard },
          {
            label: 'Approvals & Governance',
            href: '/portal/admin/approvals',
            icon: CheckCircle2,
            badge: 'Workflow',
            searchKeywords: ['approvals', 'leaves', 'concessions', 'indents', 'tc', 'signoff'],
          },
        ],
      },
      {
        id: 'academics',
        title: 'Academics',
        icon: BookOpen,
        items: [
          {
            label: 'Academic Masters Setup',
            href: '/portal/admin/academics/setup',
            icon: Building2,
            badge: 'Classes & Houses',
            searchKeywords: ['classes', 'sections', 'subjects', 'houses', 'rooms', 'smart class'],
          },
          {
            label: 'Homework & Evaluation',
            href: '/portal/admin/homework',
            icon: FileText,
            badge: 'Tasks',
            searchKeywords: ['homework', 'assignments', 'grading', 'submissions', 'evaluation'],
          },
          {
            label: 'Lesson Plans & Pedagogy',
            href: '/portal/admin/academics/lesson-plans',
            icon: Sparkles,
            searchKeywords: ['diaries', 'hod', 'lesson plan', 'pedagogy'],
          },
          {
            label: 'Master Timetable',
            href: '/portal/admin/timetable',
            icon: Calendar,
            searchKeywords: ['periods', 'schedule', 'conflict'],
          },
          {
            label: 'Academic Calendar',
            href: '/portal/admin/calendar',
            icon: CalendarCheck,
            badge: '220-Day',
            searchKeywords: ['holidays', 'events', 'terms'],
          },
          {
            label: 'Syllabus Tracker',
            href: '/portal/admin/syllabus',
            icon: ClipboardList,
            searchKeywords: ['curriculum', 'completion'],
          },
          {
            label: 'Innovation Lab (ATL)',
            href: '/portal/admin/academics/atl',
            icon: Cpu,
            searchKeywords: ['atal tinkering', 'robotics', 'stem'],
          },
          {
            label: 'Bagless Days & HoL',
            href: '/portal/admin/academics/bagless-days',
            icon: Award,
            searchKeywords: ['10 bagless days', 'hubs of learning', 'vocational'],
          },
        ],
      },
      {
        id: 'exams',
        title: 'Examinations',
        icon: FileText,
        items: [
          {
            label: 'Assessment & Exam Suite',
            href: '/portal/admin/exams',
            icon: Award,
            badge: 'CBSE Desk',
            searchKeywords: [
              'marks',
              'grading',
              'loc',
              'pariksha sangam',
              'hpc',
              'holistic progress',
              'question bank',
              'blueprints',
              'admit cards',
              'hall tickets',
            ],
          },
        ],
      },
      {
        id: 'students',
        title: 'Students & Admissions',
        icon: Users,
        items: [
          {
            label: 'Student SIS & Lifecycle',
            href: '/portal/admin/students',
            icon: Users,
            badge: 'Unified',
            searchKeywords: [
              'sis',
              'enrollment',
              'tc',
              'transfer certificate',
              'clearance',
              'no dues',
              'discipline',
              'merits',
              'cwsn',
              'iep',
              'resource room',
            ],
          },
          {
            label: 'Admissions & 25% RTE',
            href: '/portal/admin/admissions',
            icon: UserCheck,
            searchKeywords: ['leads', 'crm', 'rte', 'ews quota', 'applications'],
          },
          {
            label: 'Alumni Network',
            href: '/portal/admin/alumni',
            icon: GraduationCap,
            searchKeywords: ['graduates', 'mentorship', 'donations'],
          },
        ],
      },
      {
        id: 'fees',
        title: 'Fees & Accounts',
        icon: CreditCard,
        items: [
          {
            label: 'Fees & Accounting Hub',
            href: '/portal/admin/fees',
            icon: CreditCard,
            badge: 'Tally Sync',
            searchKeywords: [
              'collections',
              'cashier',
              'concessions',
              'scholarships',
              'ledger',
              'tally bridge',
              'razorpay',
              'receipts',
            ],
          },
        ],
      },
      {
        id: 'operations',
        title: 'Campus & Fleet',
        icon: Layers,
        items: [
          {
            label: 'Front Office & Visitors',
            href: '/portal/admin/front-office',
            icon: ShieldCheck,
            badge: 'Gate Pass',
            searchKeywords: ['visitors', 'gate pass', 'phone log', 'call register', 'postal', 'dispatch', 'enquiries'],
          },
          {
            label: 'Institutional Holidays',
            href: '/portal/admin/holidays',
            icon: Calendar,
            badge: 'Gazette',
            searchKeywords: ['holidays', 'gazetted', 'vacations', 'attendance sync'],
          },
          {
            label: 'Transport & Fleet Suite',
            href: '/portal/admin/transport',
            icon: Bus,
            badge: 'Live GPS',
            searchKeywords: [
              'gps',
              'telematics',
              'bus routes',
              'stops',
              'fleet maintenance',
              'rto fitness',
              'diesel',
              'trip sheets',
            ],
          },
          {
            label: 'Inventory & Campus Store',
            href: '/portal/admin/inventory',
            icon: Boxes,
            searchKeywords: [
              'assets',
              'depreciation',
              'indents',
              'requisitions',
              'bookstore',
              'uniform pos',
            ],
          },
          {
            label: 'Attendance Operations',
            href: '/portal/admin/attendance',
            icon: CalendarCheck,
            searchKeywords: ['daily attendance', 'rfid', 'absentees'],
          },
          {
            label: 'Library Management',
            href: '/portal/admin/library',
            icon: Library,
            searchKeywords: ['books', 'isbn', 'catalog', 'circulation'],
          },
          {
            label: 'Facilities & Campus POS',
            href: '/portal/admin/facilities',
            icon: Layers,
            searchKeywords: ['rooms', 'auditorium', 'booking', 'canteen pos', 'hostel'],
          },
        ],
      },
      {
        id: 'staff',
        title: 'Faculty & HR',
        icon: Briefcase,
        items: [
          {
            label: 'Faculty HRIS & Payroll',
            href: '/portal/admin/staff',
            icon: Briefcase,
            badge: 'EPF/ESI',
            searchKeywords: [
              'staff directory',
              'payroll',
              'salary slips',
              'biometric attendance',
              'muster roll',
              'substitution matrix',
              '50-hr cpd',
            ],
          },
        ],
      },
      {
        id: 'safety',
        title: 'Safety & Health',
        icon: ShieldAlert,
        items: [
          {
            label: 'Campus Security & Gate',
            href: '/portal/admin/security',
            icon: ShieldAlert,
            searchKeywords: ['visitor pass', 'gatepass', 'pocso', 'fire drill', 'disaster'],
          },
          {
            label: 'Health & Infirmary',
            href: '/portal/admin/health',
            icon: HeartPulse,
            searchKeywords: ['medical', 'infirmary', 'vaccination', 'wellness', 'shwp'],
          },
        ],
      },
      {
        id: 'communications',
        title: 'Communications',
        icon: Bell,
        items: [
          {
            label: 'Certificate Studio',
            href: '/portal/admin/certificates',
            icon: Award,
            badge: 'Designer',
            searchKeywords: ['certificates', 'bonafide', 'merit', 'templates', 'custom design', 'print'],
          },
          {
            label: 'Noticeboard & Circulars',
            href: '/portal/admin/notices',
            icon: Bell,
            searchKeywords: ['announcements', 'circulars', 'sms broadcast'],
          },
          {
            label: 'Document Dispatch',
            href: '/portal/admin/documents',
            icon: Award,
            searchKeywords: ['id cards', 'certificates', 'transcripts'],
          },
          {
            label: 'Grievance & Consent Desk',
            href: '/portal/admin/helpdesk',
            icon: LifeBuoy,
            searchKeywords: ['tickets', 'complaints', 'parental consent'],
          },
          {
            label: 'Reports & Analytics',
            href: '/portal/admin/reports',
            icon: ClipboardList,
            searchKeywords: ['udise+', 'cbse audit', 'mis dashboard'],
          },
          {
            label: 'School Settings',
            href: '/portal/admin/settings',
            icon: Settings,
            searchKeywords: ['branding', 'sessions', 'rules'],
          },
        ],
      },
    ],
    []
  );

  // Other Role Navs
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
        { label: 'Homework & Tasks', href: '/portal/parent/homework', icon: FileText },
        { label: 'Certificates & Bonafide', href: '/portal/parent/certificates', icon: Award },
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
        { label: 'Certificates & Bonafide', href: '/portal/student/certificates', icon: Award },
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

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

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
    const query = searchQuery.toLowerCase().trim();

    return adminSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const matchLabel = item.label.toLowerCase().includes(query);
          const matchTitle = section.title.toLowerCase().includes(query);
          const matchKeywords = item.searchKeywords?.some((kw) =>
            kw.toLowerCase().includes(query)
          );
          return matchLabel || matchTitle || matchKeywords;
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [adminSections, searchQuery]);

  const isAdmin = currentRole === 'school_admin' || !currentRole;

  return (
    <aside className="w-72 h-full border-r border-slate-200 bg-white flex flex-col shrink-0 select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)] z-20">
      {/* 1. School Brand Header */}
      <div className="h-16 border-b border-slate-200 px-4 flex items-center gap-3 bg-white">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shrink-0 shadow-sm ring-2 ring-blue-50">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
            {tenantName}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {affiliation} Affiliated
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Campus Selector */}
      <div className="px-3 pt-3 pb-2 relative">
        <button
          type="button"
          onClick={() => setIsCampusMenuOpen(!isCampusMenuOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-xs text-slate-700 font-medium transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="h-5 px-1.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
              {campuses.find((c) => c.name === selectedCampus)?.code || 'VK-01'}
            </span>
            <span className="truncate text-xs font-semibold text-slate-800">
              {selectedCampus}
            </span>
          </div>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0',
              isCampusMenuOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Campus Dropdown Menu */}
        {isCampusMenuOpen && (
          <div className="absolute left-3 right-3 top-14 bg-white rounded-xl border border-slate-200 shadow-lg p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Select Operating Campus
            </div>
            {campuses.map((campus) => (
              <button
                key={campus.id}
                type="button"
                onClick={() => {
                  setSelectedCampus(campus.name);
                  setIsCampusMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left',
                  selectedCampus === campus.name
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] font-bold text-slate-500">
                    {campus.code}
                  </span>
                  <span className="truncate">{campus.name}</span>
                </div>
                {selectedCampus === campus.name && (
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Instant Search Filter Bar */}
      <div className="px-3 py-1">
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search desks (e.g. LOC, GPS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs pl-8 pr-7 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-thin">
        {isAdmin ? (
          // Admin Grouped Collapsible Accordions
          filteredAdminSections.map((section) => {
            const hasActiveItem = section.items.some(
              (item) =>
                pathname === item.href ||
                (item.href !== '/portal/admin' && pathname.startsWith(item.href))
            );
            // Default open if active item exists, unless manually toggled
            const isCollapsed =
              collapsedSections[section.id] !== undefined
                ? collapsedSections[section.id]
                : !hasActiveItem && section.id !== 'overview' && !searchQuery;

            return (
              <div key={section.id} className="pt-1.5 first:pt-0">
                {/* Section Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {section.icon && (
                      <section.icon className="h-3 w-3 text-slate-400 group-hover:text-blue-600 shrink-0 transition-colors" />
                    )}
                    <span className="truncate">{section.title}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 transition-colors">
                      {section.items.length}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                    ) : (
                      <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 mt-1 pl-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/portal/admin' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onNavigate?.()}
                          className={cn(
                            'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative',
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-semibold border-l-[3px] border-blue-600 shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-50/90 hover:text-slate-900 border-l-[3px] border-transparent'
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon
                              className={cn(
                                'h-3.5 w-3.5 shrink-0 transition-colors',
                                isActive
                                  ? 'text-blue-600'
                                  : 'text-slate-400 group-hover:text-slate-600'
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                                isActive
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Role Desks for Teachers, Parents, Students, Platform Admins
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
                  onClick={() => onNavigate?.()}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group',
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-[3px] border-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-[3px] border-transparent'
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isActive
                          ? 'text-blue-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* 5. User Profile Footer (Protected against floating overlays) */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/70 relative z-20">
        <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 shadow-xs">
              {currentRole ? currentRole.charAt(0) : 'A'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-900 text-xs truncate capitalize leading-tight">
                {currentRole ? currentRole.replace(/_/g, ' ') : 'Administrator'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-medium truncate">
                  Active Session
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/portal/admin/settings"
            onClick={() => onNavigate?.()}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="School Settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
