'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  UtensilsCrossed,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Unlock,
  PlusCircle,
  Coffee,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import {
  CanteenMenuItem,
  StudentCanteenWallet,
  CanteenTransaction,
  CANTEEN_MENU,
  INITIAL_STUDENT_WALLET,
  INITIAL_CANTEEN_TRANSACTIONS,
  processCanteenPurchase,
  rechargeWallet,
} from '@/modules/facilities/canteen';

interface Props {
  role?: 'parent' | 'admin';
}

export function CanteenManager({ role = 'parent' }: Props) {
  const [wallet, setWallet] = useState<StudentCanteenWallet>(INITIAL_STUDENT_WALLET);
  const [transactions, setTransactions] = useState<CanteenTransaction[]>(INITIAL_CANTEEN_TRANSACTIONS);
  const [menu] = useState<CanteenMenuItem[]>(CANTEEN_MENU);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [customRecharge, setCustomRecharge] = useState<number>(500);
  const [newLimit, setNewLimit] = useState<number>(wallet.dailySpendLimit);

  // Admin POS selection
  const [selectedItem, setSelectedItem] = useState<CanteenMenuItem>(menu[0]);
  const [purchaseQty, setPurchaseQty] = useState<number>(1);

  const handleUpdateLimit = (e: React.FormEvent) => {
    e.preventDefault();
    setWallet((prev) => ({ ...prev, dailySpendLimit: Number(newLimit) }));
    setFeedback(`Daily canteen allowance cap updated to ₹${newLimit} per school day.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRecharge = (amount: number) => {
    setWallet((prev) => rechargeWallet(prev, amount));
    setFeedback(`Simulated credit of ₹${amount} loaded to ${wallet.studentName}’s Smart RFID card.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePosCheckout = () => {
    const res = processCanteenPurchase(wallet, selectedItem, purchaseQty);
    if (res.success) {
      setWallet(res.updatedWallet);
      setTransactions([res.transaction, ...transactions]);
      setFeedback(`Payment Settled: ₹${res.transaction.totalAmount} deducted for ${res.transaction.itemName}. Token generated.`);
    } else {
      setTransactions([res.transaction, ...transactions]);
      setFeedback(`Transaction Blocked: ${res.errorMessage}`);
    }
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200 ${
            feedback.includes('Blocked')
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.includes('Blocked') ? (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            )}
            <span className="font-medium">{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Wallet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Digital Card Balance</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-600 mt-1">₹{wallet.balance}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{wallet.studentName} ({wallet.classSection})</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Daily Spend Cap</p>
              <h3 className="text-2xl font-bold font-mono text-slate-900 mt-1">₹{wallet.dailySpendLimit}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Parental limit / school day</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Spent Today</p>
              <h3 className="text-2xl font-bold font-mono text-indigo-600 mt-1">₹{wallet.todaySpent}</h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">₹{Math.max(0, wallet.dailySpendLimit - wallet.todaySpent)} quota remaining</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Allergen Filter</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {wallet.allergenAlerts.map((al) => (
                  <Badge key={al} variant="destructive" className="text-[10px]">
                    {al} BLOCKED
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Medical Record Synced</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PARENT MODE: CONTROLS & RECHARGE */}
      {role === 'parent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-slate-200 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Wallet Controls & Daily Cap
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Prevent overspending and control school nutrition habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleUpdateLimit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Set Max Daily Spend Allowance (₹)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={20}
                      max={500}
                      value={newLimit}
                      onChange={(e) => setNewLimit(Number(e.target.value))}
                      className="text-xs h-8"
                    />
                    <Button type="submit" size="sm" className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                      Save Limit
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Transactions exceeding this threshold in a single day will be auto-declined.
                  </p>
                </div>
              </form>

              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Quick Wallet Top-Up
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecharge(200)}
                    className="text-xs h-8 font-mono"
                  >
                    +₹200
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecharge(500)}
                    className="text-xs h-8 font-mono text-emerald-700 bg-emerald-50/50"
                  >
                    +₹500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecharge(1000)}
                    className="text-xs h-8 font-mono text-blue-700 bg-blue-50/50"
                  >
                    +₹1,000
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">Card Lock Status</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWallet((prev) => ({ ...prev, isLocked: !prev.isLocked }));
                    setFeedback(wallet.isLocked ? 'Smart Card unlocked.' : 'Smart Card locked. Purchases blocked.');
                  }}
                  className={`text-xs h-7 ${wallet.isLocked ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                  {wallet.isLocked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                  {wallet.isLocked ? 'Unlock Card' : 'Lock Card'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Canteen Transaction History */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-600" />
                Recent Canteen Purchase Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Item Purchased</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Total Cost</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono text-slate-500">{t.timestamp}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{t.itemName}</td>
                        <td className="py-3 px-3 font-mono">{t.quantity}</td>
                        <td className="py-3 px-3 font-mono font-bold">₹{t.totalAmount}</td>
                        <td className="py-3 px-3">
                          <Badge
                            className={`text-[10px] ${
                              t.status === 'SETTLED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {t.status.replace(/_/g, ' ')}
                          </Badge>
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

      {/* ADMIN MODE: CANTEEN POS TERMINAL */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* POS Terminal */}
          <Card className="border-slate-200 lg:col-span-1">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                Canteen POS Checkout Terminal
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                RFID Tap / Student Barcode Reader
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                  Scanned Student
                </span>
                <span className="font-bold text-slate-900 text-sm block">{wallet.studentName}</span>
                <span className="text-slate-500 text-[11px] font-mono">
                  RFID: {wallet.rfidCardUid} • Class {wallet.classSection}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Item *
                </label>
                <select
                  value={selectedItem.id}
                  onChange={(e) => {
                    const item = menu.find((m) => m.id === e.target.value);
                    if (item) setSelectedItem(item);
                  }}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                >
                  {menu.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — ₹{m.price} ({m.caloriesKcal} kcal)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs">
                <div>
                  <span className="font-bold text-slate-900">{selectedItem.name}</span>
                  <span className="text-slate-500 block text-[11px]">Unit Price: ₹{selectedItem.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPurchaseQty(Math.max(1, purchaseQty - 1))}
                    className="h-6 w-6 rounded bg-white border border-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold">{purchaseQty}</span>
                  <button
                    type="button"
                    onClick={() => setPurchaseQty(purchaseQty + 1)}
                    className="h-6 w-6 rounded bg-white border border-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Due:</span>
                <span className="font-mono text-emerald-600 text-base">
                  ₹{selectedItem.price * purchaseQty}
                </span>
              </div>

              <Button
                size="sm"
                onClick={handlePosCheckout}
                className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Tap RFID & Settle Payment
              </Button>
            </CardContent>
          </Card>

          {/* Menu Catalog Table */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-600" />
                Approved Healthy Canteen Menu & Nutritional Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="py-2.5 px-3">Item Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Calories</th>
                      <th className="py-2.5 px-3">Allergens</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {menu.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">{m.name}</td>
                        <td className="py-3 px-3 text-slate-600">{m.category.replace('_', ' ')}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-600">₹{m.price}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{m.caloriesKcal} kcal</td>
                        <td className="py-3 px-3">
                          {m.allergens.length > 0 ? (
                            <Badge variant="destructive" className="text-[9px]">
                              {m.allergens.join(', ')}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 text-[11px]">None</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">In Stock</Badge>
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
    </div>
  );
}
