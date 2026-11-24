import { describe, it, expect } from 'vitest';
import {
  createStoreReservation,
  markOrderCollected,
  INITIAL_STORE_CATALOG,
  INITIAL_STORE_ORDERS,
} from '../school-store';

describe('Campus Bookstore & Uniform Kit Engine', () => {
  it('should create a valid student kit reservation, calculate totals, and decrement catalog stock', () => {
    const initialStock = INITIAL_STORE_CATALOG[0].availableStock; // 120
    const { order, updatedCatalog } = createStoreReservation({
      admissionNo: 'ADM-2024-001',
      studentName: 'Aarav Mehta',
      gradeClass: 'Class 10',
      requestedItems: [
        { itemId: 'kit-txt-10', quantity: 2 },
      ],
      catalog: INITIAL_STORE_CATALOG,
    });

    expect(order.id).toContain('ORD-STORE-');
    expect(order.totalAmount).toBe(3450 * 2);
    expect(order.fulfillmentStatus).toBe('READY_FOR_PICKUP');

    const updatedItem = updatedCatalog.find((i) => i.id === 'kit-txt-10');
    expect(updatedItem?.availableStock).toBe(initialStock - 2);
  });

  it('should throw an error when requested quantity exceeds available inventory', () => {
    expect(() =>
      createStoreReservation({
        admissionNo: 'ADM-2024-001',
        studentName: 'Aarav Mehta',
        gradeClass: 'Class 10',
        requestedItems: [
          { itemId: 'kit-uni-blazer', quantity: 100 }, // only 45 available
        ],
        catalog: INITIAL_STORE_CATALOG,
      })
    ).toThrowError(/Insufficient stock/);
  });

  it('should mark a reserved kit order as collected at the counter', () => {
    const updated = markOrderCollected(INITIAL_STORE_ORDERS, 'ORD-STORE-88195');
    const order = updated.find((o) => o.id === 'ORD-STORE-88195');
    expect(order?.fulfillmentStatus).toBe('COLLECTED');
  });
});
