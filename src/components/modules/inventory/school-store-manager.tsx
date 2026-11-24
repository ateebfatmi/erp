'use client';

import React, { useState } from 'react';
import {
  StoreItem,
  StoreOrder,
  UniformSize,
  INITIAL_STORE_CATALOG,
  INITIAL_STORE_ORDERS,
  createStoreReservation,
  markOrderCollected,
} from '@/modules/inventory/school-store';
import {
  BookOpen,
  Shirt,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Printer,
  QrCode,
  PackageCheck,
  Search,
  Filter,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface SchoolStoreManagerProps {
  viewMode?: 'admin' | 'parent' | 'student';
  currentStudent?: {
    admissionNo: string;
    studentName: string;
    gradeClass: string;
  };
}

export function SchoolStoreManager({
  viewMode = 'admin',
  currentStudent = {
    admissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    gradeClass: 'Class 10A',
  },
}: SchoolStoreManagerProps) {
  const [catalog, setCatalog] = useState<StoreItem[]>(INITIAL_STORE_CATALOG);
  const [orders, setOrders] = useState<StoreOrder[]>(INITIAL_STORE_ORDERS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Parent / Student reservation cart state
  const [cart, setCart] = useState<{
    [itemId: string]: {
      quantity: number;
      selectedSize?: UniformSize;
    };
  }>({});
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-orders' | 'all-orders'>('catalog');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<StoreOrder | null>(null);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState<StoreOrder | null>(null);
  const [quickStockDelta, setQuickStockDelta] = useState<{ [itemId: string]: number }>({});

  // Filtered catalog
  const filteredCatalog = catalog.filter((item) => {
    const matchesCat =
      selectedCategory === 'ALL' || item.itemType === selectedCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradeClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Calculate cart totals
  const cartEntries = Object.entries(cart).filter(([_, data]) => data.quantity > 0);
  const cartItemCount = cartEntries.reduce((sum, [_, data]) => sum + data.quantity, 0);
  const cartTotalAmount = cartEntries.reduce((sum, [itemId, data]) => {
    const item = catalog.find((i) => i.id === itemId);
    return sum + (item ? item.price * data.quantity : 0);
  }, 0);

  const handleAddToCart = (item: StoreItem, size?: UniformSize) => {
    setCart((prev) => {
      const existing = prev[item.id] || { quantity: 0 };
      const newQty = existing.quantity + 1;
      if (newQty > item.availableStock) {
        alert(`Cannot add more than available stock (${item.availableStock} in stock)`);
        return prev;
      }
      return {
        ...prev,
        [item.id]: {
          quantity: newQty,
          selectedSize: size || existing.selectedSize || item.sizeOptions?.[0] || undefined,
        },
      };
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing || existing.quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const handleConfirmReservation = () => {
    if (cartEntries.length === 0) return;

    try {
      const requestedItems = cartEntries.map(([itemId, data]) => ({
        itemId,
        quantity: data.quantity,
        selectedSize: data.selectedSize,
      }));

      const result = createStoreReservation({
        admissionNo: currentStudent.admissionNo,
        studentName: currentStudent.studentName,
        gradeClass: currentStudent.gradeClass,
        requestedItems,
        catalog,
        paymentStatus: 'PAID',
        pickupSlot: 'Counter B (Ground Floor - Main Atrium) • Ready for Collection',
      });

      setCatalog(result.updatedCatalog);
      setOrders([result.order, ...orders]);
      setCart({});
      setShowOrderSuccessModal(result.order);
    } catch (err: any) {
      alert(err.message || 'Error creating reservation');
    }
  };

  const handleMarkCollected = (orderId: string) => {
    const updated = markOrderCollected(orders, orderId);
    setOrders(updated);
    if (selectedOrderForSlip?.id === orderId) {
      setSelectedOrderForSlip((prev) => prev ? { ...prev, fulfillmentStatus: 'COLLECTED' } : null);
    }
  };

  const handleUpdateStock = (itemId: string) => {
    const delta = quickStockDelta[itemId] || 0;
    if (delta === 0) return;
    setCatalog((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, availableStock: Math.max(0, item.availableStock + delta) }
          : item
      )
    );
    setQuickStockDelta((prev) => ({ ...prev, [itemId]: 0 }));
  };

  // Metrics
  const totalStockItems = catalog.reduce((acc, i) => acc + i.availableStock, 0);
  const pendingPickups = orders.filter((o) => o.fulfillmentStatus === 'READY_FOR_PICKUP').length;
  const fulfilledOrders = orders.filter((o) => o.fulfillmentStatus === 'COLLECTED').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered orders for viewing
  const visibleOrders =
    viewMode === 'admin' && activeTab === 'all-orders'
      ? orders
      : orders.filter((o) => o.admissionNo === currentStudent.admissionNo);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BookOpen className="w-64 h-64 text-emerald-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Campus Bookstore & Uniform Kit Desk</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Institutional School Store & Kits</h1>
            <p className="text-sm text-emerald-200/80 max-w-2xl mt-1">
              Statutory NCERT textbook sets, certified uniform apparel bundles, and laboratory kits with verified digital pickup passes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'admin' ? (
              <div className="flex bg-emerald-950/80 p-1 rounded-xl border border-emerald-600/30">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  Inventory & Catalog
                </button>
                <button
                  onClick={() => setActiveTab('all-orders')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'all-orders'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  Distribution & Pickups ({pendingPickups})
                </button>
              </div>
            ) : (
              <div className="flex bg-emerald-950/80 p-1 rounded-xl border border-emerald-600/30">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'catalog'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  Store Catalog
                </button>
                <button
                  onClick={() => setActiveTab('my-orders')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === 'my-orders'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-300 hover:text-white'
                  }`}
                >
                  My Orders & Slips ({visibleOrders.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Available Items in Stock</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-foreground">{totalStockItems}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Across 4 standard curricula kits</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Awaiting Counter Pickup</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{pendingPickups}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Ready for verification</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Fulfilled Reservations</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{fulfilledOrders}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Successfully collected</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Value Processed</span>
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Direct institutional receipts</div>
        </div>
      </div>

      {/* Active Tab: Catalog & Reservation */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catalog listing (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search books, uniforms, classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'TEXTBOOK_BUNDLE', 'UNIFORM_SET', 'STATIONERY_LAB_KIT'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white font-medium'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cat === 'ALL'
                      ? 'All Items'
                      : cat === 'TEXTBOOK_BUNDLE'
                      ? 'Textbooks'
                      : cat === 'UNIFORM_SET'
                      ? 'Uniforms'
                      : 'Lab Kits'}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map((item) => {
                const inCart = cart[item.id]?.quantity || 0;
                const isOutOfStock = item.availableStock <= 0;

                return (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                            item.itemType === 'TEXTBOOK_BUNDLE'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                              : item.itemType === 'UNIFORM_SET'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {item.itemType === 'TEXTBOOK_BUNDLE' && <BookOpen className="w-3 h-3" />}
                          {item.itemType === 'UNIFORM_SET' && <Shirt className="w-3 h-3" />}
                          {item.itemType === 'STATIONERY_LAB_KIT' && <Sparkles className="w-3 h-3" />}
                          {item.itemType.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded text-muted-foreground">
                          {item.gradeClass}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm mt-2 text-foreground leading-snug">
                        {item.title}
                      </h3>

                      {/* Components Preview */}
                      <div className="mt-2 text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border/50">
                        <div className="font-medium text-[11px] text-foreground mb-1">
                          Includes {item.includedComponents.length} items:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] line-clamp-3">
                          {item.includedComponents.map((c, idx) => (
                            <li key={idx} className="truncate">
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Size Selector for Uniforms */}
                      {item.sizeOptions && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <span className="text-[11px] text-muted-foreground font-medium">Size:</span>
                          <div className="flex gap-1">
                            {item.sizeOptions.map((sz) => {
                              const isSelected =
                                (cart[item.id]?.selectedSize || item.sizeOptions![0]) === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() =>
                                    setCart((prev) => ({
                                      ...prev,
                                      [item.id]: {
                                        quantity: prev[item.id]?.quantity || 1,
                                        selectedSize: sz,
                                      },
                                    }))
                                  }
                                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border transition-colors ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-muted text-muted-foreground border-input hover:bg-muted/80'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {isOutOfStock ? (
                            <span className="text-destructive font-medium">Out of stock</span>
                          ) : (
                            <span>{item.availableStock} in inventory</span>
                          )}
                        </div>
                      </div>

                      {/* Cart Action */}
                      {viewMode !== 'admin' ? (
                        <div className="flex items-center gap-1.5">
                          {inCart > 0 ? (
                            <div className="flex items-center bg-muted border border-border rounded-lg p-0.5">
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold hover:bg-card text-foreground"
                              >
                                -
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-foreground">
                                {inCart}
                              </span>
                              <button
                                onClick={() => handleAddToCart(item)}
                                disabled={inCart >= item.availableStock}
                                className="w-6 h-6 flex items-center justify-center rounded text-xs font-bold hover:bg-card text-foreground disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={isOutOfStock}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Reserve Kit
                            </button>
                          )}
                        </div>
                      ) : (
                        /* Admin Fast Restock */
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="+Qty"
                            className="w-16 bg-muted border border-input rounded px-1.5 py-1 text-xs text-foreground focus:outline-none"
                            value={quickStockDelta[item.id] || ''}
                            onChange={(e) =>
                              setQuickStockDelta({
                                ...quickStockDelta,
                                [item.id]: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id)}
                            className="px-2 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs font-medium"
                          >
                            Update
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Reservation Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <h2 className="font-bold text-sm text-foreground">Reservation Cart</h2>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Student Identification */}
              <div className="mt-3 bg-muted/40 p-3 rounded-lg border border-border/60 text-xs space-y-1">
                <div className="flex justify-between text-muted-foreground">
                  <span>Student Name:</span>
                  <span className="font-semibold text-foreground">{currentStudent.studentName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Admission No:</span>
                  <span className="font-mono text-foreground">{currentStudent.admissionNo}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Standard / Division:</span>
                  <span className="text-foreground">{currentStudent.gradeClass}</span>
                </div>
              </div>

              {/* Items in Cart */}
              <div className="mt-4 space-y-3">
                {cartEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-xs">
                    <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p>No kits selected in reservation cart.</p>
                    <p className="text-[11px] mt-0.5">Click &ldquo;Reserve Kit&rdquo; on any bundle.</p>
                  </div>
                ) : (
                  cartEntries.map(([itemId, data]) => {
                    const item = catalog.find((i) => i.id === itemId);
                    if (!item) return null;
                    const lineTotal = item.price * data.quantity;

                    return (
                      <div
                        key={itemId}
                        className="flex items-start justify-between gap-2 p-2 bg-muted/30 rounded-lg border border-border/50 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{item.title}</p>
                          <div className="flex items-center gap-2 text-muted-foreground text-[11px] mt-0.5">
                            <span>₹{item.price} each</span>
                            {data.selectedSize && (
                              <span className="px-1 bg-muted rounded font-semibold text-foreground">
                                Size: {data.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-card border border-border rounded">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="px-1.5 py-0.5 text-xs hover:bg-muted font-bold"
                            >
                              -
                            </button>
                            <span className="px-1.5 text-xs font-bold">{data.quantity}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={data.quantity >= item.availableStock}
                              className="px-1.5 py-0.5 text-xs hover:bg-muted font-bold disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-foreground text-xs min-w-[50px] text-right">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Cart Summary */}
              {cartEntries.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Institutional Convenience Fee</span>
                    <span className="text-emerald-600 font-medium">₹0 (Waived)</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-sm pt-2 border-t border-border">
                    <span>Total Amount</span>
                    <span className="text-emerald-600">₹{cartTotalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-lg text-[11px] flex items-start gap-2 mt-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>
                      Immediate pickup authorization pass generated upon confirmation. Physical distribution counter Mon-Sat.
                    </span>
                  </div>

                  <button
                    onClick={handleConfirmReservation}
                    className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Confirm Kit Reservation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Statutory Store Guidelines */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 text-xs space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span>CBSE Textbook & Apparel Directives</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                As per CBSE Advisory, parents are free to procure NCERT books and uniforms from anywhere. The campus desk offers verified bundled packages at prescribed publisher prices for convenience.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Tab: Orders & Pickup Passes */}
      {(activeTab === 'my-orders' || activeTab === 'all-orders') && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {activeTab === 'all-orders'
                  ? 'All Campus Store Distribution Orders'
                  : 'My Book & Uniform Reservations'}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displaying {visibleOrders.length} confirmed orders
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Student / Admission</th>
                  <th className="p-3">Items Reserved</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Order Date</th>
                  <th className="p-3">Fulfillment Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleOrders.map((order) => {
                  const isReady = order.fulfillmentStatus === 'READY_FOR_PICKUP';
                  return (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono font-medium text-foreground">{order.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-foreground">{order.studentName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {order.admissionNo} &bull; {order.gradeClass}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5 max-w-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-foreground truncate">
                              <span className="font-semibold">{it.quantity}x</span> {it.title}
                              {it.selectedSize && (
                                <span className="ml-1 text-[10px] px-1 bg-muted rounded font-bold">
                                  [{it.selectedSize}]
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-muted-foreground">{order.orderDate}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isReady
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}
                        >
                          {isReady ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {order.fulfillmentStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrderForSlip(order)}
                            className="px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>

                          {viewMode === 'admin' && isReady && (
                            <button
                              onClick={() => handleMarkCollected(order.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Hand Over</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pickup Slip Modal */}
      {(selectedOrderForSlip || showOrderSuccessModal) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const slip = selectedOrderForSlip || showOrderSuccessModal!;
            const isReady = slip.fulfillmentStatus === 'READY_FOR_PICKUP';

            return (
              <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-foreground animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600">
                    <PackageCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">
                    Campus Store Distribution Pass
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official Kit Pickup Authorization &bull; VidyaOS Central Stores
                  </p>
                </div>

                {/* Slip Details */}
                <div className="mt-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-muted/40 p-3 rounded-xl border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">PASS / ORDER ID</span>
                      <span className="font-mono font-bold text-foreground">{slip.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">ORDER DATE</span>
                      <span className="font-medium text-foreground">{slip.orderDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">STUDENT NAME</span>
                      <span className="font-semibold text-foreground">{slip.studentName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">CLASS / ADMISSION</span>
                      <span className="text-foreground">
                        {slip.gradeClass} ({slip.admissionNo})
                      </span>
                    </div>
                  </div>

                  {/* Reserved Items */}
                  <div className="border border-border rounded-xl p-3 bg-card space-y-1.5">
                    <div className="font-semibold text-foreground text-[11px] mb-1">Items to Collect:</div>
                    {slip.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-0.5 border-b border-border/40 last:border-0">
                        <span>
                          <strong className="text-emerald-600">{it.quantity}x</strong> {it.title}
                          {it.selectedSize && (
                            <span className="ml-1 text-[10px] px-1 bg-muted rounded font-bold">
                              Size {it.selectedSize}
                            </span>
                          )}
                        </span>
                        <span className="font-bold text-foreground">₹{it.itemTotal}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-1.5 text-foreground text-xs">
                      <span>Total Paid:</span>
                      <span className="text-emerald-600">₹{slip.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Pickup Counter Location */}
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-300 block">
                      Assigned Collection Point:
                    </span>
                    <p className="text-muted-foreground">{slip.pickupCounterSlot}</p>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Present this digital QR pass or printed voucher at the counter for contactless handover.
                    </div>
                  </div>

                  {/* Simulated QR Code */}
                  <div className="flex items-center justify-center p-3 bg-muted/20 border border-dashed border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shadow-inner">
                        <QrCode className="w-14 h-14 text-slate-800" />
                      </div>
                      <div className="text-left text-[11px]">
                        <div className="font-mono font-bold text-foreground">{slip.id}</div>
                        <div className="text-muted-foreground">Digital Security Hash: Verified</div>
                        <div className="text-emerald-600 font-semibold mt-0.5">
                          Status: {slip.fulfillmentStatus}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="mt-5 flex gap-2 justify-end">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrderForSlip(null);
                      setShowOrderSuccessModal(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
