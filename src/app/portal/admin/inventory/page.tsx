import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Boxes, Plus, ShieldCheck } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: 'inv-1', name: 'Smart Classroom Projector (4K)', category: 'IT & AV Assets', quantity: 18, unit: 'units', status: 'In Service' },
  { id: 'inv-2', name: 'Physics Optical Bench Sets', category: 'Science Lab Consumables', quantity: 24, unit: 'sets', status: 'In Service' },
  { id: 'inv-3', name: 'A4 Examination Answer Booklets (16p)', category: 'Stationery', quantity: 4500, unit: 'booklets', status: 'Adequate Stock' },
  { id: 'inv-4', name: 'Student Wooden Benches (Dual Desk)', category: 'Furniture', quantity: 120, unit: 'desks', status: 'In Service' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            Inventory & Asset Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track fixed school equipment, science laboratory apparatus, and examination stationery.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 border-b border-slate-200">
          <CardTitle className="text-sm font-semibold">
            Institutional Asset Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Stock Quantity</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_INVENTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-3 px-3 text-slate-600">{item.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{item.quantity}</td>
                    <td className="py-3 px-3 text-slate-500">{item.unit}</td>
                    <td className="py-3 px-3">
                      <Badge variant="success">{item.status}</Badge>
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
