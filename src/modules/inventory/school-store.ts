/**
 * Campus Bookstore & School Uniform Kit Distribution Engine
 * Manages institutional textbook sets, uniform sizing allocations,
 * student kit reservations, counter pickups, and inventory fulfillment.
 */

export type StoreItemType = 'TEXTBOOK_BUNDLE' | 'UNIFORM_SET' | 'STATIONERY_LAB_KIT';
export type UniformSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type FulfillmentStatus = 'RESERVED' | 'READY_FOR_PICKUP' | 'COLLECTED';

export interface StoreItem {
  id: string;
  itemType: StoreItemType;
  title: string;
  gradeClass: string;
  price: number;
  availableStock: number;
  includedComponents: string[];
  sizeOptions?: UniformSize[];
}

export interface StoreOrderItem {
  itemId: string;
  title: string;
  quantity: number;
  selectedSize?: UniformSize;
  unitPrice: number;
  itemTotal: number;
}

export interface StoreOrder {
  id: string;
  admissionNo: string;
  studentName: string;
  gradeClass: string;
  items: StoreOrderItem[];
  totalAmount: number;
  orderDate: string;
  paymentStatus: 'PAID' | 'PAY_AT_COUNTER';
  fulfillmentStatus: FulfillmentStatus;
  pickupCounterSlot: string; // e.g. "Counter B (North Wing) - 10:00 AM to 12:00 PM"
}

/**
 * Creates and confirms a student bookstore or uniform kit reservation
 */
export function createStoreReservation(params: {
  admissionNo: string;
  studentName: string;
  gradeClass: string;
  requestedItems: Array<{ itemId: string; quantity: number; selectedSize?: UniformSize }>;
  catalog: StoreItem[];
  paymentStatus?: 'PAID' | 'PAY_AT_COUNTER';
  pickupSlot?: string;
}): {
  order: StoreOrder;
  updatedCatalog: StoreItem[];
} {
  const orderItems: StoreOrderItem[] = [];
  let totalAmount = 0;
  const nextCatalog = [...params.catalog];

  for (const req of params.requestedItems) {
    const catalogIndex = nextCatalog.findIndex((i) => i.id === req.itemId);
    if (catalogIndex === -1) {
      throw new Error(`Item ${req.itemId} not found in school store catalog`);
    }

    const item = nextCatalog[catalogIndex];
    if (item.availableStock < req.quantity) {
      throw new Error(`Insufficient stock for "${item.title}". Only ${item.availableStock} kits remaining.`);
    }

    // Decrement stock
    nextCatalog[catalogIndex] = {
      ...item,
      availableStock: item.availableStock - req.quantity,
    };

    const itemTotal = item.price * req.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      itemId: item.id,
      title: item.title,
      quantity: req.quantity,
      selectedSize: req.selectedSize,
      unitPrice: item.price,
      itemTotal,
    });
  }

  const orderId = `ORD-STORE-${Date.now().toString().slice(-6)}`;

  const order: StoreOrder = {
    id: orderId,
    admissionNo: params.admissionNo,
    studentName: params.studentName,
    gradeClass: params.gradeClass,
    items: orderItems,
    totalAmount,
    orderDate: new Date().toISOString().split('T')[0],
    paymentStatus: params.paymentStatus || 'PAID',
    fulfillmentStatus: 'READY_FOR_PICKUP',
    pickupCounterSlot: params.pickupSlot || 'Counter A (Admin Block Basement) &bull; Mon-Sat 09:00 AM - 02:00 PM',
  };

  return { order, updatedCatalog: nextCatalog };
}

/**
 * Marks a store kit reservation as collected at the distribution counter
 */
export function markOrderCollected(
  orders: StoreOrder[],
  orderId: string
): StoreOrder[] {
  return orders.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: 'COLLECTED' } : o));
}

/**
 * Pre-seeded School Store Catalog
 */
