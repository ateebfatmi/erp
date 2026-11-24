'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Send,
  UserCheck,
  ShieldAlert,
  Search,
} from 'lucide-react';
import {
  GrievanceTicket,
  GrievanceCategory,
  GrievancePriority,
  INITIAL_GRIEVANCE_TICKETS,
  calculateSlaRemainingHours,
  escalateTicketToPrincipal,
  resolveGrievanceTicket,
  filterGrievanceTickets,
} from '@/modules/communication/grievance';

interface Props {
  role?: 'parent' | 'admin';
}

export function GrievanceManager({ role = 'parent' }: Props) {
  const [tickets, setTickets] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCE_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0].id);
  const [activeTab, setActiveTab] = useState<'tickets' | 'newTicket'>('tickets');
  const [replyText, setReplyText] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Ticket State
  const [newCategory, setNewCategory] = useState<GrievanceCategory>('TRANSPORT_ROUTE');
  const [newPriority, setNewPriority] = useState<GrievancePriority>('HIGH');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  const currentTimeIso = new Date().toISOString();
  const slaInfo = calculateSlaRemainingHours(selectedTicket.slaDeadline, currentTimeIso);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newDescription) return;

    const ticketNo = `GRV-2024-${String(tickets.length + 90).padStart(3, '0')}`;
    const deadlineDate = new Date();
    deadlineDate.setHours(deadlineDate.getHours() + 48); // 48h SLA

    const newTicket: GrievanceTicket = {
      id: `grv-${Date.now()}`,
      ticketNo,
      studentId: 'std-101',
      studentName: 'Aarav Mehta',
      parentName: 'Sanjay Mehta',
      parentPhone: '+91 98112 00412',
      category: newCategory,
      priority: newPriority,
      subject: newSubject,
      description: newDescription,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      slaDeadline: deadlineDate.toISOString().replace('T', ' ').substring(0, 16),
      status: 'OPEN',
      assignedOfficer: 'Parent Redressal Cell Desk',
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderRole: 'PARENT',
          senderName: 'Sanjay Mehta',
          messageText: newDescription,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setNewSubject('');
    setNewDescription('');
    setActiveTab('tickets');
    setFeedback(`Grievance ${ticketNo} logged. 48-hour statutory resolution timer activated.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: (role === 'admin' ? 'SCHOOL_ADMIN' : 'PARENT') as any,
      senderName: role === 'admin' ? 'Redressal Officer' : 'Parent (Sanjay Mehta)',
      messageText: replyText,
      timestamp,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id ? { ...t, messages: [...t.messages, newMsg] } : t
      )
    );

    setReplyText('');
    setFeedback('Reply posted to ticket audit thread.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleEscalate = () => {
    if (!selectedTicket) return;
    const escalated = escalateTicketToPrincipal(selectedTicket, 'Parent requested direct Principal review.');
    setTickets((prev) => prev.map((t) => (t.id === escalated.id ? escalated : t)));
    setFeedback(`Ticket ${selectedTicket.ticketNo} ESCALATED directly to Principal's docket.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleResolve = () => {
    if (!selectedTicket || !resolutionText) return;
    const resolved = resolveGrievanceTicket(selectedTicket, resolutionText, 'Head of Redressal Cell');
    setTickets((prev) => prev.map((t) => (t.id === resolved.id ? resolved : t)));
    setResolutionText('');
    setFeedback(`Ticket ${selectedTicket.ticketNo} marked RESOLVED with statutory audit closure.`);
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

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'tickets' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('tickets')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <LifeBuoy className="h-3.5 w-3.5" />
            Active Tickets ({tickets.length})
          </Button>

          {role === 'parent' && (
            <Button
              variant={activeTab === 'newTicket' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('newTicket')}
              className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Raise Grievance / Inquiry
            </Button>
          )}
        </div>

        <Badge variant="outline" className="text-xs">
          CBSE Mandatory 48-Hour SLA Protocol
        </Badge>
      </div>

      {/* TAB 1: TICKETS LIST & CONVERSATION PANE */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List Column */}
          <div className="space-y-3 lg:col-span-1">
            {tickets.map((t) => {
              const isSelected = t.id === selectedTicket.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-slate-800">{t.ticketNo}</span>
                    <Badge
                      className={`text-[9px] ${
                        t.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'ESCALATED_TO_PRINCIPAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-2">
                    {t.subject}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span>{t.category.replace('_', ' ')}</span>
                    <span className="font-mono">{t.createdAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Detail & Thread Column */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedTicket.ticketNo}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-[10px]">
                        {selectedTicket.category.replace('_', ' ')}
                      </Badge>
                      <Badge
                        className={`text-[10px] ${
                          selectedTicket.priority === 'HIGH' || selectedTicket.priority === 'URGENT'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Priority: {selectedTicket.priority}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      {selectedTicket.subject}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Student: <strong>{selectedTicket.studentName}</strong> • Raised by: {selectedTicket.parentName} ({selectedTicket.parentPhone})
                    </CardDescription>
                  </div>

                  {/* SLA Countdown Timer */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Statutory SLA Deadline
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-900 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="h-3 w-3 text-blue-600" />
                      {slaInfo.isBreached ? (
                        <span className="text-rose-600">SLA Breached</span>
                      ) : (
                        <span>{slaInfo.hoursRemaining} Hours Remaining</span>
                      )}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                {/* Audit Message Thread */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {selectedTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border ${
                        m.senderRole === 'PARENT'
                          ? 'bg-slate-50 border-slate-200 mr-8'
                          : m.senderRole === 'PRINCIPAL'
                          ? 'bg-rose-50 border-rose-200 ml-8'
                          : 'bg-blue-50/70 border-blue-200 ml-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900">{m.senderName}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{m.timestamp}</span>
                      </div>
                      <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                        {m.messageText}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reply Composer */}
                {selectedTicket.status !== 'RESOLVED' && (
                  <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type response or inquiry update..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="text-xs h-9"
                      />
                      <Button type="submit" size="sm" className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white shrink-0">
                        <Send className="h-3.5 w-3.5 mr-1" /> Send
                      </Button>
                    </div>
                  </form>
                )}

                {/* Admin Actions */}
                {role === 'admin' && selectedTicket.status !== 'RESOLVED' && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Administrative Redressal Actions</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEscalate}
                        className="text-xs h-7 text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Escalate to Principal
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Official resolution summary for parent..."
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        className="text-xs h-8"
                      />
                      <Button
                        size="sm"
                        onClick={handleResolve}
                        disabled={!resolutionText}
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                      >
                        Resolve Ticket
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: RAISE NEW GRIEVANCE (PARENT) */}
      {activeTab === 'newTicket' && role === 'parent' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Lodge Formal Parental Grievance / Inquiry
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              CBSE statutory compliance: All tickets logged are monitored under 48-hour SLA resolution timeframes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grievance Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="TRANSPORT_ROUTE">Transport & Bus Route</option>
                    <option value="ACADEMIC_PROGRESS">Academics & Classroom Teaching</option>
                    <option value="ACCOUNTS_FEE">Fee Collections & Receipts</option>
                    <option value="HEALTH_SAFETY">Student Health, Hygiene & Safety</option>
                    <option value="FACILITY_CANTEEN">Hostel & Canteen Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="NORMAL">Normal Priority (48-hr SLA)</option>
                    <option value="HIGH">High Priority (24-hr SLA)</option>
                    <option value="URGENT">Urgent Escalation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Summary *
                </label>
                <Input
                  required
                  placeholder="e.g. Inquiry regarding change in afternoon bus route timing"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="text-xs h-8"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Grievance Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide complete facts, dates, route numbers, or teacher references..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('tickets')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Submit Grievance Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
