'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bus,
  ShieldAlert,
  Fuel,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Calendar,
  Gauge,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import {
  VehicleComplianceRecord,
  FuelLogEntry,
  FleetJobCard,
  INITIAL_FLEET_RECORDS,
  INITIAL_FUEL_LOGS,
  INITIAL_SERVICE_CARDS,
  checkRtoComplianceStatus,
  calculateFleetFuelEfficiency,
} from '@/modules/transport/maintenance';

export function FleetMaintenanceManager() {
  const [vehicles, setVehicles] = useState<VehicleComplianceRecord[]>(INITIAL_FLEET_RECORDS);
  const [fuelLogs, setFuelLogs] = useState<FuelLogEntry[]>(INITIAL_FUEL_LOGS);
  const [jobCards, setJobCards] = useState<FleetJobCard[]>(INITIAL_SERVICE_CARDS);
  const [activeTab, setActiveTab] = useState<'compliance' | 'fuel' | 'service'>('compliance');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Fuel Fill State
  const [fuelBusId, setFuelBusId] = useState('bus-01');
  const [fuelDate, setFuelDate] = useState('2024-11-25');
  const [fuelLiters, setFuelLiters] = useState(50);
  const [fuelCostPerL, setFuelCostPerL] = useState(89.5);
  const [fuelOdometer, setFuelOdometer] = useState(68700);

  const currentDate = '2024-11-25';
  const fuelMetrics = calculateFleetFuelEfficiency(fuelLogs);

  const handleAddFuelLog = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBus = vehicles.find((v) => v.busId === fuelBusId);
    if (!targetBus) return;

    const prevOdo = targetBus.currentOdometerKm;
    const distanceKm = Math.max(0, fuelOdometer - prevOdo);
    const mileage = fuelLiters > 0 ? Number((distanceKm / fuelLiters).toFixed(2)) : 0;
    const totalCost = fuelLiters * fuelCostPerL;

    const newLog: FuelLogEntry = {
      id: `fl-${Date.now()}`,
      busId: targetBus.busId,
      busNumber: targetBus.busNumber,
      date: fuelDate,
      litersFilled: fuelLiters,
      costPerLiter: fuelCostPerL,
      totalCost,
      previousOdometerKm: prevOdo,
      currentOdometerKm: fuelOdometer,
      calculatedMileageKmPerL: mileage,
    };

    setFuelLogs([newLog, ...fuelLogs]);
    setVehicles((prev) =>
      prev.map((v) => (v.busId === fuelBusId ? { ...v, currentOdometerKm: fuelOdometer } : v))
    );

    setActiveTab('fuel');
    setFeedback(`Logged ${fuelLiters}L fuel for ${targetBus.busNumber}. Calculated Mileage: ${mileage} km/L.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleCompleteService = (jobId: string) => {
    setJobCards((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'COMPLETED' } : j))
    );
    const job = jobCards.find((j) => j.id === jobId);
    setFeedback(`Service "${job?.serviceType.replace(/_/g, ' ')}" for ${job?.busNumber} marked COMPLETED.`);
    setTimeout(() => setFeedback(null), 4000);
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
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fleet Vehicles</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{vehicles.length} Buses</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">CNG & Diesel Commercial</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">RTO Safety Status</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {vehicles.filter((v) => checkRtoComplianceStatus(v, currentDate).isCompliant).length} / {vehicles.length}
              </h3>
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">1 Vehicle Requires Attention</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fleet Mileage</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                {fuelMetrics.averageMileageKmPerL} <span className="text-xs font-normal">km/L</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{fuelMetrics.totalKmTraveled} km logged</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Fuel className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Service Jobs</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                {jobCards.filter((j) => j.status === 'SCHEDULED').length}
              </h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Scheduled preventive checks</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'compliance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('compliance')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Supreme Court & RTO Audits
          </Button>

          <Button
            variant={activeTab === 'fuel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('fuel')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Fuel className="h-3.5 w-3.5" />
            Fuel & Telematics Logs ({fuelLogs.length})
          </Button>

          <Button
            variant={activeTab === 'service' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('service')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Wrench className="h-3.5 w-3.5" />
            Preventive Maintenance ({jobCards.length})
          </Button>
        </div>

        <Badge variant="outline" className="text-xs">
          Speed Limit Mandate: ≤ 40 km/h (Govt. of India)
        </Badge>
      </div>

      {/* TAB 1: RTO COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              const audit = checkRtoComplianceStatus(v, currentDate);

              return (
                <Card
                  key={v.busId}
                  className={`border transition-all ${
                    audit.isCompliant ? 'border-slate-200' : 'border-rose-300 bg-rose-50/20 shadow-xs'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {v.engineType}
                          </Badge>
                          <Badge
                            className={`text-[10px] ${
                              audit.isCompliant
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {audit.isCompliant ? 'RTO Compliant' : 'Safety Violation'}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-bold font-mono text-slate-900">
                          {v.busNumber}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                          Capacity: {v.seatingCapacity} Seats • Odo: {v.currentOdometerKm.toLocaleString()} km
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="space-y-1.5 divide-y divide-slate-100">
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Fitness Cert (FC):</span>
                        <span
                          className={`font-mono font-medium ${
                            v.fitnessCertificateExpiry < currentDate ? 'text-rose-600 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {v.fitnessCertificateExpiry}
                        </span>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">PUC Certificate:</span>
                        <span className="font-mono text-slate-800">{v.pucExpiry}</span>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Insurance Expiry:</span>
                        <span className="font-mono text-slate-800">{v.insuranceExpiry}</span>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Speed Governor:</span>
                        <span className="text-emerald-700 font-semibold">Certified (40 km/h)</span>
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">CCTV & Emergency Door:</span>
                        <span className={v.cctvFunctional ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-bold'}>
                          {v.cctvFunctional ? 'Functional' : 'CCTV DEFECTIVE'}
                        </span>
                      </div>
                    </div>

                    {!audit.isCompliant && (
                      <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 space-y-1 text-[11px]">
                        <strong className="block">Immediate Actions Mandated:</strong>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {audit.criticalIssues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FUEL & TELEMATICS LOGS */}
      {activeTab === 'fuel' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-slate-200 lg:col-span-1">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-blue-600" />
                Log Fuel Fill & Odometer
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAddFuelLog} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Bus *</label>
                  <select
                    value={fuelBusId}
                    onChange={(e) => setFuelBusId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    {vehicles.map((v) => (
                      <option key={v.busId} value={v.busId}>
                        {v.busNumber} ({v.engineType})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Fill Date *</label>
                    <Input
                      type="date"
                      required
                      value={fuelDate}
                      onChange={(e) => setFuelDate(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Liters (L) *</label>
                    <Input
                      type="number"
                      required
                      min={10}
                      max={200}
                      value={fuelLiters}
                      onChange={(e) => setFuelLiters(Number(e.target.value))}
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cost / Liter (₹)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={fuelCostPerL}
                      onChange={(e) => setFuelCostPerL(Number(e.target.value))}
                      className="text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Odometer *</label>
                    <Input
                      type="number"
                      required
                      value={fuelOdometer}
                      onChange={(e) => setFuelOdometer(Number(e.target.value))}
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <Button type="submit" size="sm" className="w-full text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Record Fuel Receipt
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Fuel className="h-4 w-4 text-emerald-600" />
                Fleet Fuel Audit & Efficiency Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Bus Number</th>
                      <th className="py-2.5 px-3">Liters</th>
                      <th className="py-2.5 px-3">Total Cost</th>
                      <th className="py-2.5 px-3">Distance</th>
                      <th className="py-2.5 px-3 text-right">Mileage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fuelLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono text-slate-500">{log.date}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{log.busNumber}</td>
                        <td className="py-3 px-3 font-mono">{log.litersFilled} L</td>
                        <td className="py-3 px-3 font-mono text-slate-700">₹{log.totalCost.toLocaleString()}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">
                          {log.currentOdometerKm - log.previousOdometerKm} km
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 text-sm">
                          {log.calculatedMileageKmPerL} km/L
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: PREVENTIVE MAINTENANCE JOB CARDS */}
      {activeTab === 'service' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-indigo-600" />
              Scheduled Service Job Cards & Vendor Overhaul
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Bus Number</th>
                    <th className="py-2.5 px-3">Service Overhaul Type</th>
                    <th className="py-2.5 px-3">Scheduled Date</th>
                    <th className="py-2.5 px-3">Authorized Vendor Garage</th>
                    <th className="py-2.5 px-3">Estimated Cost</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobCards.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{job.busNumber}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {job.serviceType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{job.scheduledDate}</td>
                      <td className="py-3 px-3 text-slate-600">{job.garageVendor}</td>
                      <td className="py-3 px-3 font-mono font-bold">₹{job.estimatedCost.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] ${
                            job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {job.status === 'SCHEDULED' ? (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteService(job.id)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Completed
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Archived</span>
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
    </div>
  );
}
