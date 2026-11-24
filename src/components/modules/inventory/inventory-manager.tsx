'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Boxes,
  AlertTriangle,
  TrendingDown,
  ShoppingCart,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import {
  SchoolAsset,
  StockItem,
  calculateDepreciationSchedule,
  analyzeStockHealth,
  STATUTORY_DEPRECIATION_RATES,
} from '@/modules/inventory/depreciation';

const INITIAL_ASSETS: SchoolAsset[] = [
  {
    id: 'AST-2023-089',
    name: 'Smart Interactive Flat Panel 75" (4K)',
    category: 'IT_EQUIPMENT',
    purchaseDate: '2023-04-15',
    purchaseCost: 145000,
    residualValue: 7250,
    usefulLifeYears: 3,
    depreciationMethod: 'WDV',
    wdvRatePercent: 40,
    location: 'Senior Wing - Room 204',
  },
  {
    id: 'AST-2022-014',
    name: 'Physics Lab Optical Bench Sets (Pack of 12)',
    category: 'LAB_APPARATUS',
    purchaseDate: '2022-07-10',
    purchaseCost: 85000,
    residualValue: 4250,
    usefulLifeYears: 10,
    depreciationMethod: 'WDV',
    wdvRatePercent: 15,
    location: 'CV Raman Physics Lab',
  },
  {
    id: 'AST-2021-042',
    name: 'Ergonomic Dual Wooden Desks (50 Sets)',
    category: 'FURNITURE',
    purchaseDate: '2021-03-25',
    purchaseCost: 180000,
    residualValue: 9000,
    usefulLifeYears: 10,
    depreciationMethod: 'SLM',
    wdvRatePercent: 10,
    location: 'Middle Block Grade 7 & 8',
  },
  {
    id: 'AST-2020-003',
    name: 'Tata Starbus 42-Seater (DL-1P-9842)',
    category: 'FLEET_VEHICLE',
    purchaseDate: '2020-09-01',
    purchaseCost: 2650000,
    residualValue: 132500,
    usefulLifeYears: 8,
    depreciationMethod: 'WDV',
    wdvRatePercent: 30,
    location: 'School Bus Bay #4',
  },
];

const INITIAL_STOCKS: StockItem[] = [
  {
    id: 'STK-EXAM-01',
    name: 'A4 Examination Answer Booklets (16 Pages, Watermarked)',
    category: 'Exam Stationery',
    currentStock: 480,
    unit: 'booklets',
    avgDailyUsage: 120,
    leadTimeDays: 7,
    safetyStock: 300,
    maxStockLevel: 5000,
    unitCostRupees: 14,
  },
  {
    id: 'STK-LAB-04',
    name: 'Hydrochloric Acid HCl 35% Pure AR Grade',
    category: 'Chemistry Consumables',
    currentStock: 4,
    unit: 'litres',
    avgDailyUsage: 1.5,
    leadTimeDays: 4,
    safetyStock: 6,
    maxStockLevel: 30,
    unitCostRupees: 420,
  },
  {
    id: 'STK-IT-12',
    name: 'Cat6 Shielded Ethernet Patch Cords (3m)',
    category: 'Network Infrastructure',
    currentStock: 35,
    unit: 'cords',
    avgDailyUsage: 2,
    leadTimeDays: 5,
    safetyStock: 15,
    maxStockLevel: 100,
    unitCostRupees: 180,
  },
  {
    id: 'STK-MED-02',
    name: 'Infirmary Sterile Dressing & Bandage Kits',
    category: 'Health & Medical',
    currentStock: 65,
    unit: 'kits',
    avgDailyUsage: 3,
    leadTimeDays: 3,
    safetyStock: 20,
    maxStockLevel: 150,
    unitCostRupees: 95,
  },
];

