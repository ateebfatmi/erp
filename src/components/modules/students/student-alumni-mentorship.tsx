'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ExternalLink,
  MessageSquare,
  Building2,
  MapPin,
  Sparkles,
  BookOpen,
  Send,
} from 'lucide-react';
import {
  AlumniProfile,
  MentorshipDomain,
  MentorshipSessionRequest,
  INITIAL_ALUMNI_ROSTER,
  INITIAL_MENTORSHIP_SESSIONS,
  filterAlumniMentors,
  createMentorshipRequest,
} from '@/modules/students/alumni';

const DOMAIN_LABELS: Record<MentorshipDomain, { label: string; badge: string }> = {
  ENGINEERING_TECH: { label: 'Engineering & Tech (IITs/AI)', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  MEDICINE_HEALTHCARE: { label: 'Medicine & Healthcare (AIIMS)', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  COMMERCE_FINANCE: { label: 'Commerce & Finance (SRCC/IB)', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  LAW_JUDICIARY: { label: 'Law & Judiciary (NLSIU/CLAT)', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
  CIVIL_SERVICES_UPSC: { label: 'Civil Services (IAS/UPSC)', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  CREATIVE_ARTS_MEDIA: { label: 'Design & Media', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
};

export function StudentAlumniMentorship() {
  const [mentors] = useState<AlumniProfile[]>(INITIAL_ALUMNI_ROSTER);
  const [sessions, setSessions] = useState<MentorshipSessionRequest[]>(INITIAL_MENTORSHIP_SESSIONS);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-sessions'>('browse');
  const [selectedDomain, setSelectedDomain] = useState<MentorshipDomain | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [bookingMentor, setBookingMentor] = useState<AlumniProfile | null>(null);
  const [statement, setStatement] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const displayedMentors = filterAlumniMentors(mentors, selectedDomain, searchQuery);

  const handleOpenBooking = (mentor: AlumniProfile) => {
    setBookingMentor(mentor);
    setSelectedSlot(mentor.availableSlots?.[0] || 'Saturday 5:00 PM IST');
    setStatement('');
    setErrorMsg(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingMentor) return;

    try {
      const newSession = createMentorshipRequest(bookingMentor, {
        studentAdmissionNo: 'ADM-2024-001',
        studentName: 'Aarav Mehta',
        studentGrade: 'Class 10A',
        statementOfPurpose: statement,
        preferredSlot: selectedSlot,
      });

      setSessions((prev) => [newSession, ...prev]);
      setBookingMentor(null);
      setFeedback(
        `Mentorship session booked successfully with ${bookingMentor.name}! Video consultation link generated.`
      );
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit booking');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'browse'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Distinguished Alumni Mentors Directory
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-sessions')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'my-sessions'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Video className="h-4 w-4" />
          My Mentorship Consultations
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {sessions.length}
          </span>
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="space-y-6">
          {/* Filter Bar */}
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  placeholder="Search by mentor name, university, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Domain:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDomain('ALL')}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                    selectedDomain === 'ALL'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Domains
                </button>
                {(Object.keys(DOMAIN_LABELS) as MentorshipDomain[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDomain(d)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors shrink-0 ${
                      selectedDomain === d
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {DOMAIN_LABELS[d].label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMentors.map((mentor) => {
              const domainInfo = mentor.domain ? DOMAIN_LABELS[mentor.domain] : null;

              return (
                <Card
                  key={mentor.id}
                  className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <CardHeader className="p-4 pb-2 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {mentor.name}
                        </CardTitle>
                        <span className="text-xs font-semibold text-blue-600 block">
                          Class of {mentor.passingYear} &bull; {mentor.stream} Stream
                        </span>
                      </div>
                      {domainInfo && (
                        <Badge className={`text-[10px] ${domainInfo.badge}`}>
                          {domainInfo.label.split('(')[0].trim()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3 grow">
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800">{mentor.higherEducation}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{mentor.currentProfession}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{mentor.location}</span>
                      </div>
                    </div>

                    {/* Expertise Badges */}
                    {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Mentorship Specializations
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertiseAreas.map((exp, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Slots */}
                    {mentor.availableSlots && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-md p-2 text-[11px] text-blue-900">
                        <span className="font-semibold block flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-600" /> Available Weekly Slot:
                        </span>
                        <span className="text-slate-600">{mentor.availableSlots.join(' or ')}</span>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-4 pt-0">
                    <Button
                      size="sm"
                      onClick={() => handleOpenBooking(mentor)}
                      className="w-full gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Request 1:1 Guidance Session</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* My Scheduled Consultations View */
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-600" />
                My Active Mentorship Consultations
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                1:1 video counseling with alumni leaders & mentors
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        Mentor: {sess.alumniName}
                      </span>
                      <Badge
                        variant={sess.status === 'CONFIRMED' ? 'success' : 'outline'}
                        className="text-[10px]"
                      >
                        {sess.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">
                        Ref: {sess.id}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Statement of Purpose:
                      </span>
                      {sess.statementOfPurpose}
                    </div>

                    {sess.mentorFeedbackNote && (
                      <div className="text-xs text-emerald-800 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200">
                        <span className="font-semibold block mb-0.5">
                          Mentor Advice & Preparation Note:
                        </span>
                        {sess.mentorFeedbackNote}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Slot: <strong className="text-slate-700">{sess.preferredSlot}</strong>
                      </span>
                      <span>Requested on: {sess.requestDate}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {sess.meetingUrl && sess.status === 'CONFIRMED' && (
                      <a
                        href={sess.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <Button
                          size="sm"
                          className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>Join Google Meet</span>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    )}
                    {sess.status === 'COMPLETED' && (
                      <Badge variant="outline" className="text-slate-600 bg-slate-100">
                        Session Concluded
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 1:1 Guidance Booking Modal */}
      {bookingMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Request 1:1 Mentorship &ndash; {bookingMentor.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {bookingMentor.currentProfession} ({bookingMentor.higherEducation})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingMentor(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Select Preferred Available Slot:
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                >
                  {bookingMentor.availableSlots?.map((slot, i) => (
                    <option key={i} value={slot}>
                      {slot}
                    </option>
                  )) || <option value="Saturday 5:00 PM IST">Saturday 5:00 PM IST</option>}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Statement of Purpose & Career Questions:
                </label>
                <textarea
                  rows={4}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Explain your academic background, exam goals (e.g. JEE, NEET, CLAT, CUET), and specific questions you would like advice on from this mentor..."
                  required
                  className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-800 bg-white"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Minimum 15 characters. Your mentor will review this before joining the call.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingMentor(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Mentorship Request</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
