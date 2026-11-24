import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Send, MessageSquare, Mail, PhoneCall, CheckCircle2 } from 'lucide-react';

const RECENT_NOTICES = [
  {
    id: 'not-1',
    title: 'Winter Vacation Closure Notification',
    channel: 'WhatsApp & Email',
    target: 'All School Guardians',
    date: '2026-11-23',
    status: 'Delivered (98.4%)',
  },
  {
    id: 'not-2',
    title: 'CBSE Class 10 Admit Card Verification',
    channel: 'Email & In-App',
    target: 'Class 10 Parents & Students',
    date: '2026-11-21',
    status: 'Delivered (100%)',
  },
  {
    id: 'not-3',
    title: 'Urgent Weather Advisory — Bus Delay',
    channel: 'SMS & WhatsApp Broadcast',
    target: 'South Delhi Route 12 Parents',
    date: '2026-11-18',
    status: 'Delivered (99.1%)',
  },
];

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Communication Hub & Omnichannel Broadcasts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch urgent circulars, fee reminders, and event notices across WhatsApp Cloud API, Resend Email, and SMS.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">WhatsApp Official API Connected</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast History Table (2 spans) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="p-4 border-b border-slate-200">
              <CardTitle className="text-sm font-semibold">
                Recent Broadcast Dispatches & Delivery Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Notice Subject</th>
                      <th className="py-2.5 px-3">Channels</th>
                      <th className="py-2.5 px-3">Target Audience</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Delivery Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {RECENT_NOTICES.map((n) => (
                      <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {n.title}
                        </td>
                        <td className="py-3 px-3 font-medium text-blue-600">
                          {n.channel}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{n.target}</td>
                        <td className="py-3 px-3 text-slate-500">{n.date}</td>
                        <td className="py-3 px-3">
                          <Badge variant="success">{n.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Broadcast Form */}
        <div>
          <Card>
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-600" />
                Dispatch New Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Recipient Group
                </label>
                <select className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white text-slate-900">
                  <option>All School Parents (All Classes)</option>
                  <option>Class 10 Parents Only</option>
                  <option>All Teaching Faculty & Staff</option>
                  <option>Transport Route 12 Commuters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Dispatch Channels
                </label>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    WhatsApp Official Cloud API
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                    Resend Transactional Email
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    DLT Transactional SMS
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Circular Subject
                </label>
                <Input placeholder="e.g. Schedule for Annual Sports Day" className="text-xs" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Message Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type official communication text here..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2">
                <Button size="sm" className="w-full gap-1.5 bg-blue-600">
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast to 850 Recipients</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
