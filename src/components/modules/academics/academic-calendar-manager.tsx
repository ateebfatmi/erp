'use client';

import React, { useState } from 'react';
import {
  CalendarEvent,
  CalendarEventType,
  INITIAL_ACADEMIC_EVENTS,
  calculateSessionWorkingDays,
  generateIcsCalendar,
} from '@/modules/academics/academic-calendar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Filter,
  Users,
  Search,
  Check,
} from 'lucide-react';

interface AcademicCalendarManagerProps {
  viewMode?: 'admin' | 'teacher' | 'student' | 'parent';
}

const EVENT_TYPE_STYLES: Record<
  CalendarEventType,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  GAZETTED_HOLIDAY: {
    label: 'Gazetted Holiday',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  RESTRICTED_HOLIDAY: {
    label: 'Restricted Holiday',
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-500/30',
    dot: 'bg-teal-500',
  },
  VACATION: {
    label: 'School Vacation',
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-500/30',
    dot: 'bg-purple-500',
  },
  EXAMINATION: {
    label: 'Board & Term Exams',
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  SCHOOL_EVENT: {
    label: 'School Celebration',
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500',
  },
  TEACHER_TRAINING: {
    label: 'Teacher 50-Hr CPD',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-500/30',
    dot: 'bg-indigo-500',
  },
  PTM: {
    label: 'Parent-Teacher Meeting',
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
  },
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function AcademicCalendarManager({ viewMode = 'admin' }: AcademicCalendarManagerProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_ACADEMIC_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // April (start of session)
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');

  // New Event Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEventType>('SCHOOL_EVENT');
  const [newStart, setNewStart] = useState('2026-04-15');
  const [newEnd, setNewEnd] = useState('2026-04-15');
  const [newDesc, setNewDesc] = useState('');
  const [newIsStudentWork, setNewIsStudentWork] = useState(true);
  const [newIsTeacherWork, setNewIsTeacherWork] = useState(true);

  // Stats calculation
  const stats = calculateSessionWorkingDays(events);

  // Month Navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'ALL' || ev.eventType === selectedCategory;
    const matchesQuery =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Events in current active month
  const targetPrefix = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
  const currentMonthEvents = filteredEvents.filter(
    (ev) => ev.startDate.startsWith(targetPrefix) || ev.endDate.startsWith(targetPrefix)
  );

  // Download .ics handler
  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendar(events);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VidyaOS_CBSE_Academic_Calendar_${currentYear}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add event handler
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `evt-${Date.now().toString().slice(-6)}`,
      title: newTitle.trim(),
      eventType: newType,
      startDate: newStart,
      endDate: newEnd,
      description: newDesc.trim() || newTitle.trim(),
      isWorkingDayForStudents: newIsStudentWork,
      isWorkingDayForTeachers: newIsTeacherWork,
      audience: 'ALL',
    };

    setEvents([newEv, ...events]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Days in month calculation for the grid view
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <CalendarIcon className="w-64 h-64 text-blue-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CBSE Affiliation By-Laws (Rule 14.1)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Institutional Academic Calendar</h1>
            <p className="text-sm text-blue-200/80 max-w-2xl mt-1">
              Annual gazetted holidays, term exam windows, vacation breaks, and statutory 220-day working days compliance tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadIcs}
              className="px-3.5 py-2 bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-400/40 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .ics (Google/Apple)</span>
            </button>

            {viewMode === 'admin' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CBSE Statutory Working Days Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Elementary Classes */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Elementary (Classes 1–8)</span>
              <span className="font-semibold text-foreground">Rule 14.1 Mandate</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-foreground">
                {stats.studentWorkingDays}
              </span>
              <span className="text-xs text-muted-foreground">/ 220 required days</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  stats.compliesWithCbseElementary ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.round((stats.studentWorkingDays / 220) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span
                className={`font-semibold flex items-center gap-1 ${
                  stats.compliesWithCbseElementary ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {stats.compliesWithCbseElementary
                  ? `Compliant (+${stats.elementaryDelta} days)`
                  : 'Action Needed'}
              </span>
              <span className="text-muted-foreground">Session 2026-27</span>
            </div>
          </div>
        </div>

        {/* Secondary Classes */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>Secondary (Classes 9–12)</span>
              <span className="font-semibold text-foreground">CBSE Board Mandate</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-foreground">
                {stats.studentWorkingDays}
              </span>
              <span className="text-xs text-muted-foreground">/ 200 required days</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((stats.studentWorkingDays / 200) * 100))}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Compliant (+{stats.secondaryDelta} buffer days)
              </span>
              <span className="text-muted-foreground">Board Ready</span>
            </div>
          </div>
        </div>

        {/* Gazetted Holidays */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Gazetted & State Holidays</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {stats.gazettedHolidaysCount} Days
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Central & state government authorized list
          </p>
        </div>

        {/* Teacher Working Days */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Teacher Working Days</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {stats.teacherWorkingDays} Days
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Includes CPD days, curriculum planning & evaluations
          </p>
        </div>
      </div>

      {/* Calendar Controls & Month Selector */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Month Picker */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-bold text-foreground min-w-[140px] text-center">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-muted-foreground border-l border-border pl-3">
            {currentMonthEvents.length} event{currentMonthEvents.length !== 1 ? 's' : ''} scheduled
          </span>
        </div>

        {/* Category Filter & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/50 border border-input rounded-lg pl-8 pr-3 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <div className="flex bg-muted rounded-lg p-0.5 border border-border text-xs">
            <button
              onClick={() => setViewStyle('grid')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewStyle === 'grid' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewStyle('list')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewStyle === 'list' ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Grid or List */}
      {viewStyle === 'grid' ? (
        <div className="bg-card border border-border rounded-xl shadow-sm p-4 overflow-x-auto">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground pb-2 border-b border-border min-w-[700px]">
            <div className="text-rose-500">Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2 min-w-[700px]">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[90px] bg-muted/20 rounded-lg p-1.5" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = `${currentYear}-${currentMonth
                .toString()
                .padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const dayOfWeek = new Date(currentYear, currentMonth - 1, dayNum).getDay();
              const isSunday = dayOfWeek === 0;

              // Find events on this day
              const dayEvents = filteredEvents.filter((ev) => {
                return dayStr >= ev.startDate && dayStr <= ev.endDate;
              });

              return (
                <div
                  key={dayStr}
                  className={`min-h-[90px] rounded-lg p-1.5 border transition-all flex flex-col justify-between ${
                    isSunday
                      ? 'bg-rose-500/5 border-rose-500/20'
                      : dayEvents.length > 0
                      ? 'bg-muted/40 border-border hover:border-blue-500/50'
                      : 'bg-card border-border/60 hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSunday ? 'text-rose-500' : 'text-foreground'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const style = EVENT_TYPE_STYLES[ev.eventType];
                      return (
                        <div
                          key={ev.id}
                          title={`${ev.title} - ${ev.description}`}
                          className={`text-[10px] font-medium px-1 py-0.5 rounded truncate border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground font-semibold px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
          {currentMonthEvents.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
              <p>No calendar events scheduled in {MONTH_NAMES[currentMonth - 1]} {currentYear}.</p>
            </div>
          ) : (
            currentMonthEvents.map((ev) => {
              const style = EVENT_TYPE_STYLES[ev.eventType];
              return (
                <div key={ev.id} className="p-4 hover:bg-muted/20 transition-colors flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-foreground">{ev.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {style.label}
                        </span>
                        {ev.academicTerm && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {ev.academicTerm}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {ev.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                        <span>
                          Students:{' '}
                          <strong className={ev.isWorkingDayForStudents ? 'text-emerald-600' : 'text-rose-500'}>
                            {ev.isWorkingDayForStudents ? 'Working Day' : 'Holiday'}
                          </strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          Teachers:{' '}
                          <strong className={ev.isWorkingDayForTeachers ? 'text-emerald-600' : 'text-rose-500'}>
                            {ev.isWorkingDayForTeachers ? 'Working Day' : 'Holiday'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-foreground font-mono">
                      {ev.startDate === ev.endDate ? ev.startDate : `${ev.startDate} to ${ev.endDate}`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Event Modal (For Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-foreground">
            <h3 className="font-bold text-base text-foreground mb-1">
              Add Academic Calendar Event
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Schedule institutional holidays, examinations, vacation breaks, or teacher CPD sessions.
            </p>

            <form onSubmit={handleAddEventSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition & RoboFest 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Event Category *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CalendarEventType)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none"
                  >
                    <option value="SCHOOL_EVENT">School Celebration / Event</option>
                    <option value="GAZETTED_HOLIDAY">Gazetted Holiday</option>
                    <option value="EXAMINATION">Board & Term Examination</option>
                    <option value="VACATION">Vacation Break</option>
                    <option value="TEACHER_TRAINING">Teacher 50-Hr CPD</option>
                    <option value="PTM">Parent-Teacher Meeting (PTM)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Target Audience</label>
                  <select className="w-full bg-muted/50 border border-input rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none">
                    <option value="ALL">All School Community</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="TEACHERS">Faculty & Staff Only</option>
                    <option value="PARENTS">Parents</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full bg-muted/50 border border-input rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, assembly guidelines, or exam syllabus circular..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg p-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-2">
                <span className="font-semibold text-foreground block">
                  Working Day Status (Affects CBSE 220-day tally):
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsStudentWork}
                      onChange={(e) => setNewIsStudentWork(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Working day for students</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIsTeacherWork}
                      onChange={(e) => setNewIsTeacherWork(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Working day for teachers</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
