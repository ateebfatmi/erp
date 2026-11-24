import { describe, it, expect } from 'vitest';
import {
  processCanteenPurchase,
  rechargeWallet,
  CANTEEN_MENU,
  INITIAL_STUDENT_WALLET,
} from '../canteen';

describe('Campus Canteen Smart Wallet & Meal Token Engine', () => {
  it('successfully processes purchase when balance and daily cap are valid', () => {
    const idliItem = CANTEEN_MENU[0]; // ₹45, no allergens
    const wallet = { ...INITIAL_STUDENT_WALLET, todaySpent: 0, balance: 200 };

    const { success, updatedWallet, transaction } = processCanteenPurchase(wallet, idliItem, 1);

    expect(success).toBe(true);
    expect(updatedWallet.balance).toBe(155); // 200 - 45
    expect(updatedWallet.todaySpent).toBe(45);
    expect(transaction.status).toBe('SETTLED');
  });

  it('blocks purchase when item contains student medical allergen warning', () => {
    const peanutItem = CANTEEN_MENU[4]; // Contains 'PEANUTS'
    const wallet = { ...INITIAL_STUDENT_WALLET, allergenAlerts: ['PEANUTS'] };

    const { success, errorMessage, transaction } = processCanteenPurchase(wallet, peanutItem, 1);

    expect(success).toBe(false);
    expect(errorMessage).toContain('Safety Block');
    expect(transaction.status).toBe('BLOCKED_ALLERGEN');
  });

  it('enforces parental daily spending limit cap', () => {
    const juiceItem = CANTEEN_MENU[3]; // ₹30
    // Limit is ₹100, today spent is ₹80, item is ₹30 -> Total 110 > 100
    const wallet = {
      ...INITIAL_STUDENT_WALLET,
      balance: 500,
      dailySpendLimit: 100,
      todaySpent: 80,
    };

    const { success, errorMessage, transaction } = processCanteenPurchase(wallet, juiceItem, 1);

    expect(success).toBe(false);
    expect(errorMessage).toContain('Exceeds parental daily spend cap');
    expect(transaction.status).toBe('BLOCKED_DAILY_LIMIT');
  });

  it('recharges digital wallet credit accurately', () => {
    const wallet = { ...INITIAL_STUDENT_WALLET, balance: 100 };
    const recharged = rechargeWallet(wallet, 500);

    expect(recharged.balance).toBe(600);
  });
});