export function InventoryManager() {
  const [activeTab, setActiveTab] = useState<'ASSETS' | 'CONSUMABLES'>('ASSETS');
  const [assets, setAssets] = useState<SchoolAsset[]>(INITIAL_ASSETS);
  const [stocks, setStocks] = useState<StockItem[]>(INITIAL_STOCKS);
  const [selectedAssetForSchedule, setSelectedAssetForSchedule] = useState<SchoolAsset | null>(null);
  const [raisedPoNotification, setRaisedPoNotification] = useState<string | null>(null);

  // Totals
  const totalAssetPurchaseValue = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
  const criticalStockCount = stocks.filter((s) => analyzeStockHealth(s).healthStatus === 'CRITICAL').length;
  const reorderNeededCount = stocks.filter((s) => analyzeStockHealth(s).healthStatus === 'REORDER_NEEDED').length;

  const handleRaisePurchaseOrder = (item: StockItem) => {
    const analysis = analyzeStockHealth(item);
    const orderQty = analysis.suggestedReorderQuantity || 500;
    const estCost = analysis.estimatedReorderCost || orderQty * item.unitCostRupees;

    // Simulate instant PO Generation
    setRaisedPoNotification(
      `PO-2024-${Math.floor(1000 + Math.random() * 9000)} generated for ${orderQty} ${item.unit} of "${item.name}" (Est: ₹${estCost.toLocaleString('en-IN')}). Vendor dispatch notified!`
    );

    // Replenish stock state for demonstration
    setStocks((prev) =>
      prev.map((s) =>
        s.id === item.id
          ? { ...s, currentStock: s.currentStock + orderQty }
          : s
      )
    );

    setTimeout(() => {
      setRaisedPoNotification(null);
    }, 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Notification */}
      {raisedPoNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-800 text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <span>{raisedPoNotification}</span>
          </div>
          <Badge variant="success">Dispatched</Badge>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Gross Asset Value</p>
              <p className="text-lg font-bold text-slate-900">₹{totalAssetPurchaseValue.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Depreciation Model</p>
              <p className="text-sm font-bold text-slate-900">Schedule II (IT Rules)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${criticalStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Stockout Alert</p>
              <p className="text-lg font-bold text-slate-900">{criticalStockCount} Critical</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Reorder Recommended</p>
              <p className="text-lg font-bold text-slate-900">{reorderNeededCount} Consumables</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ASSETS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'ASSETS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Institutional Fixed Assets & Depreciation
        </button>
        <button
          onClick={() => setActiveTab('CONSUMABLES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'CONSUMABLES'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="h-4 w-4" />
          Consumables & Automatic Reorder (ROP)
          {(criticalStockCount > 0 || reorderNeededCount > 0) && (
            <span className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>
      </div>

      {/* TAB 1: ASSETS */}
      {activeTab === 'ASSETS' && (
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">
                  Fixed Asset Register & Book Value Ledger
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Compliant with Schedule II of Companies Act 2013 and CBSE Affiliation Byelaws.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[11px] font-mono">
                {assets.length} Registered Assets
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                    <tr>
                      <th className="py-2.5 px-3">Asset Tag & Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Purchase Date</th>
                      <th className="py-2.5 px-3">Original Cost</th>
                      <th className="py-2.5 px-3">Method & Rate</th>
                      <th className="py-2.5 px-3">Current Book Value</th>
                      <th className="py-2.5 px-3 text-right">Statutory Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assets.map((asset) => {
                      const schedule = calculateDepreciationSchedule(asset, 5);
                      const latestYear = schedule[0];
                      return (
                        <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-900">{asset.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{asset.id} • {asset.location}</p>
                          </td>
                          <td className="py-3 px-3">
                            <Badge variant="outline" className="text-[10px] font-semibold">
                              {asset.category.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-mono">
                            {new Date(asset.purchaseDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800 font-mono">
                            ₹{asset.purchaseCost.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-medium text-slate-700">
                              {asset.depreciationMethod} ({asset.depreciationMethod === 'WDV' ? `${asset.wdvRatePercent}%` : `${asset.usefulLifeYears} yrs`})
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                            ₹{latestYear.closingBookValue.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] h-7 px-2.5"
                              onClick={() => setSelectedAssetForSchedule(asset)}
                            >
                              View Schedule
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Breakdown Modal / Pane */}
          {selectedAssetForSchedule && (
            <Card className="border-indigo-200 bg-indigo-50/20 shadow-xs">
              <CardHeader className="p-4 border-b border-indigo-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-indigo-950 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    5-Year Statutory Depreciation Schedule: {selectedAssetForSchedule.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-indigo-700">
                    Method: {selectedAssetForSchedule.depreciationMethod} | Rate: {selectedAssetForSchedule.wdvRatePercent}% | Scrap Value: ₹{selectedAssetForSchedule.residualValue.toLocaleString('en-IN')}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setSelectedAssetForSchedule(null)}
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-indigo-100/50 text-indigo-900 font-semibold border-b border-indigo-200">
                      <tr>
                        <th className="py-2 px-3">Period</th>
                        <th className="py-2 px-3">Opening Book Value</th>
                        <th className="py-2 px-3">Depreciation Charged</th>
                        <th className="py-2 px-3">Closing Net Book Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100/80 bg-white">
                      {calculateDepreciationSchedule(selectedAssetForSchedule, 5).map((row) => (
                        <tr key={row.financialYear}>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{row.financialYear}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">₹{row.openingBookValue.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-red-600">-₹{row.depreciationAmount.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{row.closingBookValue.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: CONSUMABLES & REORDER */}
      {activeTab === 'CONSUMABLES' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Consumables, Buffer Stock & Automatic Reorder Alerts
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Calculates Reorder Point (ROP) = (Daily Consumption × Vendor Lead Time) + Safety Stock.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                ROP Alert Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Consumable Item</th>
                    <th className="py-2.5 px-3">Current Stock</th>
                    <th className="py-2.5 px-3">Daily Burn</th>
                    <th className="py-2.5 px-3">Reorder Point (ROP)</th>
                    <th className="py-2.5 px-3">Days Remaining</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Automated Procurement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stocks.map((stock) => {
                    const health = analyzeStockHealth(stock);
                    return (
                      <tr key={stock.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900">{stock.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{stock.category} • Unit Cost: ₹{stock.unitCostRupees}</p>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {stock.currentStock} {stock.unit}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-mono">
                          {stock.avgDailyUsage} {stock.unit}/day
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {health.reorderPoint} {stock.unit}
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className={health.urgencyDaysRemaining <= 4 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                            {health.urgencyDaysRemaining} days
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {health.healthStatus === 'CRITICAL' && (
                            <Badge variant="destructive" className="text-[10px]">
                              Critical Deficit
                            </Badge>
                          )}
                          {health.healthStatus === 'REORDER_NEEDED' && (
                            <Badge variant="outline" className="text-[10px] border-amber-300 bg-amber-50 text-amber-800">
                              Reorder Triggered
                            </Badge>
                          )}
                          {health.healthStatus === 'OPTIMAL' && (
                            <Badge variant="success" className="text-[10px]">
                              Stock Optimal
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            size="sm"
                            className="text-[11px] h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 ml-auto"
                            onClick={() => handleRaisePurchaseOrder(stock)}
                          >
                            <ShoppingCart className="h-3 w-3" />
                            Raise PO ({health.suggestedReorderQuantity || 100})
                          </Button>
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
    </div>
  );
}
