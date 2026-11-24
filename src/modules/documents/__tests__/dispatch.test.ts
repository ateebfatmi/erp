import { describe, it, expect } from 'vitest';
import {
  generateDispatchNumber,
  generateVerificationCode,
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
  filterCertificates,
  INITIAL_DISPATCH_RECORDS,
} from '../dispatch';

describe('Official Certificate & Document Dispatch Engine', () => {
  it('formats institutional dispatch numbers adhering to CBSE convention', () => {
    const bonafideDispatch = generateDispatchNumber('BONAFIDE', 142, '2025-26', 'DPGA');
    expect(bonafideDispatch).toBe('DPGA/BON/2025-26/0142');

    const tcDispatch = generateDispatchNumber('TRANSFER_CERTIFICATE', 89, '2025-26', 'DPGA');
    expect(tcDispatch).toBe('DPGA/TC/2025-26/0089');
  });

  it('issues a certificate with an authentic QR verification code and status ACTIVE', () => {
    const cert = issueCertificate({
      documentType: 'BONAFIDE',
      studentOrStaffId: 'stu-99',
      recipientName: 'Rohan Gupta',
      admissionOrEmployeeNo: 'DPGA/2022/1155',
      className: 'Class 11-A',
      issuedBy: 'Principal Office',
      reasonOrRemarks: 'Higher Education Visa Application',
      sequence: 501,
    });

    expect(cert.dispatchNumber).toBe('DPGA/BON/2025-26/0501');
    expect(cert.status).toBe('ACTIVE');
    expect(cert.verificationCode).toMatch(/^VOS-BON-501-/);
    expect(cert.recipientName).toBe('Rohan Gupta');
  });

  it('revokes a certificate with reason and updates status correctly', () => {
    const records = [...INITIAL_DISPATCH_RECORDS];
    const { updatedRecords, revokedRecord } = revokeCertificate(
      records,
      'cert-001',
      'Student provided erroneous passport details'
    );

    expect(revokedRecord).toBeDefined();
    expect(revokedRecord?.status).toBe('REVOKED');
    expect(revokedRecord?.revocationReason).toBe('Student provided erroneous passport details');

    const check = updatedRecords.find((r) => r.id === 'cert-001');
    expect(check?.status).toBe('REVOKED');
  });

  it('verifies valid certificates and flags revoked ones with reason', () => {
    const records = [...INITIAL_DISPATCH_RECORDS];

    // Valid check
    const validResult = verifyCertificate(records, 'VOS-BON-101-7X9K');
    expect(validResult.valid).toBe(true);
    expect(validResult.record?.recipientName).toBe('Aarav Mehta');

    // Revoke and re-verify
    const { updatedRecords } = revokeCertificate(records, 'cert-001', 'Cancelled by Principal order');
    const revokedResult = verifyCertificate(updatedRecords, 'VOS-BON-101-7X9K');
    expect(revokedResult.valid).toBe(false);
    expect(revokedResult.message).toContain('REVOKED');

    // Invalid code
    const invalidResult = verifyCertificate(records, 'VOS-UNKNOWN-999');
    expect(invalidResult.valid).toBe(false);
  });

  it('filters dispatch records by query, category, and status', () => {
    const records = [...INITIAL_DISPATCH_RECORDS];

    const bonafideOnly = filterCertificates(records, '', 'BONAFIDE', 'ALL');
    expect(bonafideOnly.length).toBe(1);
    expect(bonafideOnly[0].documentType).toBe('BONAFIDE');

    const searchResult = filterCertificates(records, 'Diya', 'ALL', 'ALL');
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].recipientName).toBe('Diya Sharma');
  });
});
