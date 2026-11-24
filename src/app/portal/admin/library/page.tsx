import React from 'react';
import { repository } from '@/lib/database/repository';
import { getVerifiedAuthContext } from '@/lib/auth/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Library, BookOpen, Search, CheckCircle2 } from 'lucide-react';

export default async function LibraryPage() {
  const auth = await getVerifiedAuthContext();
  const books = await repository.getLibraryBooks(auth.tenantId);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Library className="h-5 w-5 text-indigo-600" />
            Library Catalog & Book Circulation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ISBN tracking, rack shelf indexing, barcode checkouts, and overdue fine collection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Auto-Fine Calculator Enabled</Badge>
        </div>
      </div>

      {/* Books Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Catalogued Titles & Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">ISBN</th>
                  <th className="py-2.5 px-3">Title & Subject</th>
                  <th className="py-2.5 px-3">Author & Publisher</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Total Copies</th>
                  <th className="py-2.5 px-3">Available</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {b.isbn}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.title}</div>
                      <div className="text-[10px] text-slate-400">{b.category}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800">{b.author}</div>
                      <div className="text-[10px] text-slate-400">{b.publisher}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                      {b.shelf_location}
                    </td>
                    <td className="py-3 px-3 font-mono">{b.total_copies}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                      {b.available_copies}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="success">Available</Badge>
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
