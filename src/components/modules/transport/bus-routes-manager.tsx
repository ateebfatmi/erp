'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bus,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Phone,
  CheckCircle2,
  Navigation,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Info,
} from 'lucide-react';
import {
  TransportRouteRecord,
  RouteStopSchedule,
  INITIAL_TRANSPORT_ROUTES,
  calculateTransportFeeSlab,
  evaluateCapacityCompliance,
  addStopToRoute,
} from '@/modules/transport/routes';

export function BusRoutesManager() {
  const [routes, setRoutes] = useState<TransportRouteRecord[]>(INITIAL_TRANSPORT_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].routeId);
  const [activeTab, setActiveTab] = useState<'stops' | 'addStop' | 'slabs'>('stops');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Stop Form State
  const [newStopName, setNewStopName] = useState<string>('');
  const [newLandmark, setNewLandmark] = useState<string>('');
  const [newMorningTime, setNewMorningTime] = useState<string>('07:15 AM');
  const [newAfternoonTime, setNewAfternoonTime] = useState<string>('02:20 PM');
  const [newDistanceKm, setNewDistanceKm] = useState<number>(6.5);
  const [newStudentsCount, setNewStudentsCount] = useState<number>(4);

  const currentRoute = routes.find((r) => r.routeId === selectedRouteId) || routes[0];
  const capacityCheck = evaluateCapacityCompliance(currentRoute);
  const previewFeeSlab = calculateTransportFeeSlab(newDistanceKm);

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopName.trim()) return;

    const updatedRoute = addStopToRoute(currentRoute, {
      stopName: newStopName,
      landmark: newLandmark,
      morningPickupTime: newMorningTime,
      afternoonDropTime: newAfternoonTime,
      distanceFromSchoolKm: newDistanceKm,
      enrolledStudentsCount: newStudentsCount,
    });

    setRoutes((prev) =>
      prev.map((r) => (r.routeId === currentRoute.routeId ? updatedRoute : r))
    );

    setFeedback(`Stop "${newStopName}" added to ${currentRoute.routeName}! Distance: ${newDistanceKm} km (Fee: ₹${previewFeeSlab.monthlyFeeInr}/mo).`);
    setNewStopName('');
    setNewLandmark('');
    setActiveTab('stops');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Route Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((rt) => {
          const comp = evaluateCapacityCompliance(rt);
          const isSelected = rt.routeId === selectedRouteId;

          return (
            <div
              key={rt.routeId}
              onClick={() => setSelectedRouteId(rt.routeId)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rt.routeName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>{rt.vehicleNumber}</span>
                    <span>&bull;</span>
                    <span>{rt.stops.length} Stops</span>
                  </div>
                </div>
                {comp.isCompliant ? (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] shrink-0">
                    Compliant
                  </Badge>
                ) : (
                  <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] shrink-0">
                    Overloaded
                  </Badge>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Capacity Utilization:</span>
                <span className="font-mono font-bold text-slate-800">
                  {comp.seatsOccupied} / {comp.totalCapacity} ({comp.utilizationPercent}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overloading Safety Alert */}
      {!capacityCheck.isCompliant && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Supreme Court Safety Violation Detected</h4>
            <p className="mt-0.5">{capacityCheck.alertMessage}</p>
          </div>
        </div>
      )}

      {/* Selected Route Header Details */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{currentRoute.routeName}</h3>
                <Badge variant="outline" className="font-mono text-xs">
                  {currentRoute.vehicleNumber}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Route Span: {currentRoute.startPoint} &rarr; {currentRoute.endPoint} &bull; Total Radius: {currentRoute.totalDistanceKm} km
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Driver</span>
                  <span className="font-bold text-slate-900">
                    {currentRoute.driverName} ({currentRoute.driverPhone})
                  </span>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Attendant / Conductor</span>
                  <span className="font-bold text-slate-900">
                    {currentRoute.attendantName} ({currentRoute.attendantPhone})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('stops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'stops'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Scheduled Stops & Timetable ({currentRoute.stops.length})
        </button>
        <button
          onClick={() => setActiveTab('addStop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'addStop'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          Add Stop / Route Extension
        </button>
        <button
          onClick={() => setActiveTab('slabs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'slabs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Statutory Distance Fee Slabs
        </button>
      </div>

      {/* TAB 1: STOPS & TIMETABLE */}
      {activeTab === 'stops' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Stop Sequence, Morning Pick-Up, Afternoon Drop & Distance Tiers
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Timetable synchronized with parents' real-time tracking application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Stop Order & Name</th>
                    <th className="py-3 px-4">Landmark</th>
                    <th className="py-3 px-4">Morning Pick-Up</th>
                    <th className="py-3 px-4">Afternoon Drop</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Monthly Fee Slab</th>
                    <th className="py-3 px-4 text-right">Students Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {currentRoute.stops.map((stop, idx) => (
                    <tr key={stop.stopId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{stop.stopName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{stop.landmark}</td>
                      <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                        {stop.morningPickupTime}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-indigo-700">
                        {stop.afternoonDropTime}
                      </td>
                      <td className="py-3 px-4 font-mono">{stop.distanceFromSchoolKm} km</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-800 font-mono text-[11px]"
                        >
                          ₹{stop.monthlyFeeInr.toLocaleString('en-IN')} / mo
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {stop.enrolledStudentsCount} Students
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: ADD STOP FORM */}
      {activeTab === 'addStop' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-blue-600" />
              Add Scheduled Stop to {currentRoute.routeName}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              New stops automatically calculate the distance fee slab and verify bus capacity limits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddStop} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Designated Stop Name
                </label>
                <Input
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  placeholder="e.g. Vasant Kunj Pocket B Gate 1"
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Prominent Landmark
                </label>
                <Input
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="e.g. Near Mother Dairy Booth"
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Morning Pick-Up Time
                  </label>
                  <Input
                    value={newMorningTime}
                    onChange={(e) => setNewMorningTime(e.target.value)}
                    className="text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Afternoon Drop Time
                  </label>
                  <Input
                    value={newAfternoonTime}
                    onChange={(e) => setNewAfternoonTime(e.target.value)}
                    className="text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Distance from School (km)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newDistanceKm}
                    onChange={(e) => setNewDistanceKm(Number(e.target.value))}
                    className="text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Boarding Students Count
                  </label>
                  <Input
                    type="number"
                    value={newStudentsCount}
                    onChange={(e) => setNewStudentsCount(Number(e.target.value))}
                    className="text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Live Fee Slab Calculated Preview */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-blue-900 font-bold block">
                    {previewFeeSlab.slabTier}
                  </span>
                  <span className="text-blue-700 text-[11px]">
                    Auto-computed distance slab for fee billing
                  </span>
                </div>
                <div className="font-mono text-base font-bold text-blue-950">
                  ₹{previewFeeSlab.monthlyFeeInr.toLocaleString('en-IN')} / mo
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Stop to Route
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: STATUTORY DISTANCE FEE SLABS */}
      {activeTab === 'slabs' && (
        <Card className="border-slate-200 shadow-xs max-w-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Institutional Distance Transport Fee Matrix
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Standardized monthly slabs applied automatically based on GPS stop coordinates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Tier 1: Local Neighborhood</span>
                <span className="text-slate-500">0.0 km to 5.0 km</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono text-xs">
                ₹1,800 / month
              </Badge>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Tier 2: Mid-Range Suburb</span>
                <span className="text-slate-500">5.1 km to 10.0 km</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono text-xs">
                ₹2,400 / month
              </Badge>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Tier 3: Outer Ring</span>
                <span className="text-slate-500">10.1 km to 15.0 km</span>
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-mono text-xs">
                ₹3,000 / month
              </Badge>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">Tier 4: Extended Metropolitan</span>
                <span className="text-slate-500">Greater than 15.0 km</span>
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-mono text-xs">
                ₹3,600 / month
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
