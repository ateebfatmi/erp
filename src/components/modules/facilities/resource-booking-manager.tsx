'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Layers,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Cpu,
  Video,
  Monitor,
  Activity,
  Users,
} from 'lucide-react';
import {
  CampusFacility,
  FacilityReservation,
  INITIAL_CAMPUS_FACILITIES,
  INITIAL_FACILITY_BOOKINGS,
  createFacilityReservation,
  checkFacilityCollision,
} from '@/modules/facilities/resource-booking';

interface Props {
  role?: 'teacher' | 'admin';
}

export function ResourceBookingManager({ role = 'teacher' }: Props) {
  const [facilities] = useState<CampusFacility[]>(INITIAL_CAMPUS_FACILITIES);
  const [bookings, setBookings] = useState<FacilityReservation[]>(INITIAL_FACILITY_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<string>('2024-11-29');
  const [activeTab, setActiveTab] = useState<'schedule' | 'newBooking'>('schedule');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Booking Form State
  const [bookingFacilityId, setBookingFacilityId] = useState<string>('fac-01');
  const [bookingPeriod, setBookingPeriod] = useState<number>(4);
  const [bookingClass, setBookingClass] = useState<number>(12);
  const [bookingSection, setBookingSection] = useState<string>('A');
  const [bookingPurpose, setBookingPurpose] = useState<string>('');

  const dateBookings = bookings.filter((b) => b.date === selectedDate && b.status === 'CONFIRMED');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingPurpose) return;

    const facility = facilities.find((f) => f.id === bookingFacilityId);
    if (!facility) return;

    const newRes: FacilityReservation = {
      id: `res-${Date.now()}`,
      facilityId: facility.id,
      facilityName: facility.name,
      date: selectedDate,
      periodNo: bookingPeriod,
      teacherId: 'tch-01',
      teacherName: 'Smt. Ananya Sen (PGT Math)',
      classGrade: bookingClass,
      section: bookingSection,
      sessionPurpose: bookingPurpose,
      status: 'CONFIRMED',
    };

    const res = createFacilityReservation(bookings, newRes);
    if (res.success) {
      setBookings(res.updatedBookings);
      setBookingPurpose('');
      setActiveTab('schedule');
      setFeedback(`Slot confirmed! ${facility.name} reserved for Period ${bookingPeriod} on ${selectedDate}.`);
    } else {
      setFeedback(`Collision Block: ${res.errorMessage}`);
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
            feedback.includes('Collision')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.includes('Collision') ? (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Special Labs & Arenas</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{facilities.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">ATL, AV Hall, CS Lab, Sports</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bookings on Date</p>
              <h3 className="text-2xl font-bold font-mono text-indigo-600 mt-1">{dateBookings.length}</h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">{selectedDate}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available Slots</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                {facilities.length * 8 - dateBookings.length}
              </h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">Across 8 instructional periods</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Collision Protection</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">100%</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero Double-Booking Guarantee</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'schedule' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('schedule')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            Daily Facility Matrix
          </Button>

          <Button
            variant={activeTab === 'newBooking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newBooking')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Book Period Slot
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Date:</span>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs h-8 font-mono w-36"
          />
        </div>
      </div>

      {/* TAB 1: FACILITY DIRECTORY & TIMETABLE MATRIX */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((fac) => {
              const facBookings = dateBookings.filter((b) => b.facilityId === fac.id);

              return (
                <Card key={fac.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge
                            className={`text-[10px] mb-1 font-semibold ${
                              fac.category === 'STEM_LAB'
                                ? 'bg-purple-100 text-purple-800'
                                : fac.category === 'AUDITORIUM'
                                ? 'bg-amber-100 text-amber-800'
                                : fac.category === 'COMPUTER_LAB'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {fac.category.replace('_', ' ')}
                          </Badge>
                          <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                            {fac.name}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {fac.location} • Max {fac.studentCapacity} Students
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0 text-xs">
                      {/* Period Slot Grid (1 to 8) */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">
                          Period Availability on {selectedDate}:
                        </span>
                        <div className="grid grid-cols-8 gap-1.5">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => {
                            const isTaken = checkFacilityCollision(bookings, fac.id, selectedDate, p);
                            return (
                              <div
                                key={p}
                                className={`text-center py-1.5 rounded text-[11px] font-mono font-bold ${
                                  isTaken
                                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                                title={isTaken ? `Period ${p}: Booked` : `Period ${p}: Available`}
                              >
                                P{p}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Equipment Highlights */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                          Equipment & Facilities:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {fac.equipmentHighlights.map((eq, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bookings on this date */}
                      {facBookings.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Confirmed Reservations on Date:
                          </span>
                          {facBookings.map((b) => (
                            <div key={b.id} className="p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                              <span className="font-bold text-blue-600 font-mono">Period {b.periodNo}: </span>
                              <span className="text-slate-800 font-medium">Class {b.classGrade}-{b.section}</span> • {b.teacherName} ({b.sessionPurpose})
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOOK PERIOD SLOT */}
      {activeTab === 'newBooking' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Reserve Campus Facility / Lab Session
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select an open period slot for classroom experimentation, presentations, or athletics training.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Facility *
                  </label>
                  <select
                    value={bookingFacilityId}
                    onChange={(e) => setBookingFacilityId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.location.split('•')[0].trim()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instructional Period *
                  </label>
                  <select
                    value={bookingPeriod}
                    onChange={(e) => setBookingPeriod(Number(e.target.value))}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-mono"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                      <option key={p} value={p}>
                        Period {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class & Section *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={bookingClass}
                      onChange={(e) => setBookingClass(Number(e.target.value))}
                      className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    >
                      <option value={9}>Class 9</option>
                      <option value={10}>Class 10</option>
                      <option value={11}>Class 11</option>
                      <option value={12}>Class 12</option>
                    </select>
                    <select
                      value={bookingSection}
                      onChange={(e) => setBookingSection(e.target.value)}
                      className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Objective & Curriculum Topic *
                </label>
                <Input
                  required
                  placeholder="e.g. 3D Geometry Solid Curves Demonstration on Large Display"
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('schedule')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Confirm Facility Reservation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
