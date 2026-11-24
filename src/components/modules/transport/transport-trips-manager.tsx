'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bus,
  Gauge,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  Navigation,
  FileText,
  Activity,
} from 'lucide-react';
import {
  TransportTripSheet,
  FuelRefillLog,
  TripShift,
  MileageHealth,
  INITIAL_TRIP_SHEETS,
  INITIAL_FUEL_LOGS,
  dispatchTripSheet,
  concludeTripSheet,
  logFuelRefill,
} from '@/modules/transport/trip-sheets';

const MILEAGE_BADGES: Record<MileageHealth, { label: string; badge: string }> = {
  OPTIMAL: { label: 'Optimal (>= 4.5 km/L)', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ACCEPTABLE: { label: 'Acceptable (3.5 - 4.4 km/L)', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  LOW_EFFICIENCY_FLAGGED: { label: 'Low Mileage (< 3.5 km/L)', badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
};

export function TransportTripsManager() {
  const [activeTab, setActiveTab] = useState<'trips' | 'fuel'>('trips');
  const [trips, setTrips] = useState<TransportTripSheet[]>(INITIAL_TRIP_SHEETS);
  const [fuelLogs, setFuelLogs] = useState<FuelRefillLog[]>(INITIAL_FUEL_LOGS);

  // Dispatch Trip Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [busId, setBusId] = useState('BUS-03');
  const [regNo, setRegNo] = useState('UP 16 BT 5520');
  const [routeNo, setRouteNo] = useState('Route 3 (Crossing Republik / Gaur City)');
  const [shift, setShift] = useState<TripShift>('MORNING_PICKUP');
  const [driver, setDriver] = useState('Rajesh Tyagi');
  const [conductor, setConductor] = useState('Santosh Kumar');
  const [breathalyzer, setBreathalyzer] = useState<'PASS' | 'FAIL'>('PASS');
  const [startKm, setStartKm] = useState(55420);
  const [depTime, setDepTime] = useState('06:30 AM');
  const [studentsCount, setStudentsCount] = useState(36);
  const [capacity, setCapacity] = useState(40);

  // Conclude Trip Modal State
  const [concludingTrip, setConcludingTrip] = useState<TransportTripSheet | null>(null);
  const [endKm, setEndKm] = useState(0);
  const [arrTime, setArrTime] = useState('07:50 AM');

  // Fuel Modal State
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [fuelBusId, setFuelBusId] = useState('BUS-01');
  const [fuelRegNo, setFuelRegNo] = useState('UP 16 BT 4410');
  const [fuelOdometer, setFuelOdometer] = useState(42450);
  const [litres, setLitres] = useState(60);
  const [price, setPrice] = useState(89.5);
  const [billNo, setBillNo] = useState('IOCL-GREATER-NOIDA-9912');
  const [fuelDriver, setFuelDriver] = useState('Sukhwinder Singh');

  const [notification, setNotification] = useState<string | null>(null);

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrip = dispatchTripSheet({
      busId,
      registrationNo: regNo,
      routeNumber: routeNo,
      shift,
      tripDate: new Date().toISOString().split('T')[0],
      driverName: driver,
      conductorName: conductor,
      breathalyzerTest: breathalyzer,
      odometerStartKm: Number(startKm),
      departureTime: depTime,
      studentsBoardedCount: Number(studentsCount),
      busCapacity: Number(capacity),
      driverFitnessVerifiedBy: 'Security Lead R.P. Yadav',
    });

    setTrips((prev) => [newTrip, ...prev]);
    setIsDispatchModalOpen(false);

    if (newTrip.status === 'HELD_SAFETY_VIOLATION') {
      alert(`SAFETY ALERT: ${newTrip.safetyViolationReason}`);
    } else {
      setNotification(`Bus ${newTrip.busId} successfully dispatched on ${newTrip.routeNumber}.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleConcludeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concludingTrip) return;

    try {
      const finished = concludeTripSheet(concludingTrip, Number(endKm), arrTime);
      setTrips((prev) => prev.map((t) => (t.id === finished.id ? finished : t)));
      setConcludingTrip(null);
      setNotification(`Trip ${finished.id} safely concluded. Total distance run: ${finished.totalKmTravelled} km.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error concluding trip');
    }
  };

  const handleFuelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lastLog = fuelLogs.find((f) => f.busId === fuelBusId);
    const newLog = logFuelRefill({
      busId: fuelBusId,
      registrationNo: fuelRegNo,
      refillDate: new Date().toISOString().split('T')[0],
      odometerKmAtRefill: Number(fuelOdometer),
      litresFilled: Number(litres),
      pricePerLitre: Number(price),
      fuelBunkBillNo: billNo,
      driverSignOff: fuelDriver,
      previousOdometerKm: lastLog?.odometerKmAtRefill,
    });

    setFuelLogs((prev) => [newLog, ...prev]);
    setIsFuelModalOpen(false);
    setNotification(`Diesel refill logged for ${newLog.busId} (${newLog.litresFilled} L @ ₹${newLog.totalFuelCost}). Mileage: ${newLog.calculatedMileageKmPerLitre || 'N/A'} km/L.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-linear-to-r from-amber-950 via-slate-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold">
                Supreme Court Transport Norms
              </Badge>
              <Badge className="bg-emerald-500/80 text-white text-[10px] font-semibold">
                Mandatory Breathalyzer Check
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bus className="h-5 w-5 text-amber-400" />
              Daily Fleet Trip Sheet, Fuel Refill & Driver Fitness Desk
            </h1>
            <p className="text-xs text-amber-200 leading-relaxed">
              Operational bus trip dispatch console enforcing mandatory pre-trip breathalyzer alcohol verification, passenger boarding capacity caps, and automatic fuel mileage auditing.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setIsDispatchModalOpen(true)}
              className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-xs text-xs font-bold"
            >
              <Navigation className="h-4 w-4" />
              <span>Dispatch New Trip Run</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsFuelModalOpen(true)}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs text-xs font-semibold"
            >
              <Fuel className="h-4 w-4" />
              <span>Log Diesel Refill</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dispatch Sheet</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('trips')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'trips'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bus className="h-4 w-4" />
          Active Daily Trip Sheets & Dispatch Console ({trips.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fuel')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'fuel'
              ? 'border-amber-600 text-amber-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Fuel className="h-4 w-4" />
          Diesel Fuel Refills & Fleet Mileage Audit ({fuelLogs.length})
        </button>
      </div>

      {/* TAB 1: TRIP SHEETS */}
      {activeTab === 'trips' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-200">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bus className="h-4 w-4 text-amber-600" />
              Daily Bus Runs & Odometer Mileage Log &ndash; Session 2024-25
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Supreme Court mandated pre-trip breathalyzer tests, capacity limits, and start/return timestamps
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Trip ID & Route</th>
                    <th className="py-2.5 px-3">Shift & Date</th>
                    <th className="py-2.5 px-3">Driver & Conductor</th>
                    <th className="py-2.5 px-3">Breathalyzer Test</th>
                    <th className="py-2.5 px-3">Odometer & Distance</th>
                    <th className="py-2.5 px-3">Pass. / Capacity</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{trip.busId} ({trip.registrationNo})</span>
                        <span className="text-[11px] text-slate-500">{trip.routeNumber}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px] mb-1">
                          {trip.shift.replace(/_/g, ' ')}
                        </Badge>
                        <span className="block text-[11px] text-slate-400">{trip.tripDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 block">D: {trip.driverName}</span>
                        <span className="text-[11px] text-slate-500">C: {trip.conductorName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={trip.breathalyzerTest === 'PASS' ? 'success' : 'destructive'}
                          className="text-[10px] font-bold"
                        >
                          {trip.breathalyzerTest === 'PASS' ? 'PASSED (0.00% BAC)' : 'FAILED'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-slate-700 block">Start: {trip.odometerStartKm} km</span>
                        {trip.odometerEndKm ? (
                          <span className="text-slate-900 font-bold">
                            End: {trip.odometerEndKm} km (+{trip.totalKmTravelled} km)
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">In Transit</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">
                          {trip.studentsBoardedCount} / {trip.busCapacity}
                        </span>
                        <span className="block text-[10px] text-slate-400">licensed seats</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            trip.status === 'COMPLETED_SAFE'
                              ? 'success'
                              : trip.status === 'HELD_SAFETY_VIOLATION'
                              ? 'destructive'
                              : 'default'
                          }
                          className="text-[10px]"
                        >
                          {trip.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {trip.status === 'DISPATCHED_ON_ROUTE' ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              setConcludingTrip(trip);
                              setEndKm(trip.odometerStartKm + 30);
                            }}
                            className="h-7 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                          >
                            Record Return
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: FUEL LOGS */}
      {activeTab === 'fuel' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-200">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="h-4 w-4 text-emerald-600" />
              Diesel Fuel Refill & Automated Mileage Audit Log
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Audits km per litre efficiency across school bus fleet to prevent fuel leakage or engine defects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Log ID & Bus</th>
                    <th className="py-2.5 px-3">Refill Date</th>
                    <th className="py-2.5 px-3">Odometer</th>
                    <th className="py-2.5 px-3">Litres Filled</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Calculated Mileage</th>
                    <th className="py-2.5 px-3">Bill / Bunk Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fuelLogs.map((log) => {
                    const badge = MILEAGE_BADGES[log.mileageHealthStatus];
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 block">{log.busId} ({log.registrationNo})</span>
                          <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{log.refillDate}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">
                          {log.odometerKmAtRefill} km
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 font-mono">
                          {log.litresFilled} L
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-700 font-mono">
                          ₹{log.totalFuelCost.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-slate-900 block">
                              {log.calculatedMileageKmPerLitre ? `${log.calculatedMileageKmPerLitre} km/L` : 'First Fill'}
                            </span>
                            <Badge className={`text-[10px] ${badge.badge}`}>
                              {badge.label}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {log.fuelBunkBillNo}
                          <span className="block text-[10px] text-slate-400">Sign: {log.driverSignOff}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispatch Trip Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-amber-600" />
                  Dispatch School Bus Run & Mandatory Safety Check
                </h3>
                <p className="text-xs text-slate-500">
                  Supreme Court Guidelines: Zero BAC Breathalyzer & Seat Capacity Enforced
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bus Fleet ID *:</label>
                  <select
                    value={busId}
                    onChange={(e) => {
                      setBusId(e.target.value);
                      if (e.target.value === 'BUS-01') setRegNo('UP 16 BT 4410');
                      if (e.target.value === 'BUS-02') setRegNo('UP 16 BT 4412');
                      if (e.target.value === 'BUS-03') setRegNo('UP 16 BT 5520');
                    }}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="BUS-01">BUS-01 (UP 16 BT 4410)</option>
                    <option value="BUS-02">BUS-02 (UP 16 BT 4412)</option>
                    <option value="BUS-03">BUS-03 (UP 16 BT 5520)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trip Shift *:</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as TripShift)}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="MORNING_PICKUP">Morning Pickup Run</option>
                    <option value="AFTERNOON_DROP">Afternoon Drop Run</option>
                    <option value="SPECIAL_EXCURSION">Excursion / Sports Run</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Driver Name *:</label>
                  <Input
                    type="text"
                    required
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Conductor Name *:</label>
                  <Input
                    type="text"
                    required
                    value={conductor}
                    onChange={(e) => setConductor(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Breathalyzer Check Box */}
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-2">
                <span className="font-bold text-rose-950 block flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-rose-600" />
                  Mandatory Pre-Trip Driver Breathalyzer Test (0.00% Blood Alcohol Limit)
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                    <input
                      type="radio"
                      name="breathalyzer"
                      value="PASS"
                      checked={breathalyzer === 'PASS'}
                      onChange={() => setBreathalyzer('PASS')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    PASS (Negative / Fit to Drive)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-800">
                    <input
                      type="radio"
                      name="breathalyzer"
                      value="FAIL"
                      checked={breathalyzer === 'FAIL'}
                      onChange={() => setBreathalyzer('FAIL')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    FAIL (Ground Bus Immediately)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Start Odometer *:</label>
                  <Input
                    type="number"
                    required
                    value={startKm}
                    onChange={(e) => setStartKm(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Students Boarded *:</label>
                  <Input
                    type="number"
                    required
                    max={capacity}
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dep. Time *:</label>
                  <Input
                    type="text"
                    required
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDispatchModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold gap-1.5 cursor-pointer text-xs"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Authorize & Dispatch</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Conclude Trip Modal */}
      {concludingTrip && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Record Safe Return &ndash; {concludingTrip.busId}
                </h3>
                <p className="text-xs text-slate-500">{concludingTrip.routeNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setConcludingTrip(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConcludeSubmit} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Start Odometer Reading:</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {concludingTrip.odometerStartKm} km
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">End Odometer (Km) *:</label>
                <Input
                  type="number"
                  min={concludingTrip.odometerStartKm}
                  required
                  value={endKm}
                  onChange={(e) => setEndKm(Number(e.target.value))}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Actual Return Time *:</label>
                <Input
                  type="text"
                  required
                  value={arrTime}
                  onChange={(e) => setArrTime(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConcludingTrip(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer text-xs"
                >
                  Conclude Safe Run
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fuel Refill Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-emerald-600" />
                  Log Diesel Fuel Refill & Audit
                </h3>
                <p className="text-xs text-slate-500">Record bunk invoice and audit km/L fuel mileage</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFuelModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFuelSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bus Fleet ID *:</label>
                  <select
                    value={fuelBusId}
                    onChange={(e) => {
                      setFuelBusId(e.target.value);
                      if (e.target.value === 'BUS-01') setFuelRegNo('UP 16 BT 4410');
                      if (e.target.value === 'BUS-02') setFuelRegNo('UP 16 BT 4412');
                      if (e.target.value === 'BUS-03') setFuelRegNo('UP 16 BT 5520');
                    }}
                    className="w-full rounded-md border border-slate-300 py-1.5 px-2 bg-white text-slate-800 font-medium"
                  >
                    <option value="BUS-01">BUS-01 (UP 16 BT 4410)</option>
                    <option value="BUS-02">BUS-02 (UP 16 BT 4412)</option>
                    <option value="BUS-03">BUS-03 (UP 16 BT 5520)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Odometer (Km) *:</label>
                  <Input
                    type="number"
                    required
                    value={fuelOdometer}
                    onChange={(e) => setFuelOdometer(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Litres Filled *:</label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={litres}
                    onChange={(e) => setLitres(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price per Litre (₹) *:</label>
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fuel Bunk Invoice / Bill No *:</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. IOCL-NOIDA-58912"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between font-bold text-xs">
                <span className="text-emerald-950">Total Diesel Expenditure:</span>
                <span className="text-emerald-700 font-mono text-sm">
                  ₹{Math.round(litres * price).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFuelModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer text-xs"
                >
                  Record Refill & Audit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
