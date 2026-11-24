'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Radio,
  DoorOpen,
  DoorClosed,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import {
  HardwarePunchEvent,
  processGatePunch,
  computeCampusMusterRoll,
} from '@/modules/attendance/rfid-gate';

const PRESET_PERSONS = [
  { id: 'stu-01', name: 'Aarav Mehta', type: 'student' as const, roleOrClass: 'Class 10A', uid: 'E2:80:68:5A' },
  { id: 'stu-02', name: 'Diya Kapoor', type: 'student' as const, roleOrClass: 'Class 10B', uid: 'A4:19:92:B1' },
  { id: 'stu-03', name: 'Rohan Verma', type: 'student' as const, roleOrClass: 'Class 10A', uid: 'C8:33:14:F0' },
  { id: 'emp-001', name: 'Dr. Rajeshwar Sharma', type: 'staff' as const, roleOrClass: 'Senior PGT Physics', uid: 'D1:44:88:99' },
  { id: 'emp-002', name: 'Mrs. Sunita Deshmukh', type: 'staff' as const, roleOrClass: 'PGT Mathematics', uid: 'F7:12:35:66' },
];

const INITIAL_PUNCHES: HardwarePunchEvent[] = [
  {
    id: 'p-1',
    machineId: 'GATE-NORTH-TURNSTILE-01',
    badgeUid: 'E2:80:68:5A',
    personId: 'stu-01',
    personName: 'Aarav Mehta',
    personType: 'student',
    roleOrClass: 'Class 10A',
    direction: 'IN',
    timestamp: '2026-11-24T07:48:12',
    punctualityStatus: 'ON_TIME',
    isDuplicatePassback: false,
  },
  {
    id: 'p-2',
    machineId: 'GATE-NORTH-TURNSTILE-02',
    badgeUid: 'D1:44:88:99',
    personId: 'emp-001',
    personName: 'Dr. Rajeshwar Sharma',
    personType: 'staff',
    roleOrClass: 'Senior PGT Physics',
    direction: 'IN',
    timestamp: '2026-11-24T07:35:40',
    punctualityStatus: 'ON_TIME',
    isDuplicatePassback: false,
  },
  {
    id: 'p-3',
    machineId: 'GATE-NORTH-TURNSTILE-01',
    badgeUid: 'A4:19:92:B1',
    personId: 'stu-02',
    personName: 'Diya Kapoor',
    personType: 'student',
    roleOrClass: 'Class 10B',
    direction: 'IN',
    timestamp: '2026-11-24T08:04:15',
    punctualityStatus: 'LATE',
    isDuplicatePassback: false,
  },
];

