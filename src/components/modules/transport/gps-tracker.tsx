'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bus,
  Navigation,
  MapPin,
  Gauge,
  Fuel,
  ShieldCheck,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  Play,
  RotateCcw,
} from 'lucide-react';
import { checkSpeedCompliance, computeRouteProgress, RouteStop } from '@/modules/transport/telematics';

const INITIAL_STOPS: RouteStop[] = [
  {
    id: 'stop-1',
    name: 'Rohini Sector 14 (Origin Depo)',
    scheduledTime: '07:15 AM',
    location: { latitude: 28.7165, longitude: 77.1235 },
    studentsCount: 6,
    status: 'passed',
    actualArrival: '07:16 AM',
  },
  {
    id: 'stop-2',
    name: 'Pitampura Metro Gate 1',
    scheduledTime: '07:35 AM',
    location: { latitude: 28.6989, longitude: 77.1418 },
    studentsCount: 8,
    status: 'passed',
    actualArrival: '07:34 AM',
  },
  {
    id: 'stop-3',
    name: 'Dhaula Kuan Enclave Bus Bay',
    scheduledTime: '07:55 AM',
    location: { latitude: 28.5921, longitude: 77.1615 },
    studentsCount: 7,
    status: 'passed',
    actualArrival: '07:56 AM',
  },
  {
    id: 'stop-4',
    name: 'Munirka Metro Gate 2',
    scheduledTime: '08:08 AM',
    location: { latitude: 28.5583, longitude: 77.1742 },
    studentsCount: 5,
    status: 'current',
  },
  {
    id: 'stop-5',
    name: 'Vasant Vihar Priya Cinema',
    scheduledTime: '08:16 AM',
    location: { latitude: 28.5612, longitude: 77.1598 },
    studentsCount: 4,
    status: 'upcoming',
  },
  {
    id: 'stop-6',
    name: 'Delhi Public Global Academy (Main Gate)',
    scheduledTime: '08:25 AM',
    location: { latitude: 28.5283, longitude: 77.1528 },
    studentsCount: 0,
    status: 'upcoming',
  },
];

export function GpsFleetTracker() {
  const [stops, setStops] = useState<RouteStop[]>(INITIAL_STOPS);
  const [currentStopIndex, setCurrentStopIndex] = useState(3); // Munirka
  const [speed, setSpeed] = useState(36);
  const [fuel, setFuel] = useState(74);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const speedStatus = checkSpeedCompliance(speed, 40);
  const progress = computeRouteProgress(currentStopIndex, stops.length);

  // Total onboard: sum of students in passed stops
  const studentsOnboard = stops
    .slice(0, currentStopIndex + 1)
    .reduce((sum, s) => sum + s.studentsCount, 0);

  const handleAdvanceStop = () => {
    if (currentStopIndex < stops.length - 1) {
      const nextIndex = currentStopIndex + 1;
      const updated = stops.map((s, idx) => {
        if (idx < nextIndex) return { ...s, status: 'passed' as const };
        if (idx === nextIndex) return { ...s, status: 'current' as const };
        return { ...s, status: 'upcoming' as const };
      });
      setStops(updated);
      setCurrentStopIndex(nextIndex);
      setSpeed(Math.floor(25 + Math.random() * 15));
      setFuel((f) => Math.max(10, f - 2));
    }
  };

  const handleReset = () => {
    setStops(INITIAL_STOPS);
    setCurrentStopIndex(3);
    setSpeed(36);
    setFuel(74);
  };

  const handleSendEtaBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Real-time Telemetry Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vehicle Speed</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900">{speed}</span>
                <span className="text-xs text-slate-500">km/h</span>
              </div>
              <span className={`text-[10px] font-medium ${speedStatus.isOverspeed ? 'text-amber-600' : 'text-emerald-600'}`}>
                {speedStatus.isOverspeed ? 'Above Limit' : 'Safe Speed (STA Limit: 40)'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Fuel className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Diesel Fuel Level</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900">{fuel}%</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">Range: ~280 km</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students Picked</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-slate-900">{studentsOnboard}</span>
                <span className="text-xs text-slate-500">/ 34 Capacity</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600">82% Seated</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">AIS-140 GPS Lock</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-indigo-900">4G Telematics</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600">Latency: 450ms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Route Progression Map Card */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Route 12: South Delhi Morning Shuttle</span>
              <Badge variant="default" className="bg-amber-600 font-mono text-[10px]">DL 1P C 8492</Badge>
              <Badge variant="outline" className="text-[10px]">Driver: Ram Singh (+91 98711 23456)</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Location: Approaching Stop #{currentStopIndex + 1} ({stops[currentStopIndex]?.name}) &bull; Progress: {progress.percentage}%
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdvanceStop}
              disabled={currentStopIndex >= stops.length - 1}
              className="h-8 gap-1 text-xs"
            >
              <Play className="h-3.5 w-3.5 text-blue-600" /> Next Stop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 text-xs text-slate-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          {/* Stop Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            {stops.map((stop, idx) => (
              <div
                key={stop.id}
                className={`p-3 rounded-xl border text-xs transition-all relative ${
                  stop.status === 'current'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : stop.status === 'passed'
                    ? 'border-slate-200 bg-slate-50 text-slate-600'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                {stop.status === 'current' && (
                  <div className="absolute -top-2 left-3 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                    <Navigation className="h-2.5 w-2.5 animate-pulse" /> CURRENT
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span>Stop #{idx + 1}</span>
                  <span className="font-mono text-[10px] text-slate-500">{stop.scheduledTime}</span>
                </div>

                <div className="font-semibold text-slate-900 leading-tight mb-2 min-h-[30px]">
                  {stop.name}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/50">
                  <span className="text-slate-500">{stop.studentsCount} Students</span>
                  {stop.status === 'passed' ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Picked
                    </span>
                  ) : stop.status === 'current' ? (
                    <span className="text-amber-700 font-semibold">Arriving</span>
                  ) : (
                    <span className="text-slate-400">Waiting</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Parent WhatsApp ETA Dispatcher Callout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Parent Arrival Notification Service (WhatsApp Cloud API)
              </span>
              <span className="text-[11px] text-slate-500">
                Instantly notify parents of {stops[currentStopIndex]?.name} and remaining stops that the bus is 4 minutes away.
              </span>
            </div>
            <div className="flex items-center gap-2">
              {broadcastSent && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> WhatsApp Dispatched!
                </span>
              )}
              <Button
                size="sm"
                onClick={handleSendEtaBroadcast}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
              >
                <Send className="h-3.5 w-3.5" /> Dispatch ETA Alert
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
