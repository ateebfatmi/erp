import { describe, it, expect } from 'vitest';
import { repository } from '@/lib/database/repository';

describe('Fee Management & Transaction Ledger Engine', () => {
  const tenantId = 'tenant-dpga-delhi';

  it('retrieves student fee allocations with correct due amounts', async () => {
    const allocations = await repository.getFeeAllocations(tenantId, 'enr-aarav');
    expect(allocations.length).toBeGreaterThan(0);

    const q3 = allocations.find((a) => a.id === 'alloc-aarav-q3');
    expect(q3?.status).toBe('paid');
    expect(q3?.paid_amount).toBe(19500);
  });

  it('records offline cash/UPI payments and updates allocation status', async () => {
    const initialTransactions = await repository.getFeeTransactions(tenantId);
    const initialCount = initialTransactions.length;

    const newTx = await repository.recordPayment(tenantId, {
      enrollmentId: 'enr-aarav',
      allocationIds: ['alloc-aarav-q4'],
      amount: 19500,
      paymentMethod: 'upi',
      referenceNumber: 'UPI/981294829104',
    });

    expect(newTx.status).toBe('successful');
    expect(newTx.total_amount).toBe(19500);
    expect(newTx.receipt_number).toMatch(/^REC-/);

    // Verify transaction list grew
    const updatedTransactions = await repository.getFeeTransactions(tenantId);
    expect(updatedTransactions.length).toBe(initialCount + 1);

    // Verify allocation updated to paid
    const allocations = await repository.getFeeAllocations(tenantId, 'enr-aarav');
    const q4 = allocations.find((a) => a.id === 'alloc-aarav-q4');
    expect(q4?.status).toBe('paid');
  });

  it('handles partial fee payments accurately', async () => {
    const enr = await repository.createStudentEnrollment(tenantId, {
      fullName: 'Devansh Verma',
      admissionNumber: 'DPGA/2026/8899',
      dob: '2011-03-12',
      gender: 'male',
      classId: 'class-10',
      sectionId: 'sec-10-a',
      campusId: 'campus-vk-01',
    });

    const allocs = await repository.getFeeAllocations(tenantId, enr.id);
    expect(allocs.length).toBe(1);
    const alloc = allocs[0];
    expect(alloc.due_amount).toBe(19500);

    // Make partial payment of 10000
    await repository.recordPayment(tenantId, {
      enrollmentId: enr.id,
      allocationIds: [alloc.id],
      amount: 10000,
      paymentMethod: 'cash',
    });

    const updatedAllocs = await repository.getFeeAllocations(tenantId, enr.id);
    expect(updatedAllocs[0].paid_amount).toBe(10000);
    expect(updatedAllocs[0].status).toBe('partially_paid');
  });
});
