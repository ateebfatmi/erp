'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building,
  Bed,
  Moon,
  Utensils,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Clock,
  PlusCircle,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  HostelWing,
  DormRoom,
  NightRollCallRecord,
  INITIAL_HOSTEL_WINGS,
  INITIAL_DORM_ROOMS,
  INITIAL_NIGHT_ROLL_CALL,
  STATUTORY_MESS_MENU,
  calculateHostelOccupancy,
  canAllotBedInRoom,
} from '@/modules/facilities/hostel';

export function HostelManager() {
  const [wings, setWings] = useState<HostelWing[]>(INITIAL_HOSTEL_WINGS);
  const [rooms, setRooms] = useState<DormRoom[]>(INITIAL_DORM_ROOMS);
  const [rollCall, setRollCall] = useState<NightRollCallRecord[]>(INITIAL_NIGHT_ROLL_CALL);
  const [activeTab, setActiveTab] = useState<'wings' | 'rollCall' | 'mess' | 'allot'>('wings');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Allot Bed Form State
  const [allotStudentName, setAllotStudentName] = useState('');
  const [allotClass, setAllotClass] = useState('11-A');
  const [allotRoomId, setAllotRoomId] = useState('rm-101');

  const occupancy = calculateHostelOccupancy(wings);

  const handleUpdateRollCall = (recordId: string, status: any) => {
    setRollCall((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status,
              checkInTime: status === 'PRESENT' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
            }
          : r
      )
    );
    const item = rollCall.find((r) => r.id === recordId);
    setFeedback(`Night roll call updated for ${item?.studentName}: ${status}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAllotBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allotStudentName) return;

    const targetRoom = rooms.find((r) => r.id === allotRoomId);
    if (!targetRoom || !canAllotBedInRoom(targetRoom)) {
      alert('Selected room is already at full capacity!');
      return;
    }

    const nextBedNumber = targetRoom.allottedStudents.length + 1;
    const newStudent = {
      studentId: `std-${Date.now()}`,
      studentName: allotStudentName,
      classSection: allotClass,
      bedNumber: nextBedNumber,
    };

    setRooms((prev) =>
      prev.map((r) =>
        r.id === allotRoomId
          ? { ...r, allottedStudents: [...r.allottedStudents, newStudent] }
          : r
      )
    );

    // Update Wing occupied count
    setWings((prev) =>
      prev.map((w) =>
        w.id === targetRoom.wingId ? { ...w, occupiedBeds: w.occupiedBeds + 1 } : w
      )
    );

    // Add to night roll call
    const newRollCall: NightRollCallRecord = {
      id: `rc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      studentId: newStudent.studentId,
      studentName: newStudent.studentName,
      roomNumber: targetRoom.roomNumber,
      status: 'PRESENT',
      checkInTime: '21:00',
    };
    setRollCall([newRollCall, ...rollCall]);

    setAllotStudentName('');
    setActiveTab('wings');
    setFeedback(`Bed #${nextBedNumber} in Room ${targetRoom.roomNumber} allotted to ${newStudent.studentName}.`);
    setTimeout(() => setFeedback(null), 5000);
  };

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Boarders</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{occupancy.occupiedBeds}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Across {wings.length} Residential Wings</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bed className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{occupancy.occupancyPercentage}%</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">{occupancy.totalBeds - occupancy.occupiedBeds} Vacant Beds Left</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Night Roll Call</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                {rollCall.filter((r) => r.status === 'PRESENT').length} / {rollCall.length}
              </h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Checked In (21:30 Curfew)</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Moon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Dining & Mess</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">2,450</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Average Daily Kcal / Boarder</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Utensils className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'wings' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('wings')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Building className="h-3.5 w-3.5" />
            Dormitory Wings & Rooms
          </Button>

          <Button
            variant={activeTab === 'rollCall' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('rollCall')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Moon className="h-3.5 w-3.5" />
            Night Curfew & Roll Call ({rollCall.length})
          </Button>

          <Button
            variant={activeTab === 'mess' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('mess')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Utensils className="h-3.5 w-3.5" />
            Dining Mess Nutrition Menu
          </Button>

          <Button
            variant={activeTab === 'allot' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('allot')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Allot Boarder Bed
          </Button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Biometric RFID Access Controlled</span>
        </div>
      </div>

      {/* TAB 1: DORMITORY WINGS & ROOMS */}
      {activeTab === 'wings' && (
        <div className="space-y-6">
          {/* Wing Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wings.map((w) => {
              const pct = Math.round((w.occupiedBeds / w.totalBeds) * 100);

              return (
                <Card key={w.id} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge
                          className={`text-[10px] mb-1 font-semibold ${
                            w.genderType === 'BOYS' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {w.genderType} RESIDENCE
                        </Badge>
                        <CardTitle className="text-base text-slate-900">{w.name}</CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-0.5">
                          Warden: <strong>{w.wardenName}</strong> ({w.wardenPhone})
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold font-mono text-slate-900 block">{pct}%</span>
                        <span className="text-[11px] text-slate-500">
                          {w.occupiedBeds}/{w.totalBeds} Beds
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 text-xs">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                      <span>{w.totalRooms} Total Rooms</span>
                      <span className="text-emerald-700 font-semibold">{w.totalBeds - w.occupiedBeds} Vacant Beds Available</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Room Allotment Roster */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Active Room Occupancy & Bed Allocations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((rm) => (
                <Card key={rm.id} className="border-slate-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          Room {rm.roomNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Floor {rm.floor}
                        </Badge>
                      </div>
                      <Badge
                        className={`text-[10px] ${
                          rm.allottedStudents.length === rm.capacity
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {rm.allottedStudents.length}/{rm.capacity} Occupied
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 text-xs space-y-2">
                    <div className="space-y-1.5 divide-y divide-slate-100">
                      {rm.allottedStudents.map((std) => (
                        <div key={std.studentId} className="pt-1.5 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">
                            Bed #{std.bedNumber}: {std.studentName}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            Class {std.classSection}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NIGHT ROLL CALL */}
      {activeTab === 'rollCall' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Moon className="h-4 w-4 text-indigo-600" />
                  Night Dormitory Curfew & Biometric Roll Call Register
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Nightly verification at 21:30 hrs. Monitors campus presence, infirmary admissions, and approved weekend home gate passes.
                </CardDescription>
              </div>
              <Badge className="bg-slate-100 text-slate-800 font-mono text-xs">
                Date: {rollCall[0]?.date || 'Today'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Boarder Name</th>
                    <th className="py-2.5 px-3">Room</th>
                    <th className="py-2.5 px-3">Time Checked</th>
                    <th className="py-2.5 px-3">Curfew Status</th>
                    <th className="py-2.5 px-3">Warden Notes</th>
                    <th className="py-2.5 px-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rollCall.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-900">{r.studentName}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{r.roomNumber}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{r.checkInTime}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] ${
                            r.status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'INFIRMARY_SICK'
                              ? 'bg-amber-100 text-amber-800'
                              : r.status === 'HOME_PASS'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px] max-w-[200px] truncate">
                        {r.wardenRemarks || '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateRollCall(r.id, e.target.value)}
                          className="h-7 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT">Absent</option>
                          <option value="INFIRMARY_SICK">Infirmary Sick</option>
                          <option value="HOME_PASS">Home Pass</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: MESS NUTRITION MENU */}
      {activeTab === 'mess' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STATUTORY_MESS_MENU.map((menu, idx) => (
              <Card key={idx} className="border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-amber-600" />
                      {menu.dayOfWeek} Dining Schedule
                    </CardTitle>
                    <Badge variant="outline" className="text-amber-800 bg-amber-50 font-mono text-[11px]">
                      {menu.caloriesKcal} Kcal
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 space-y-2.5 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-blue-700">
                      Breakfast (07:00 - 08:00 AM)
                    </span>
                    <p className="mt-0.5">{menu.breakfast}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-emerald-700">
                      Lunch (12:45 - 01:45 PM)
                    </span>
                    <p className="mt-0.5">{menu.lunch}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-purple-700">
                      Evening Tea & High Snacks (05:00 - 05:45 PM)
                    </span>
                    <p className="mt-0.5">{menu.eveningSnacks}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-900 block text-[11px] uppercase text-rose-700">
                      Dinner (08:00 - 09:00 PM)
                    </span>
                    <p className="mt-0.5">{menu.dinner}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALLOT BOARDER BED */}
      {activeTab === 'allot' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Allot Residential Dormitory Bed
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Assign vacant beds to newly admitted boarders with automatic capacity increment and night roll call synchronization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAllotBed} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Prithvi Singhania"
                    value={allotStudentName}
                    onChange={(e) => setAllotStudentName(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class & Section *
                  </label>
                  <select
                    value={allotClass}
                    onChange={(e) => setAllotClass(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="11-A">Class 11-A (Science)</option>
                    <option value="11-B">Class 11-B (Commerce)</option>
                    <option value="12-A">Class 12-A (Science)</option>
                    <option value="12-B">Class 12-B (Commerce)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dormitory Room *
                  </label>
                  <select
                    value={allotRoomId}
                    onChange={(e) => setAllotRoomId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id} disabled={!canAllotBedInRoom(r)}>
                        Room {r.roomNumber} ({r.allottedStudents.length}/{r.capacity} beds) {canAllotBedInRoom(r) ? '— Vacant Bed Available' : '— FULL'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('wings')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Confirm Bed Allotment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
