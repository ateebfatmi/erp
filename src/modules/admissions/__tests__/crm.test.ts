import { describe, it, expect } from 'vitest';
import {
  transitionLeadStatus,
  calculateAdmissionsMetrics,
  AdmissionLead,
} from '../crm';

describe('Admissions CRM Pipeline & Conversion Engine', () => {
  it('validates stage advancement rules without allowing premature skips', () => {
    // Valid sequential advance: applied -> verified
    const v1 = transitionLeadStatus('applied', 'verified');
    expect(v1.isValid).toBe(true);

    // Invalid skip: applied -> enrolled (skipping verified & approved)
    const vSkip = transitionLeadStatus('applied', 'enrolled');
    expect(vSkip.isValid).toBe(false);
    expect(vSkip.message).toContain('Cannot skip stages');

    // Valid advance: approved -> enrolled
    const v3 = transitionLeadStatus('approved', 'enrolled');
    expect(v3.isValid).toBe(true);
  });

  it('accurately computes pipeline conversion rates and projected fee inflows', () => {
    const sampleLeads: AdmissionLead[] = [
      {
        id: '1',
        studentName: 'Vihaan',
        targetClass: 'Class 9',
        parentName: 'Sanjay',
        parentPhone: '98111',
        parentEmail: 's@m.com',
        status: 'enrolled',
        applicationDate: '2026-11-20',
        entranceScore: 92,
        admissionFee: 50000,
      },
      {
        id: '2',
        studentName: 'Saanvi',
        targetClass: 'Class 11',
        parentName: 'Neeraj',
        parentPhone: '98222',
        parentEmail: 'n@s.com',
        status: 'approved',
        applicationDate: '2026-11-22',
        entranceScore: 96,
        admissionFee: 60000,
      },
      {
        id: '3',
        studentName: 'Kabir',
        targetClass: 'Class 6',
        parentName: 'Ananya',
        parentPhone: '98333',
        parentEmail: 'a@s.com',
        status: 'applied',
        applicationDate: '2026-11-23',
        entranceScore: 84,
        admissionFee: 40000,
      },
    ];

    const metrics = calculateAdmissionsMetrics(sampleLeads);

    expect(metrics.totalLeads).toBe(3);
    expect(metrics.enrolledCount).toBe(1);
    expect(metrics.approvedCount).toBe(1);
    expect(metrics.conversionRate).toBe(33.3);
    // Projected revenue = 50,000 (enrolled) + 60,000 (approved) = 110,000
    expect(metrics.projectedRevenue).toBe(110000);
  });
});
