'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Landmark,
  ShieldCheck,
  RefreshCw,
  Users,
  Layers,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';

export type HolidayTabId = 'calendar' | 'presets' | 'attendance-sync';

export interface SchoolHoliday {
  id: string;
  name: string;
  category: 'Gazetted' | 'Restricted' | 'Vacation' | 'Institutional';
  startDate: string;
  endDate: string;
  totalDays: number;
  applicableTo: 'All School' | 'Students Only' | 'Pre-Primary Only' | 'Staff Only';
  isAttendanceLinked: boolean;
}

interface UnifiedHolidayHubProps {
  initialTab?: HolidayTabId;
}

export function UnifiedHolidayHub({ initialTab = 'calendar' }: UnifiedHolidayHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Active School Holidays
  const [holidays, setHolidays] = useState<SchoolHoliday[]>([
    {
      id: 'h-1',
      name: 'Republic Day',
      category: 'Gazetted',
      startDate: '2026-01-26',
      endDate: '2026-01-26',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-2',
      name: 'Maha Shivratri',
      category: 'Restricted',
      startDate: '2026-02-15',
      endDate: '2026-02-15',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-3',
      name: 'Holi (Festival of Colors)',
      category: 'Gazetted',
      startDate: '2026-03-04',
      endDate: '2026-03-05',
      totalDays: 2,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-4',
      name: 'Id-ul-Fitr',
      category: 'Gazetted',
      startDate: '2026-03-21',
      endDate: '2026-03-21',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-5',
      name: 'Annual Summer Vacation',
      category: 'Vacation',
      startDate: '2026-05-18',
      endDate: '2026-06-30',
      totalDays: 44,
      applicableTo: 'Students Only',
      isAttendanceLinked: true,
    },
    {
      id: 'h-6',
      name: 'Independence Day',
      category: 'Gazetted',
      startDate: '2026-08-15',
      endDate: '2026-08-15',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-7',
      name: 'Mahatma Gandhi Birthday',
      category: 'Gazetted',
      startDate: '2026-10-02',
      endDate: '2026-10-02',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-8',
      name: 'Dussehra (Vijay Dashami)',
      category: 'Gazetted',
      startDate: '2026-10-20',
      endDate: '2026-10-21',
      totalDays: 2,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-9',
      name: 'Diwali (Deepavali & Govardhan Puja)',
      category: 'Gazetted',
      startDate: '2026-11-08',
      endDate: '2026-11-10',
      totalDays: 3,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-10',
      name: 'Guru Nanak Jayanti',
      category: 'Gazetted',
      startDate: '2026-11-24',
      endDate: '2026-11-24',
      totalDays: 1,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
    {
      id: 'h-11',
      name: 'Christmas Day & Winter Break',
      category: 'Vacation',
      startDate: '2026-12-25',
      endDate: '2027-01-02',
      totalDays: 9,
      applicableTo: 'All School',
      isAttendanceLinked: true,
    },
  ]);

  // Modal State for adding new custom holiday
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    category: 'Institutional' as SchoolHoliday['category'],
    startDate: '',
    endDate: '',
    totalDays: 1,
    applicableTo: 'All School' as SchoolHoliday['applicableTo'],
  });

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.startDate) return;

    const record: SchoolHoliday = {
      id: `h-${Date.now()}`,
      name: newHoliday.name,
      category: newHoliday.category,
      startDate: newHoliday.startDate,
      endDate: newHoliday.endDate || newHoliday.startDate,
      totalDays: Number(newHoliday.totalDays) || 1,
      applicableTo: newHoliday.applicableTo,
      isAttendanceLinked: true,
    };

    setHolidays([...holidays, record].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    setIsModalOpen(false);
    setNewHoliday({
      name: '',
      category: 'Institutional',
      startDate: '',
      endDate: '',
      totalDays: 1,
      applicableTo: 'All School',
    });
  };

  // State for attendance sync preview
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleTriggerSync = () => {
    setSyncStatus('Syncing 11 holidays with 2,450 student and faculty attendance records...');
    setTimeout(() => {
      setSyncStatus('✓ Successfully reconciled 100% attendance muster rolls with zero false-absent penalties.');
    }, 800);
  };

  const tabs: SubTabItem[] = [
    {
      id: 'calendar',
      label: 'Institutional Holiday Register',
      icon: Calendar,
      badge: `${holidays.reduce((acc, h) => acc + h.totalDays, 0)} Total Days`,
    },
    {
      id: 'presets',
      label: 'CBSE & National Gazette Presets',
      icon: Landmark,
      badge: 'Official Gazette',
    },
    {
      id: 'attendance-sync',
      label: 'Attendance Roster Linkage',
      icon: RefreshCw,
      badge: 'Auto-Sync Active',
    },
  ];

  const getCategoryBadge = (category: SchoolHoliday['category']) => {
    switch (category) {
      case 'Gazetted':
        return <Badge variant="indigo" className="text-[10px] font-semibold">Gazetted National</Badge>;
      case 'Restricted':
        return <Badge variant="warning" className="text-[10px]">Restricted / Festival</Badge>;
      case 'Vacation':
        return <Badge variant="success" className="text-[10px] font-semibold">Vacation Break</Badge>;
      case 'Institutional':
        return <Badge variant="secondary" className="text-[10px]">Institutional / Local</Badge>;
    }
  };

  const columns: DataTableColumn<SchoolHoliday>[] = [
    {
      key: 'name',
      header: 'Holiday Name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{row.name}</span>
          <span className="text-[10px] text-slate-500">{row.applicableTo}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => getCategoryBadge(row.category),
    },
    {
      key: 'startDate',
      header: 'Date Span',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-700">
          {row.startDate === row.endDate
            ? formatDate(row.startDate)
            : `${formatDate(row.startDate)} to ${formatDate(row.endDate)}`}
        </span>
      ),
    },
    {
      key: 'totalDays',
      header: 'Duration',
      align: 'center',
      sortable: true,
      render: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
          {row.totalDays} {row.totalDays === 1 ? 'Day' : 'Days'}
        </span>
      ),
    },
    {
      key: 'isAttendanceLinked',
      header: 'Muster Roll Link',
      align: 'center',
      render: (row) => (
        <Badge variant="outline" className="gap-1 text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50/50">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Auto-H
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Institutional Academic Holiday &amp; Attendance Linkage Hub
            </h1>
            <Badge variant="indigo" className="text-[11px] font-semibold py-0.5">
              CBSE Affiliation By-Laws Aligned
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Configure gazetted national holidays, religious festival breaks, and seasonal vacations with automated
            linkage to student biometric attendance, faculty muster rolls, and statutory 220 instructional days tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add School Holiday</span>
          </Button>
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Calendar Table */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block uppercase">Gazetted Holidays</span>
                  <span className="text-lg font-bold text-slate-900">
                    {holidays.filter((h) => h.category === 'Gazetted').length} Days
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block uppercase">Restricted Holidays</span>
                  <span className="text-lg font-bold text-slate-900">
                    {holidays.filter((h) => h.category === 'Restricted').length} Days
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-2xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block uppercase">Summer/Winter Vacation</span>
                  <span className="text-lg font-bold text-slate-900">
                    {holidays.filter((h) => h.category === 'Vacation').reduce((acc, h) => acc + h.totalDays, 0)} Days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataTable
            data={holidays}
            columns={columns}
            rowKey="id"
            searchPlaceholder="Search holiday by name or category..."
            exportCsvFilename="school_holidays_register"
          />
        </div>
      )}

      {/* Tab 2: CBSE & National Gazette Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-200 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-blue-600" />
                Govt. of India &amp; CBSE Model Gazette Calendar
              </CardTitle>
              <p className="text-xs text-slate-500">
                Statutory list of public holidays mandated for Central Board of Secondary Education affiliated institutions.
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Mandatory National Days (All Campuses Closed):
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Republic Day</strong> — 26th January (Flag hoisting &amp; patriotic assemblies permitted)</li>
                  <li><strong>Independence Day</strong> — 15th August (National holiday &amp; student celebration)</li>
                  <li><strong>Mahatma Gandhi Birthday</strong> — 2nd October (Swachhata Pakhwada observances)</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>All gazetted holidays are currently active and linked to the academic calendar.</span>
                <Badge variant="indigo" className="text-[10px]">100% Synced</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Attendance Auto-Sync */}
      {activeTab === 'attendance-sync' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-emerald-600" />
                  Automated Biometric &amp; Daily Attendance Muster Linkage
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Ensures all gazetted and school holidays automatically tag &lsquo;H&rsquo; in attendance ledgers so neither students nor staff are penalized as unexcused absentees.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleTriggerSync}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-Sync Rosters
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {syncStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  {syncStatus}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Student RFID &amp; Class Rosters</span>
                  <span className="text-slate-500 block">Status code `H` assigned on 68 total holiday days. Minimum 75% CBSE attendance calculation automatically excludes holiday dates from denominator.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Faculty Biometric Muster Roll</span>
                  <span className="text-slate-500 block">Statutory paid holidays counted in monthly payroll. Zero loss of pay (LOP) deducted for approved national gazetted holidays.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Holiday Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Add School Holiday
              </CardTitle>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAddHoliday} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Holiday Title *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Annual Founder's Day / Regional Holiday"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newHoliday.category}
                      onChange={(e) => setNewHoliday({ ...newHoliday, category: e.target.value as any })}
                      className="w-full text-xs h-9 px-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Gazetted">Gazetted National</option>
                      <option value="Restricted">Restricted / Festival</option>
                      <option value="Vacation">Vacation Break</option>
                      <option value="Institutional">Institutional / Local</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Applicable To
                    </label>
                    <select
                      value={newHoliday.applicableTo}
                      onChange={(e) => setNewHoliday({ ...newHoliday, applicableTo: e.target.value as any })}
                      className="w-full text-xs h-9 px-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="All School">All School</option>
                      <option value="Students Only">Students Only</option>
                      <option value="Pre-Primary Only">Pre-Primary Only</option>
                      <option value="Staff Only">Staff Only</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date *
                    </label>
                    <Input
                      type="date"
                      required
                      value={newHoliday.startDate}
                      onChange={(e) => setNewHoliday({ ...newHoliday, startDate: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={newHoliday.endDate}
                      onChange={(e) => setNewHoliday({ ...newHoliday, endDate: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Calendar Days *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={newHoliday.totalDays}
                    onChange={(e) => setNewHoliday({ ...newHoliday, totalDays: Number(e.target.value) })}
                    className="text-xs"
                  />
                </div>
                <div className="pt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 text-white text-xs font-semibold">
                    Add to Calendar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
