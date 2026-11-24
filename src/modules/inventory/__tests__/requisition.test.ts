import { describe, it, expect } from 'vitest';
import {
  generateRequisitionNumber,
  createRequisition,
  updateRequisitionStatus,
  calculateRequisitionStats,
  INITIAL_REQUISITIONS,
} from '../requisition';

describe('Departmental Stock Requisition & Indent Workflow Engine', () => {
  it('formats institutional requisition numbers adhering to store convention', () => {
    const num = generateRequisitionNumber(104, 2024);
    expect(num).toBe('IND-2024-0104');
  });

  it('creates a new requisition with status PENDING_APPROVAL', () => {
    const req = createRequisition({
      department: 'SCIENCE_LAB',
      requesterName: 'Dr. S. K. Rastogi',
      requesterEmployeeCode: 'DPGA/EMP/2018/005',
      itemName: 'Hydrochloric Acid Conc. (HCl 37%)',
      quantityRequested: 4,
      unit: 'Bottles (2.5L)',
      priority: 'HIGH_EXAM_PREP',
      justificationPurpose: 'Class 12 Chemistry Practical Board Exam preparation',
      sequence: 95,
    });

    expect(req.requisitionNumber).toBe('IND-2024-0095');
    expect(req.status).toBe('PENDING_APPROVAL');
    expect(req.department).toBe('SCIENCE_LAB');
    expect(req.requestedAt).toBeDefined();
  });

  it('sanctions and issues materials from store with an automatic Store Issue Voucher', () => {
    const records = [...INITIAL_REQUISITIONS];

    // Sanction req-003
    const sanctionResult = updateRequisitionStatus(
      records,
      'req-003',
      'SANCTIONED',
      'Approved by Estate Officer'
    );
    expect(sanctionResult.updatedItem?.status).toBe('SANCTIONED');
    expect(sanctionResult.updatedItem?.approverRemarks).toBe('Approved by Estate Officer');

    // Issue from store
    const issueResult = updateRequisitionStatus(
      sanctionResult.updatedRecords,
      'req-003',
      'ISSUED_FROM_STORE',
      'Collected by peon'
    );
    expect(issueResult.updatedItem?.status).toBe('ISSUED_FROM_STORE');
    expect(issueResult.updatedItem?.storeVoucherNumber).toMatch(/^SIV-2024-/);
  });

  it('aggregates requisition status metrics accurately', () => {
    const stats = calculateRequisitionStats(INITIAL_REQUISITIONS);
    // Initial: 1 ISSUED_FROM_STORE, 1 SANCTIONED, 1 PENDING_APPROVAL
    expect(stats.total).toBe(3);
    expect(stats.pending).toBe(1);
    expect(stats.sanctioned).toBe(1);
    expect(stats.issued).toBe(1);
    expect(stats.rejected).toBe(0);
  });
});
