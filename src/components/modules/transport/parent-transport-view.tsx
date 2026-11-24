'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  Radio,
  UserCheck,
  Gauge,
  Sparkles,
} from 'lucide-react';
import {
  LiveBusTelematics,
  INITIAL_BUS_TELEMATICS,
  estimateTimeToArrival,
  calculateRouteProgress,
} from '@/modules/transport/parent-tracking';

export function ParentTransportView() {
  const [telematics] = useState<LiveBusTelematics>(INITIAL_BUS_TELEMATICS);
  const [activeShift, setActiveShift] = useState<'MORNING' | 'AFTERNOON'>('MORNING');
  const [feedback, setFeedback] = useState<string | null>(null);

  const etaInfo = estimateTimeToArrival(telematics.stops);
  const routeProg = calculateRouteProgress(telematics.stops);

  const handleCall = (title: string, phone: string) => {
    alert(`Initiating phone call to ${title}: ${phone}`);
  };

  const handleSos = () => {
    setFeedback('EMERGENCY SOS: School Transport Dispatcher & Campus Control Room have been alerted with live GPS coordinates.');
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-rose-600 hover:text-rose-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Vehicle Telematics Status Bar */}
      <Card className="border-slate-200 bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-md">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500 text-white font-mono text-xs flex items-center gap-1.5 font-bold">
                  <Radio className="h-3 w-3 animate-pulse" /> LIVE GPS (AIS-140)
                </Badge>
                <Badge variant="outline" className="text-white border-white/20 bg-white/10 font-mono text-xs">
                  {telematics.busNumber}
                </Badge>
                <Badge variant="outline" className="text-white border-white/20 bg-white/10 text-xs">
                  {telematics.routeId}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                {telematics.routeName}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                {telematics.currentLocationName}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/15 shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-slate-300 text-[10px] uppercase tracking-wide">
                  <Gauge className="h-3 w-3 text-emerald-400" /> Speed
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  {telematics.currentSpeedKmh} <span className="text-xs font-normal">km/h</span>
                </div>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <div className="text-center px-2">
                <div className="text-slate-300 text-[10px] uppercase tracking-wide">Ignition</div>
                <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
                  {telematics.ignitionStatus}
                </div>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <div className="text-center px-2">
                <div className="text-slate-300 text-[10px] uppercase tracking-wide">Progress</div>
                <div className="text-xl font-bold font-mono text-blue-300 mt-0.5">
                  {routeProg.progressPercentage}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ward Transit Safety Card */}
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-emerald-950">
                  {telematics.studentTransit.studentName} ({telematics.studentTransit.classSection})
                </h3>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Safely in Campus
                </Badge>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                RFID UID: <span className="font-mono">{telematics.studentTransit.rfidCardUid}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-emerald-900 border-t sm:border-t-0 sm:border-l border-emerald-200 pt-2 sm:pt-0 sm:pl-4">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">Morning Boarding</span>
              <span className="font-medium text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {telematics.studentTransit.morningSwipeTime}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase font-semibold">School Arrival</span>
              <span className="font-medium text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {telematics.studentTransit.schoolArrivalSwipeTime}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Selector & Stop Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Button
                variant={activeShift === 'MORNING' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveShift('MORNING')}
                className="text-xs h-8"
              >
                Morning Route (To School)
              </Button>
              <Button
                variant={activeShift === 'AFTERNOON' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveShift('AFTERNOON')}
                className="text-xs h-8"
              >
                Afternoon Route (Drop Home)
              </Button>
            </div>

            <span className="text-xs text-slate-500">
              5 Total Stops • 18.4 km Corridor
            </span>
          </div>

          {/* Stops List */}
          <div className="space-y-3">
            {telematics.stops.map((stop, idx) => {
              const isAssigned = stop.isStudentAssignedStop;

              return (
                <div
                  key={stop.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAssigned
                      ? 'border-blue-400 bg-blue-50/60 shadow-xs'
                      : stop.status === 'COMPLETED'
                      ? 'border-slate-200 bg-white opacity-80'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          stop.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : isAssigned
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {stop.status === 'COMPLETED' ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-sm text-slate-900">
                            {stop.name}
                          </h4>
                          {isAssigned && (
                            <Badge className="bg-blue-600 text-white text-[10px] font-semibold">
                              Your Designated Stop
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium ${
                              stop.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : stop.status === 'CURRENT_STOP'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            {stop.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            Scheduled: <strong>{activeShift === 'MORNING' ? stop.scheduledPickup : stop.scheduledDrop}</strong>
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {stop.status === 'COMPLETED' ? (
                        <span className="text-xs font-semibold text-emerald-600">Departed</span>
                      ) : stop.status === 'CURRENT_STOP' ? (
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                          <Radio className="h-3 w-3 animate-ping text-blue-600" /> At Stop
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Scheduled</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver & Support Contacts Sidebar */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Bus className="h-4 w-4 text-blue-600" />
                Crew & Vehicle Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                    Bus Driver
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{telematics.driverName}</span>
                  <span className="text-slate-500 block text-[11px] font-mono">{telematics.driverPhone}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCall('Driver', telematics.driverPhone)}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" /> Call
                </Button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                    Bus Attendant
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{telematics.attendantName}</span>
                  <span className="text-slate-500 block text-[11px] font-mono">{telematics.attendantPhone}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCall('Attendant', telematics.attendantPhone)}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" /> Call
                </Button>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSos}
                  className="w-full h-9 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 font-bold flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Emergency Transport SOS
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-1.5">
                  Sends high-priority ping to Campus Transport Office
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
