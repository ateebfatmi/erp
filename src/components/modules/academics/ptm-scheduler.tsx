'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Users,
  MapPin,
  CalendarCheck,
  AlertCircle,
  FileText,
  XCircle,
} from 'lucide-react';
import {
  PtmSlot,
  generatePtmSlots,
  bookPtmSlot,
  cancelPtmSlot,
} from '@/modules/academics/ptm';

const BASE_SLOTS = generatePtmSlots('2024-11-30', 9, 13, 15);
// Pre-reserve a few slots for realism
BASE_SLOTS[1] = {
  ...BASE_SLOTS[1],
  isBooked: true,
  bookedByStudentId: 'std-102',
  bookedByStudentName: 'Ananya Deshmukh',
  bookedByParentName: 'Dr. Sunita Deshmukh',
  studentRollNo: '01',
  discussionNotes: 'Discussion on advanced calculus questions',
};
BASE_SLOTS[3] = {
  ...BASE_SLOTS[3],
  isBooked: true,
  bookedByStudentId: 'std-105',
  bookedByStudentName: 'Kabir Khan',
  bookedByParentName: 'Tariq Khan',
  studentRollNo: '04',
  discussionNotes: 'Reviewing physical attendance & sports balancing',
};

interface Props {
  role?: 'parent' | 'teacher';
}

export function PtmScheduler({ role = 'parent' }: Props) {
  const [slots, setSlots] = useState<PtmSlot[]>(BASE_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [parentName, setParentName] = useState('Sanjay Mehta');
  const [agenda, setAgenda] = useState('Discussion on Mathematics Olympiad & Pre-Board Preparation');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Check if current student (Aarav Mehta - std-101) holds a booking
  const myBooking = slots.find((s) => s.bookedByStudentId === 'std-101');
  const bookedSlotsCount = slots.filter((s) => s.isBooked).length;
  const availableSlotsCount = slots.filter((s) => !s.isBooked).length;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    try {
      const updated = bookPtmSlot(slots, selectedSlotId, {
        studentId: 'std-101',
        studentName: 'Aarav Mehta',
        parentName,
        studentRollNo: '14',
        discussionNotes: agenda,
      });

      setSlots(updated);
      const booked = updated.find((s) => s.slotId === selectedSlotId);
      setFeedback(`PTM appointment confirmed for ${booked?.timeRange}! Room: Room 204.`);
      setSelectedSlotId(null);
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCancel = (slotId: string) => {
    const updated = cancelPtmSlot(slots, slotId);
    setSlots(updated);
    setFeedback('Appointment cancelled. Slot reopened for other parents.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
          <Badge variant="success">Confirmed</Badge>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-indigo-600" />
              Parent-Teacher Meeting (PTM) Appointment Desk
            </h1>
            <Badge variant="success">Term 1 Periodic Review</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Saturday, 30 November 2024 &bull; 09:00 AM – 01:00 PM &bull; Class 10-A (Ms. Priya Sen, Room 204)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Date &amp; Venue</p>
              <p className="text-sm font-bold text-slate-900">Sat, 30 Nov 2024</p>
              <p className="text-[10px] text-slate-500">Room 204 (Senior Wing)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Available Windows</p>
              <p className="text-xl font-bold text-slate-900">{availableSlotsCount} Open Slots</p>
              <p className="text-[10px] text-emerald-600 font-semibold">15 mins consultation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Booked Parents</p>
              <p className="text-xl font-bold text-slate-900">{bookedSlotsCount} Confirmed</p>
              <p className="text-[10px] text-slate-500">Zero queueing delay</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${myBooking ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Your Booking</p>
              <p className="text-sm font-bold text-slate-900">
                {myBooking ? myBooking.timeRange : 'Not Reserved Yet'}
              </p>
              <p className="text-[10px] text-slate-500">
                {myBooking ? 'Confirmed with Ms. Priya' : 'Select a slot below'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmed Booking Banner if user has already booked */}
      {myBooking && (
        <Card className="border-emerald-300 bg-emerald-50/40 shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-emerald-950">Active Consultation Slot Confirmed</h3>
                  <Badge variant="success" className="text-[10px]">Pass #PTM-10A-14</Badge>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Time: <strong className="font-mono">{myBooking.timeRange}</strong> &bull; Teacher: <strong>{myBooking.teacherName}</strong> &bull; Venue: <strong>{myBooking.roomNumber}</strong>
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 italic">
                  Agenda: &ldquo;{myBooking.discussionNotes}&rdquo;
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0"
              onClick={() => handleCancel(myBooking.slotId)}
            >
              Cancel Reservation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Slot Selection Grid */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Select 15-Minute Consultation Time Window
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Click an open green slot to book your one-on-one session with the Class Teacher.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Open
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Reserved
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {slots.map((slot) => {
              const isMine = slot.bookedByStudentId === 'std-101';
              const isSelected = selectedSlotId === slot.slotId;

              if (slot.isBooked && !isMine) {
                return (
                  <div
                    key={slot.slotId}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs flex flex-col justify-between h-18 opacity-60 cursor-not-allowed"
                  >
                    <span className="font-mono text-[11px]">{slot.timeRange}</span>
                    <span className="text-[10px] italic">Reserved</span>
                  </div>
                );
              }

              if (isMine) {
                return (
                  <div
                    key={slot.slotId}
                    className="p-3 rounded-lg border-2 border-emerald-500 bg-emerald-50 text-emerald-950 text-xs flex flex-col justify-between h-18 shadow-xs"
                  >
                    <span className="font-mono font-bold text-xs">{slot.timeRange}</span>
                    <Badge variant="success" className="text-[9px] w-fit">Your Appointment</Badge>
                  </div>
                );
              }

              return (
                <button
                  key={slot.slotId}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.slotId)}
                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between h-18 transition-all text-left ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <span className="font-mono font-semibold text-xs">{slot.timeRange}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Available</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form (appears when a slot is clicked) */}
      {selectedSlotId && !myBooking && (
        <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <CardHeader className="p-4 border-b border-indigo-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                Reserve Window: {slots.find((s) => s.slotId === selectedSlotId)?.timeRange}
              </CardTitle>
              <CardDescription className="text-xs text-indigo-700">
                Consultation with Ms. Priya Sen (Room 204) &bull; Student: Aarav Mehta (Roll 14)
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => setSelectedSlotId(null)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Attending Guardian Name *</label>
                  <Input
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Discussion Agenda / Key Inquiries</label>
                  <Input
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    placeholder="e.g. Mathematics marks, board exam prep, project work"
                    className="text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" className="text-xs h-8" onClick={() => setSelectedSlotId(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8 gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirm Reservation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
