'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bell,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Pin,
  FileText,
  AlertCircle,
  PlusCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Download,
  ShieldCheck,
  Building2,
  BookOpen,
} from 'lucide-react';
import {
  SchoolNotice,
  CalendarEvent,
  NoticeCategory,
  TargetAudience,
  INITIAL_SCHOOL_CIRCULARS,
  STATUTORY_ACADEMIC_CALENDAR,
  filterNoticesForAudience,
  searchNotices,
  getCalendarEventsForMonth,
  recordNoticeAcknowledgement,
} from '@/modules/communication/noticeboard';

interface Props {
  role?: 'admin' | 'parent' | 'student' | 'teacher';
  studentGrade?: number;
}

export function NoticeboardManager({ role = 'admin', studentGrade = 12 }: Props) {
  const [activeTab, setActiveTab] = useState<'circulars' | 'calendar' | 'publish'>('circulars');
  const [notices, setNotices] = useState<SchoolNotice[]>(INITIAL_SCHOOL_CIRCULARS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | 'ALL'>('ALL');
  const [acknowledgedNotices, setAcknowledgedNotices] = useState<Record<string, boolean>>({});
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November
  const [selectedYear] = useState<number>(2024);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Notice Form State (Admin)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('ACADEMIC');
  const [newAudience, setNewAudience] = useState<TargetAudience>('ALL_SCHOOL');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAckRequired, setNewAckRequired] = useState(false);
  const [newIsPinned, setNewIsPinned] = useState(false);

  // Filter notices for this role
  const roleFiltered = filterNoticesForAudience(notices, role, studentGrade);
  const displayedNotices = searchNotices(roleFiltered, searchQuery, selectedCategory);

  // Month Events
  const monthEvents = getCalendarEventsForMonth(STATUTORY_ACADEMIC_CALENDAR, selectedYear, selectedMonth);

  const handleAcknowledge = (notice: SchoolNotice) => {
    const res = recordNoticeAcknowledgement(notice, 'parent-mehta-01');
    if (res.success) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? res.updatedNotice : n))
      );
      setAcknowledgedNotices((prev) => ({ ...prev, [notice.id]: true }));
      setFeedback(`Circular ${notice.circularNo} successfully acknowledged. Digital timestamp logged for regulatory records.`);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newContent) return;

    const circularNo = `VK/CIR/2024-25/${String(notices.length + 85).padStart(3, '0')}`;
    const newNotice: SchoolNotice = {
      id: `cir-${Date.now()}`,
      circularNo,
      title: newTitle,
      category: newCategory,
      targetAudience: newAudience,
      publishDate: new Date().toISOString().split('T')[0],
      summary: newSummary,
      content: newContent,
      signedBy: 'Shri Vikramaditya (Principal & Admin)',
      isPinned: newIsPinned,
      acknowledgementRequired: newAckRequired,
      readReceiptCount: 0,
    };

    setNotices([newNotice, ...notices]);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewAckRequired(false);
    setNewIsPinned(false);
    setActiveTab('circulars');
    setFeedback(`New circular ${circularNo} broadcasted successfully to ${newAudience.replace('_', ' ')}!`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-600 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs & Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'circulars' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('circulars')}
            className="flex items-center gap-2 text-xs"
          >
            <Bell className="h-3.5 w-3.5" />
            Official Circulars ({displayedNotices.length})
          </Button>

          <Button
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('calendar')}
            className="flex items-center gap-2 text-xs"
          >
            <Calendar className="h-3.5 w-3.5" />
            Academic Calendar ({STATUTORY_ACADEMIC_CALENDAR.length} Events)
          </Button>

          {role === 'admin' && (
            <Button
              variant={activeTab === 'publish' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('publish')}
              className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Publish Circular
            </Button>
          )}
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
          <span>Affiliation: CBSE / Reg. No. 2130894</span>
        </div>
      </div>

      {/* TAB 1: CIRCULARS */}
      {activeTab === 'circulars' && (
        <div className="space-y-6">
          {/* Search & Category Filter Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search circulars by title, circular no, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="ACADEMIC">Academic & Timings</option>
                <option value="EXAM_SCHEDULE">Examinations & Pre-Boards</option>
                <option value="REGULATORY">CBSE Regulatory & LOC</option>
                <option value="SPORTS_EVENT">Sports & Co-Curricular</option>
                <option value="HOLIDAY">Holidays & Vacations</option>
                <option value="EMERGENCY">Emergency & Weather</option>
              </select>
            </div>
          </div>

          {/* Notice List */}
          <div className="space-y-4">
            {displayedNotices.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">
                <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-sm">No circulars match your search or audience filters.</p>
                <p className="text-xs mt-1">Try resetting the query or category selector.</p>
              </Card>
            ) : (
              displayedNotices.map((notice) => {
                const isAcknowledged = acknowledgedNotices[notice.id];

                return (
                  <Card
                    key={notice.id}
                    className={`transition-all duration-150 ${
                      notice.isPinned
                        ? 'border-blue-300 bg-linear-to-r from-blue-50/40 via-white to-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {notice.isPinned && (
                              <Badge className="bg-blue-600 text-white text-[10px] flex items-center gap-1 font-semibold">
                                <Pin className="h-2.5 w-2.5" /> Pinned Advisory
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px] font-mono text-slate-600 bg-slate-50">
                              {notice.circularNo}
                            </Badge>
                            <Badge
                              className={`text-[10px] font-medium ${
                                notice.category === 'REGULATORY'
                                  ? 'bg-purple-100 text-purple-700'
                                  : notice.category === 'EXAM_SCHEDULE'
                                  ? 'bg-amber-100 text-amber-800'
                                  : notice.category === 'SPORTS_EVENT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {notice.category.replace('_', ' ')}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              Audience: {notice.targetAudience.replace('_', ' ')}
                            </Badge>
                          </div>
                          <CardTitle className="text-base text-slate-900 mt-1">
                            {notice.title}
                          </CardTitle>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {notice.publishDate}
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {notice.readReceiptCount} parent receipts logged
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        {notice.summary}
                      </p>

                      <p className="text-xs text-slate-600 leading-normal">
                        {notice.content}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="text-slate-500 italic">
                          Issued by: <span className="font-semibold text-slate-700">{notice.signedBy}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {notice.acknowledgementRequired && (
                            <>
                              {isAcknowledged ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                  Acknowledged
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleAcknowledge(notice)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Acknowledge Notice
                                </Button>
                              )}
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              alert(`Simulating PDF download for: ${notice.circularNo}. Official seal and barcode included.`);
                            }}
                            className="text-xs h-8 flex items-center gap-1 text-slate-700"
                          >
                            <Download className="h-3 w-3" />
                            PDF Circular
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMIC CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Month Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-sm text-slate-900">
                Academic Session 2024-2025 Calendar
              </h2>
              <p className="text-xs text-slate-500">
                Statutory CBSE examinations, gazetted central holidays, and parent-teacher consultations.
              </p>
            </div>

            {/* Quick Month Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[10, 11, 12, 1, 2, 3].map((m) => {
                const isSelected = selectedMonth === m;
                return (
                  <Button
                    key={m}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMonth(m)}
                    className="text-xs h-8 px-3"
                  >
                    {monthNames[m - 1]}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Events in Month */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {monthEvents.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 md:col-span-2">
                <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-sm">No special gazetted holidays or exams scheduled in {monthNames[selectedMonth - 1]}.</p>
                <p className="text-xs mt-1">Regular timetable and academic sessions apply during this period.</p>
              </Card>
            ) : (
              monthEvents.map((evt) => (
                <Card key={evt.id} className="border-slate-200 hover:shadow-xs transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={`text-[10px] font-semibold ${
                              evt.eventType === 'GAZETTED_HOLIDAY'
                                ? 'bg-rose-100 text-rose-800'
                                : evt.eventType === 'EXAMINATION'
                                ? 'bg-amber-100 text-amber-800'
                                : evt.eventType === 'PTM'
                                ? 'bg-purple-100 text-purple-800'
                                : evt.eventType === 'VACATION'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {evt.eventType.replace('_', ' ')}
                          </Badge>
                          {evt.affectsAttendance && (
                            <Badge variant="destructive" className="text-[9px]">
                              School Closed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                          {evt.title}
                        </CardTitle>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-semibold text-blue-600 block">
                          {evt.startDate}
                        </span>
                        {evt.startDate !== evt.endDate && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            to {evt.endDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-slate-600">{evt.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH NEW NOTICE (ADMIN ONLY) */}
      {activeTab === 'publish' && role === 'admin' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-emerald-600" />
              Broadcast Official Circular / Notice
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Draft official administrative circulars with audience targeting, acknowledgement verification, and digital audit trail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePublishNotice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Circular Title *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Schedule for Annual Science Exhibition & Model Displays"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACADEMIC">Academic</option>
                      <option value="EXAM_SCHEDULE">Exam Schedule</option>
                      <option value="REGULATORY">Regulatory</option>
                      <option value="SPORTS_EVENT">Sports Event</option>
                      <option value="HOLIDAY">Holiday</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Audience *
                    </label>
                    <select
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ALL_SCHOOL">All School</option>
                      <option value="PRIMARY">Primary (Class 1-5)</option>
                      <option value="SECONDARY">Secondary (Class 6-10)</option>
                      <option value="SENIOR_SECONDARY">Senior Sec (Class 11-12)</option>
                      <option value="BOARD_CLASSES">Board Classes (10 & 12)</option>
                      <option value="TRANSPORT_USERS">Transport Users</option>
                      <option value="FACULTY">Faculty & Staff</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Summary / Key Advisory *
                </label>
                <Input
                  required
                  placeholder="One-sentence executive summary displayed in mobile push notifications and parent SMS."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Circular Text & Instructions *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter complete instructions, venue details, statutory guidelines, or reporting times..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={newAckRequired}
                    onChange={(e) => setNewAckRequired(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Require Parent Acknowledgement Receipt
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={newIsPinned}
                    onChange={(e) => setNewIsPinned(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Pin to Top of Noticeboard
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('circulars')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Broadcast Circular Instantly
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
