import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { CommunicationPreview } from '@/components/modules/communication/communication-preview';

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
            Dispatch urgent circulars, fee reminders, and event notices across WhatsApp Cloud API, Resend Email, and DLT SMS with real-time device previews.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">WhatsApp Official API Connected</Badge>
          <Badge variant="outline">DLT Entity Registered</Badge>
        </div>
      </div>

      {/* Interactive Communication Dispatch & Device Preview Engine */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
          Interactive Dispatcher & Live Device Simulation
        </h2>
        <CommunicationPreview />
      </div>

      {/* Broadcast History Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Recent Broadcast Dispatches & Delivery Logs
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
  );
}
