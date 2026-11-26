'use client';

import React, { useState } from 'react';
import {
  Users,
  PhoneCall,
  Mail,
  UserCheck,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  QrCode,
  Building,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { SubTabBar, SubTabItem } from '@/components/ui/sub-tab-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export type FrontOfficeTabId = 'visitors' | 'call-logs' | 'postal' | 'enquiries';

// --- Types ---
export interface VisitorRecord {
  id: string;
  passNumber: string;
  visitorName: string;
  phone: string;
  idProof: string;
  purpose: string;
  hostPerson: string;
  hostDepartment: string;
  timeIn: string;
  timeOut?: string;
  status: 'checked_in' | 'checked_out';
}

export interface CallLogRecord {
  id: string;
  callType: 'inbound' | 'outbound';
  callerName: string;
  phone: string;
  purpose: string;
  durationMinutes: number;
  callDate: string;
  followUpDate?: string;
  notes: string;
}

export interface PostalRecord {
  id: string;
  type: 'inward' | 'outward';
  trackingNumber: string;
  courierName: string;
  senderName: string;
  receiverName: string;
  address: string;
  recordDate: string;
  status: 'received' | 'dispatched' | 'delivered';
}

export interface EnquiryRecord {
  id: string;
  enquiryNumber: string;
  studentName: string;
  parentName: string;
  phone: string;
  gradeSeeking: string;
  source: 'Walk-in' | 'Website' | 'Referral' | 'Social Media';
  enquiryDate: string;
  status: 'new' | 'contacted' | 'tour_scheduled' | 'admitted';
}

interface UnifiedFrontOfficeHubProps {
  initialTab?: FrontOfficeTabId;
}

export function UnifiedFrontOfficeHub({ initialTab = 'visitors' }: UnifiedFrontOfficeHubProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // --- Visitor State ---
  const [visitors, setVisitors] = useState<VisitorRecord[]>([
    {
      id: 'v-1',
      passNumber: 'VIS-2026-081',
      visitorName: 'Rajesh K. Singhania',
      phone: '+91 98111 22334',
      idProof: 'Aadhaar (XXXX 4129)',
      purpose: 'Parent-Principal Meeting',
      hostPerson: 'Dr. Anand Swaroop (Principal)',
      hostDepartment: 'Administration',
      timeIn: '10:15 AM',
      status: 'checked_in',
    },
    {
      id: 'v-2',
      passNumber: 'VIS-2026-080',
      visitorName: 'Sunil Kumar (CBSE Inspector)',
      phone: '+91 94220 11982',
      idProof: 'Govt Officer ID #8841',
      purpose: 'CBSE Affiliation Inspection',
      hostPerson: 'Mrs. Rekha Pathak (Vice Principal)',
      hostDepartment: 'Academics',
      timeIn: '09:30 AM',
      timeOut: '11:45 AM',
      status: 'checked_out',
    },
    {
      id: 'v-3',
      passNumber: 'VIS-2026-079',
      visitorName: 'Meenakshi Sundaram',
      phone: '+91 98450 33219',
      idProof: 'Voter ID (TN/88/441)',
      purpose: 'New Grade 11 Admission Inquiry',
      hostPerson: 'Admission Desk',
      hostDepartment: 'Admissions',
      timeIn: '09:00 AM',
      timeOut: '09:50 AM',
      status: 'checked_out',
    },
  ]);

  // Selected Visitor for Badge Printing
  const [printingVisitor, setPrintingVisitor] = useState<VisitorRecord | null>(null);

  // New Visitor Form State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    phone: '',
    idProof: '',
    purpose: '',
    hostPerson: '',
    hostDepartment: 'Administration',
  });

  const handleCreateVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.visitorName || !newVisitor.phone) return;

    const record: VisitorRecord = {
      id: `v-${Date.now()}`,
      passNumber: `VIS-2026-0${visitors.length + 82}`,
      visitorName: newVisitor.visitorName,
      phone: newVisitor.phone,
      idProof: newVisitor.idProof || 'Identity Proof Verified',
      purpose: newVisitor.purpose || 'Campus Visit',
      hostPerson: newVisitor.hostPerson || 'Administrative Officer',
      hostDepartment: newVisitor.hostDepartment,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked_in',
    };

    setVisitors([record, ...visitors]);
    setIsVisitorModalOpen(false);
    setNewVisitor({
      visitorName: '',
      phone: '',
      idProof: '',
      purpose: '',
      hostPerson: '',
      hostDepartment: 'Administration',
    });
  };

  const handleCheckoutVisitor = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              timeOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'checked_out' as const,
            }
          : v
      )
    );
  };

  // --- Call Log State ---
  const [callLogs, setCallLogs] = useState<CallLogRecord[]>([
    {
      id: 'c-1',
      callType: 'inbound',
      callerName: 'Pooja Agarwal',
      phone: '+91 98200 44321',
      purpose: 'Inquiry for Nursery 2026-27 admission forms',
      durationMinutes: 4,
      callDate: '2026-11-26',
      followUpDate: '2026-11-29',
      notes: 'Parent requested prospectus link sent on WhatsApp.',
    },
    {
      id: 'c-2',
      callType: 'outbound',
      callerName: 'Naveen Jindal (Transport Dept)',
      phone: '+91 99100 88214',
      purpose: 'RTO Bus Fitness Certificate renewal reminder',
      durationMinutes: 6,
      callDate: '2026-11-26',
      notes: 'Confirmed appointment for Bus #12 inspection on Saturday.',
    },
  ]);

  // --- Postal State ---
  const [postals, setPostals] = useState<PostalRecord[]>([
    {
      id: 'p-1',
      type: 'inward',
      trackingNumber: 'ED882194012IN',
      courierName: 'India Speed Post',
      senderName: 'CBSE Regional Office, Sector 5, Panchkula',
      receiverName: 'Principal Office',
      address: 'VidyaOS Campus, Main Road',
      recordDate: '2026-11-26',
      status: 'received',
    },
    {
      id: 'p-2',
      type: 'outward',
      trackingNumber: 'BLR77412998',
      courierName: 'BlueDart Express',
      senderName: 'Accounts Department',
      receiverName: 'EPFO Regional Office, Wazirpur',
      address: 'Bhavishya Nidhi Bhawan, New Delhi',
      recordDate: '2026-11-25',
      status: 'dispatched',
    },
  ]);

  // --- Admission Enquiries State ---
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([
    {
      id: 'enq-1',
      enquiryNumber: 'ENQ-2026-104',
      studentName: 'Aarohi Saxena',
      parentName: 'Vivek Saxena',
      phone: '+91 98711 00214',
      gradeSeeking: 'Grade 6',
      source: 'Walk-in',
      enquiryDate: '2026-11-26',
      status: 'tour_scheduled',
    },
    {
      id: 'enq-2',
      enquiryNumber: 'ENQ-2026-103',
      studentName: 'Kabir Mukherjee',
      parentName: 'Dr. Debashis Mukherjee',
      phone: '+91 98300 11982',
      gradeSeeking: 'Grade 11 (Science)',
      source: 'Website',
      enquiryDate: '2026-11-25',
      status: 'new',
    },
    {
      id: 'enq-3',
      enquiryNumber: 'ENQ-2026-102',
      studentName: 'Tanya Malhotra',
      parentName: 'Anil Malhotra',
      phone: '+91 98101 44552',
      gradeSeeking: 'Grade 1',
      source: 'Referral',
      enquiryDate: '2026-11-24',
      status: 'admitted',
    },
  ]);

  const tabs: SubTabItem[] = [
    {
      id: 'visitors',
      label: 'Visitor Pass & Gate Book',
      icon: Users,
      badge: `${visitors.filter((v) => v.status === 'checked_in').length} Inside`,
    },
    {
      id: 'call-logs',
      label: 'Phone Call Register',
      icon: PhoneCall,
      badge: `${callLogs.length} Calls`,
    },
    {
      id: 'postal',
      label: 'Postal Mail & Dispatch',
      icon: Mail,
      badge: 'Speed Post / Courier',
    },
    {
      id: 'enquiries',
      label: 'Admission Leads & CRM',
      icon: UserCheck,
      badge: 'Active CRM',
    },
  ];

  // Columns for Visitors
  const visitorColumns: DataTableColumn<VisitorRecord>[] = [
    {
      key: 'passNumber',
      header: 'Pass #',
      sortable: true,
      render: (row) => <span className="font-mono font-bold text-blue-600 text-xs">{row.passNumber}</span>,
    },
    {
      key: 'visitorName',
      header: 'Visitor Details',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block">{row.visitorName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.phone} • {row.idProof}</span>
        </div>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose & Host',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-slate-800 text-xs block">{row.purpose}</span>
          <span className="text-[10px] text-slate-500">To Meet: {row.hostPerson} ({row.hostDepartment})</span>
        </div>
      ),
    },
    {
      key: 'timeIn',
      header: 'Check-In',
      render: (row) => (
        <span className="font-mono text-xs text-slate-700 flex items-center gap-1">
          <Clock className="h-3 w-3 text-emerald-600" /> {row.timeIn}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (row) =>
        row.status === 'checked_in' ? (
          <Badge variant="indigo" className="text-[10px] font-semibold animate-pulse">
            On Campus
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-[10px]">
            Checked Out ({row.timeOut})
          </Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPrintingVisitor(row)}
            className="h-7 px-2 text-[11px] gap-1 text-slate-700 hover:text-blue-600 hover:border-blue-300"
            title="Print Gate Pass"
          >
            <Printer className="h-3 w-3 text-blue-600" /> Pass
          </Button>
          {row.status === 'checked_in' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCheckoutVisitor(row.id)}
              className="h-7 px-2 text-[11px] gap-1 text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <CheckCircle2 className="h-3 w-3 text-rose-600" /> Out
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building className="h-6 w-6 text-blue-600" />
              Front Office, Reception & Visitor Operations Suite
            </h1>
            <Badge variant="default" className="text-[11px] font-semibold py-0.5">
              Secure Gate Protocol
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Integrated campus front desk: manage visitor check-ins with QR-printed gate passes, inbound/outbound phone logs,
            postal dispatch/receive tracking, and prospective student admission CRM leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'visitors' && (
            <Button
              onClick={() => setIsVisitorModalOpen(true)}
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Visitor Check-In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Unified Tab Strip */}
      <SubTabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm"
      />

      {/* Tab 1: Visitor Gate Pass Desk */}
      {activeTab === 'visitors' && (
        <div className="space-y-4">
          <DataTable
            data={visitors}
            columns={visitorColumns}
            rowKey="id"
            searchPlaceholder="Search by visitor name, pass number, phone, or host staff..."
            exportCsvFilename="visitor_log_register"
            paginated={true}
            pageSize={10}
          />
        </div>
      )}

      {/* Tab 2: Call Log Register */}
      {activeTab === 'call-logs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-600 font-medium">
              Daily Institutional Telephone Communication Register
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {callLogs.length} Recorded Calls
            </Badge>
          </div>
          <DataTable
            data={callLogs}
            columns={[
              {
                key: 'callType',
                header: 'Type',
                render: (row) =>
                  row.callType === 'inbound' ? (
                    <Badge variant="indigo" className="gap-1 text-[10px]">
                      <ArrowDownLeft className="h-3 w-3 text-indigo-600" /> Inbound
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1 text-[10px]">
                      <ArrowUpRight className="h-3 w-3 text-amber-600" /> Outbound
                    </Badge>
                  ),
              },
              {
                key: 'callerName',
                header: 'Caller & Phone',
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 block">{row.callerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{row.phone}</span>
                  </div>
                ),
              },
              { key: 'purpose', header: 'Call Purpose & Notes', render: (row) => <span className="text-xs text-slate-700">{row.purpose}</span> },
              {
                key: 'durationMinutes',
                header: 'Duration',
                align: 'center',
                render: (row) => <span className="font-mono text-xs text-slate-600">{row.durationMinutes} mins</span>,
              },
              { key: 'callDate', header: 'Date', render: (row) => <span className="text-xs text-slate-500 font-mono">{row.callDate}</span> },
            ]}
            rowKey="id"
            exportCsvFilename="telephony_call_logs"
          />
        </div>
      )}

      {/* Tab 3: Postal Mail & Dispatch */}
      {activeTab === 'postal' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-600 font-medium">
              Statutory Postal Consignment, Courier & Dispatch Register
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {postals.length} Dispatches Recorded
            </Badge>
          </div>
          <DataTable
            data={postals}
            columns={[
              {
                key: 'type',
                header: 'Direction',
                render: (row) =>
                  row.type === 'inward' ? (
                    <Badge variant="success" className="text-[10px]">Inward (Received)</Badge>
                  ) : (
                    <Badge variant="indigo" className="text-[10px]">Outward (Dispatched)</Badge>
                  ),
              },
              {
                key: 'trackingNumber',
                header: 'Tracking / Consignment',
                render: (row) => (
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-xs block">{row.trackingNumber}</span>
                    <span className="text-[10px] text-slate-500">{row.courierName}</span>
                  </div>
                ),
              },
              {
                key: 'senderName',
                header: 'Sender & Recipient',
                render: (row) => (
                  <div className="text-xs">
                    <span className="text-slate-800 font-medium">From: {row.senderName}</span>
                    <span className="text-slate-500 block text-[11px]">To: {row.receiverName}</span>
                  </div>
                ),
              },
              { key: 'recordDate', header: 'Date', render: (row) => <span className="font-mono text-xs text-slate-500">{row.recordDate}</span> },
              {
                key: 'status',
                header: 'Status',
                render: (row) => (
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            rowKey="id"
            exportCsvFilename="postal_dispatch_register"
          />
        </div>
      )}

      {/* Tab 4: Admission Enquiries & Lead Pipeline */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-600 font-medium">
              Prospective Student Admission CRM & Follow-Up Pipeline
            </div>
            <Badge variant="default" className="font-mono text-xs">
              {enquiries.length} Active Leads
            </Badge>
          </div>
          <DataTable
            data={enquiries}
            columns={[
              {
                key: 'enquiryNumber',
                header: 'Enquiry #',
                render: (row) => <span className="font-mono font-bold text-blue-600 text-xs">{row.enquiryNumber}</span>,
              },
              {
                key: 'studentName',
                header: 'Candidate / Parent',
                render: (row) => (
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{row.studentName}</span>
                    <span className="text-[10px] text-slate-500">Parent: {row.parentName} • {row.phone}</span>
                  </div>
                ),
              },
              { key: 'gradeSeeking', header: 'Target Grade', render: (row) => <Badge variant="secondary" className="text-xs">{row.gradeSeeking}</Badge> },
              { key: 'source', header: 'Lead Source', render: (row) => <span className="text-xs text-slate-600">{row.source}</span> },
              {
                key: 'status',
                header: 'Stage',
                render: (row) => {
                  const variants: Record<string, any> = {
                    new: 'secondary',
                    contacted: 'warning',
                    tour_scheduled: 'indigo',
                    admitted: 'success',
                  };
                  return (
                    <Badge variant={variants[row.status] || 'default'} className="capitalize text-[10px] font-semibold">
                      {row.status.replace('_', ' ')}
                    </Badge>
                  );
                },
              },
            ]}
            rowKey="id"
            exportCsvFilename="admission_enquiries_crm"
          />
        </div>
      )}

      {/* Modal: New Visitor Check-In */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                New Campus Visitor Check-In
              </CardTitle>
              <button
                onClick={() => setIsVisitorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleCreateVisitor} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visitor Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newVisitor.visitorName}
                    onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      required
                      placeholder="+91 98765 00000"
                      value={newVisitor.phone}
                      onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                      className="text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ID Proof Document
                    </label>
                    <Input
                      placeholder="e.g. Aadhaar / DL"
                      value={newVisitor.idProof}
                      onChange={(e) => setNewVisitor({ ...newVisitor, idProof: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purpose of Visit *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Parent Consultation / Vendor Delivery"
                    value={newVisitor.purpose}
                    onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Host Person to Meet *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Principal / HOD Science"
                      value={newVisitor.hostPerson}
                      onChange={(e) => setNewVisitor({ ...newVisitor, hostPerson: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newVisitor.hostDepartment}
                      onChange={(e) => setNewVisitor({ ...newVisitor, hostDepartment: e.target.value })}
                      className="w-full text-xs h-9 px-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Administration">Administration</option>
                      <option value="Academics">Academics</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Accounts">Accounts</option>
                      <option value="Transport">Transport</option>
                    </select>
                  </div>
                </div>
                <div className="pt-3 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVisitorModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-blue-600 text-white text-xs font-semibold">
                    Issue Gate Pass
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal: Visitor Gate Badge Printable View */}
      {printingVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <Card className="w-full max-w-sm bg-white shadow-2xl border-slate-300">
            <CardHeader className="border-b border-slate-200 pb-3 flex flex-row items-center justify-between bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-blue-600" />
                Visitor Campus Gate Badge
              </CardTitle>
              <button
                onClick={() => setPrintingVisitor(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4">
              <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl space-y-3 bg-slate-50/50">
                <div className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                  DELHI PUBLIC GLOBAL ACADEMY
                </div>
                <div className="font-mono text-xs font-bold bg-blue-100 text-blue-900 py-1 rounded">
                  {printingVisitor.passNumber}
                </div>
                <div className="text-base font-bold text-slate-900">
                  {printingVisitor.visitorName}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {printingVisitor.phone}
                </div>
                <div className="bg-white p-2 border border-slate-200 rounded text-left text-xs space-y-1">
                  <div><strong>Host:</strong> {printingVisitor.hostPerson}</div>
                  <div><strong>Dept:</strong> {printingVisitor.hostDepartment}</div>
                  <div><strong>Purpose:</strong> {printingVisitor.purpose}</div>
                  <div><strong>Time In:</strong> {printingVisitor.timeIn}</div>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  Please return this badge at Gate #1 upon exit.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrintingVisitor(null)}
                  className="flex-1 text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.print()}
                  className="flex-1 bg-blue-600 text-white text-xs gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Badge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
