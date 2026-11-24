/**
 * Cashless Campus Canteen, Smart RFID Wallet & Meal Token Engine
 * Implements parental daily spend limits, allergy guardrails,
 * POS checkout tally, and digital meal token generation.
 */

export interface CanteenMenuItem {
  id: string;
  name: string;
  category: 'HOT_MEAL' | 'SNACK' | 'BEVERAGE' | 'HEALTHY_SALAD';
  price: number;
  caloriesKcal: number;
  allergens: string[];
  inStock: boolean;
}

export interface StudentCanteenWallet {
  studentId: string;
  studentName: string;
  rollNo: string;
  classSection: string;
  rfidCardUid: string;
  balance: number; // in INR (₹)
  dailySpendLimit: number; // in INR (₹)
  todaySpent: number;
  allergenAlerts: string[];
  isLocked: boolean;
}

export interface CanteenTransaction {
  id: string;
  studentId: string;
  studentName: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  timestamp: string;
  status: 'SETTLED' | 'BLOCKED_DAILY_LIMIT' | 'BLOCKED_INSUFFICIENT_FUNDS' | 'BLOCKED_ALLERGEN';
}

/**
 * Evaluates and processes a cashless canteen checkout with strict health & wallet guardrails
 */
export function processCanteenPurchase(
  wallet: StudentCanteenWallet,
  item: CanteenMenuItem,
  quantity = 1
): {
  success: boolean;
  updatedWallet: StudentCanteenWallet;
  transaction: CanteenTransaction;
  errorMessage?: string;
} {
  const totalCost = item.price * quantity;
  const transactionId = `txn-${Date.now()}`;
  const now = new Date();
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // 1. Check if wallet is locked by parent
  if (wallet.isLocked) {
    return {
      success: false,
      updatedWallet: wallet,
      transaction: {
        id: transactionId,
        studentId: wallet.studentId,
        studentName: wallet.studentName,
        itemName: item.name,
        quantity,
        totalAmount: totalCost,
        timestamp,
        status: 'BLOCKED_INSUFFICIENT_FUNDS',
      },
      errorMessage: 'Wallet locked by guardian. Purchases disabled.',
    };
  }

  // 2. Check Allergen Warnings
  const matchedAllergens = item.allergens.filter((al) =>
    wallet.allergenAlerts.includes(al)
  );
  if (matchedAllergens.length > 0) {
    return {
      success: false,
      updatedWallet: wallet,
      transaction: {
        id: transactionId,
        studentId: wallet.studentId,
        studentName: wallet.studentName,
        itemName: item.name,
        quantity,
        totalAmount: totalCost,
        timestamp,
        status: 'BLOCKED_ALLERGEN',
      },
      errorMessage: `Safety Block: Item contains ${matchedAllergens.join(', ')} flagged in student medical record.`,
    };
  }

  // 3. Check Daily Spending Cap
  if (wallet.todaySpent + totalCost > wallet.dailySpendLimit) {
    return {
      success: false,
      updatedWallet: wallet,
      transaction: {
        id: transactionId,
        studentId: wallet.studentId,
        studentName: wallet.studentName,
        itemName: item.name,
        quantity,
        totalAmount: totalCost,
        timestamp,
        status: 'BLOCKED_DAILY_LIMIT',
      },
      errorMessage: `Exceeds parental daily spend cap of ₹${wallet.dailySpendLimit}. (Today spent: ₹${wallet.todaySpent})`,
    };
  }

  // 4. Check Wallet Balance
  if (wallet.balance < totalCost) {
    return {
      success: false,
      updatedWallet: wallet,
      transaction: {
        id: transactionId,
        studentId: wallet.studentId,
        studentName: wallet.studentName,
        itemName: item.name,
        quantity,
        totalAmount: totalCost,
        timestamp,
        status: 'BLOCKED_INSUFFICIENT_FUNDS',
      },
      errorMessage: `Insufficient wallet balance. (Balance: ₹${wallet.balance}, Required: ₹${totalCost})`,
    };
  }

  // 5. Successful Settlement
  const updatedWallet: StudentCanteenWallet = {
    ...wallet,
    balance: wallet.balance - totalCost,
    todaySpent: wallet.todaySpent + totalCost,
  };

  return {
    success: true,
    updatedWallet,
    transaction: {
      id: transactionId,
      studentId: wallet.studentId,
      studentName: wallet.studentName,
      itemName: item.name,
      quantity,
      totalAmount: totalCost,
      timestamp,
      status: 'SETTLED',
    },
  };
}

/**
 * Adds recharge credit to student digital wallet
 */
export function rechargeWallet(
  wallet: StudentCanteenWallet,
  rechargeAmount: number
): StudentCanteenWallet {
  return {
    ...wallet,
    balance: wallet.balance + Math.max(0, rechargeAmount),
  };
}

/**
 * Curated Canteen Menu
 */
export const CANTEEN_MENU: CanteenMenuItem[] = [
  {
    id: 'mnu-01',
    name: 'Steamed Vegetable Idli Sambar (2 Pcs)',
    category: 'HOT_MEAL',
    price: 45,
    caloriesKcal: 220,
    allergens: [],
    inStock: true,
  },
  {
    id: 'mnu-02',
    name: 'Grilled Whole Wheat Vegetable Sandwich',
    category: 'SNACK',
    price: 40,
    caloriesKcal: 260,
    allergens: ['GLUTEN'],
    inStock: true,
  },
  {
    id: 'mnu-03',
    name: 'Organic Sprouted Moong & Pomegranate Chaat',
    category: 'HEALTHY_SALAD',
    price: 35,
    caloriesKcal: 180,
    allergens: [],
    inStock: true,
  },
  {
    id: 'mnu-04',
    name: 'Freshly Squeezed Valencia Orange Juice (250ml)',
    category: 'BEVERAGE',
    price: 30,
    caloriesKcal: 110,
    allergens: [],
    inStock: true,
  },
  {
    id: 'mnu-05',
    name: 'Nutty Granola Energy Bar with Peanut Butter',
    category: 'SNACK',
    price: 35,
    caloriesKcal: 240,
    allergens: ['PEANUTS'],
    inStock: true,
  },
];

/**
 * Curated Student Wallet (Aarav Mehta - Class 12-A)
 */
export const INITIAL_STUDENT_WALLET: StudentCanteenWallet = {
  studentId: 'std-101',
  studentName: 'Aarav Mehta',
  rollNo: '24',
  classSection: '12-A',
  rfidCardUid: 'RFID-9941-MEHTA',
  balance: 550, // ₹550
  dailySpendLimit: 120, // ₹120 daily limit
  todaySpent: 45, // ₹45 spent this morning on Idli Sambar
  allergenAlerts: ['PEANUTS'], // Allergic to peanuts!
  isLocked: false,
};

/**
 * Curated Canteen Transaction History
 */
export const INITIAL_CANTEEN_TRANSACTIONS: CanteenTransaction[] = [
  {
    id: 'txn-991',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    itemName: 'Steamed Vegetable Idli Sambar (2 Pcs)',
    quantity: 1,
    totalAmount: 45,
    timestamp: '2024-11-25 10:15',
    status: 'SETTLED',
  },
  {
    id: 'txn-988',
    studentId: 'std-101',
    studentName: 'Aarav Mehta',
    itemName: 'Nutty Granola Energy Bar with Peanut Butter',
    quantity: 1,
    totalAmount: 35,
    timestamp: '2024-11-24 13:40',
    status: 'BLOCKED_ALLERGEN',
  },
];