export function RfidGateSimulator() {
  const [punches, setPunches] = useState<HardwarePunchEvent[]>(INITIAL_PUNCHES);
  const [selectedPerson, setSelectedPerson] = useState(PRESET_PERSONS[2]); // Rohan Verma
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');
  const [turnstileState, setTurnstileState] = useState<'LOCKED' | 'UNLOCKED' | 'REJECTED'>('LOCKED');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const musterRoll = computeCampusMusterRoll(punches);

  const handleTapBadge = () => {
    const nowIso = new Date().toISOString();
    const result = processGatePunch(
      'GATE-NORTH-TURNSTILE-01',
      selectedPerson.uid,
      selectedPerson,
      direction,
      nowIso,
      punches
    );

    if (result.accepted) {
      setPunches([result.event, ...punches]);
      setTurnstileState('UNLOCKED');
      setAlertMsg(`Turnstile UNLOCKED: ${selectedPerson.name} checked ${direction} (${result.event.punctualityStatus})`);
      setTimeout(() => setTurnstileState('LOCKED'), 3000);
    } else {
      setPunches([result.event, ...punches]);
      setTurnstileState('REJECTED');
      setAlertMsg(result.rejectReason || 'Passback Violation');
      setTimeout(() => setTurnstileState('LOCKED'), 3500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Live Evacuation Muster Roll & Turnstile Barrier Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Inside Campus</span>
              <span className="text-xl font-bold text-slate-900">{musterRoll.totalInside} Persons</span>
              <span className="text-[10px] text-slate-500 block">Emergency Evacuation Count</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students Inside</span>
              <span className="text-xl font-bold text-emerald-700">{musterRoll.studentsInside} Students</span>
              <span className="text-[10px] text-emerald-600 block">Gate Turnstile Verified</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Faculty & Staff</span>
              <span className="text-xl font-bold text-indigo-700">{musterRoll.staffInside} Staff</span>
              <span className="text-[10px] text-indigo-600 block">Biometric Entry Verified</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`border transition-all ${
          turnstileState === 'UNLOCKED'
            ? 'bg-emerald-50 border-emerald-300'
            : turnstileState === 'REJECTED'
            ? 'bg-red-50 border-red-300'
            : 'bg-white border-slate-200'
        }`}>
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${
              turnstileState === 'UNLOCKED'
                ? 'bg-emerald-600 text-white animate-bounce'
                : turnstileState === 'REJECTED'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {turnstileState === 'UNLOCKED' ? (
                <DoorOpen className="h-5 w-5" />
              ) : (
                <DoorClosed className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Turnstile #01 Barrier</span>
              <span className={`text-base font-bold ${
                turnstileState === 'UNLOCKED'
                  ? 'text-emerald-700'
                  : turnstileState === 'REJECTED'
                  ? 'text-red-700'
                  : 'text-slate-900'
              }`}>
                {turnstileState}
              </span>
              <span className="text-[10px] text-slate-500 block">Mifare 13.56MHz Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {alertMsg && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          turnstileState === 'REJECTED'
            ? 'bg-red-50 text-red-800 border border-red-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {turnstileState === 'REJECTED' ? (
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Main Grid: Interactive Tap Tester + Live Hardware Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hardware Tap Simulator (1 col) */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="p-4 border-b border-slate-200">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Radio className="h-4 w-4 text-blue-600 animate-pulse" />
              Simulate Physical Gate Tap
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Select Person & RFID Card</label>
              <select
                value={selectedPerson.id}
                onChange={(e) => {
                  const p = PRESET_PERSONS.find((item) => item.id === e.target.value);
                  if (p) setSelectedPerson(p);
                }}
                className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900 font-medium"
              >
                {PRESET_PERSONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.roleOrClass}) &bull; UID: {p.uid}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Passage Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('IN')}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    direction === 'IN'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ENTRY (IN)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('OUT')}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all ${
                    direction === 'OUT'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  EXIT (OUT)
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div>Card UID: <strong className="font-mono text-slate-900">{selectedPerson.uid}</strong></div>
              <div>Reader: <strong className="font-mono text-blue-600">GATE-NORTH-TURNSTILE-01</strong></div>
              <div>Anti-Passback: <strong className="text-emerald-700">3-Min Debounce Armed</strong></div>
            </div>

            <Button
              size="sm"
              onClick={handleTapBadge}
              className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 shadow-xs"
            >
              Tap Card on Turnstile Sensor
            </Button>
          </CardContent>
        </Card>

        {/* Live Hardware Event Stream Table (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200">
            <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Live Gate Access Log & Turnstile Feed
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time optical beam and RFID punch telemetry stream
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {punches.length} Total Punches
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Person & Role</th>
                      <th className="py-2 px-3">Card UID</th>
                      <th className="py-2 px-3">Dir</th>
                      <th className="py-2 px-3">Punctuality / Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {punches.map((p) => (
                      <tr key={p.id} className={`hover:bg-slate-50/80 transition-colors ${
                        p.isDuplicatePassback ? 'bg-red-50/50' : ''
                      }`}>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {new Date(p.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{p.personName}</div>
                          <div className="text-[10px] text-slate-400">{p.roleOrClass} ({p.personType})</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">
                          {p.badgeUid}
                        </td>
                        <td className="py-2.5 px-3 font-bold">
                          <span className={p.direction === 'IN' ? 'text-blue-600' : 'text-amber-600'}>
                            {p.direction}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {p.isDuplicatePassback ? (
                            <Badge variant="destructive" className="text-[10px]">
                              Passback Blocked
                            </Badge>
                          ) : p.punctualityStatus === 'ON_TIME' ? (
                            <Badge variant="success" className="text-[10px]">
                              On Time
                            </Badge>
                          ) : p.punctualityStatus === 'LATE' ? (
                            <Badge variant="outline" className="text-[10px] text-amber-700 bg-amber-50 border-amber-300">
                              Late Arrival
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-slate-600">
                              Exited Campus
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