export const INITIAL_STORE_CATALOG: StoreItem[] = [
  {
    id: 'kit-txt-10',
    itemType: 'TEXTBOOK_BUNDLE',
    title: 'Class 10 Complete NCERT & Reference Textbook Set',
    gradeClass: 'Class 10',
    price: 3450,
    availableStock: 120,
    includedComponents: [
      'NCERT Mathematics Standard',
      'NCERT Science (Physics, Chemistry, Biology)',
      'NCERT India & Contemporary World II',
      'NCERT First Flight & Footprints without Feet',
      'NCERT Sparsh & Sanchayan (Hindi B)',
      'Laboratory Practical Manuals & Graph Pad',
    ],
  },
  {
    id: 'kit-uni-summer',
    itemType: 'UNIFORM_SET',
    title: 'School Summer Regular Uniform Set (2 Polo Shirts + 2 Trousers)',
    gradeClass: 'All Classes',
    price: 2600,
    availableStock: 85,
    sizeOptions: ['S', 'M', 'L', 'XL'],
    includedComponents: [
      '2x Navy Monogrammed Breathable Polos',
      '2x Tailored Grey School Trousers',
      '1x Official Striped School Tie',
      '1x Metal Crest School Belt',
      '2x Pairs of Navy Cotton Socks',
    ],
  },
  {
    id: 'kit-uni-blazer',
    itemType: 'UNIFORM_SET',
    title: 'Senior Secondary Winter Woolen Blazer with Embroidered Crest',
    gradeClass: 'Classes 9 to 12',
    price: 2950,
    availableStock: 45,
    sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    includedComponents: [
      '1x Pure Wool Heavyweight Navy Blazer with Gold Thread Embroidered Crest',
      '1x Thermal Fleece V-Neck Sweater with School Trim',
    ],
  },
  {
    id: 'kit-sta-lab',
    itemType: 'STATIONERY_LAB_KIT',
    title: 'Senior Science Laboratory Consumables & Drafting Kit',
    gradeClass: 'Classes 11 to 12',
    price: 1250,
    availableStock: 60,
    includedComponents: [
      '1x 100% Cotton White Protective Lab Coat',
      '1x Chemistry Organic Reaction Template Stencil',
      '3x Hardbound Spiral Lab Record Books (Physics, Chem, Bio)',
      '1x Drafter & Vernier Caliper Mathematical Ruler Set',
    ],
  },
];

/**
 * Pre-seeded Store Orders
 */
export const INITIAL_STORE_ORDERS: StoreOrder[] = [
  {
    id: 'ORD-STORE-88190',
    admissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    gradeClass: 'Class 10A',
    items: [
      {
        itemId: 'kit-txt-10',
        title: 'Class 10 Complete NCERT & Reference Textbook Set',
        quantity: 1,
        unitPrice: 3450,
        itemTotal: 3450,
      },
      {
        itemId: 'kit-uni-summer',
        title: 'School Summer Regular Uniform Set',
        quantity: 1,
        selectedSize: 'M',
        unitPrice: 2600,
        itemTotal: 2600,
      },
    ],
    totalAmount: 6050,
    orderDate: '2024-11-20',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'COLLECTED',
    pickupCounterSlot: 'Counter A &bull; Collected by Rajesh Mehta',
  },
  {
    id: 'ORD-STORE-88195',
    admissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    gradeClass: 'Class 10A',
    items: [
      {
        itemId: 'kit-uni-blazer',
        title: 'Senior Secondary Winter Woolen Blazer',
        quantity: 1,
        selectedSize: 'M',
        unitPrice: 2950,
        itemTotal: 2950,
      },
    ],
    totalAmount: 2950,
    orderDate: '2024-11-24',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'READY_FOR_PICKUP',
    pickupCounterSlot: 'Counter B (North Wing) &bull; Mon-Sat 09:00 AM - 02:00 PM',
  },
];
