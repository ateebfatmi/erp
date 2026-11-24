/**
 * VidyaOS - Official School Certificate & Document Dispatch Engine
 * Handles statutory dispatch registers, unique verification codes, and revocation audit logs.
 */

export type DocumentCategory =
  | 'BONAFIDE'
  | 'MERIT'
  | 'CHARACTER'
  | 'TRANSFER_CERTIFICATE'
  | 'ID_CARD'
  | 'FEE_RECEIPT'
  | 'REPORT_CARD'
  | 'OFFER_LETTER'
  | 'SALARY_SLIP';

export interface IssuedCertificateRecord {
  id: string;
  dispatchNumber: string;
  documentType: DocumentCategory;
  studentOrStaffId: string;
  recipientName: string;
  admissionOrEmployeeNo: string;
  className?: string;
  academicSession: string;
  issuedAt: string;
  issuedBy: string;
  reasonOrRemarks: string;
  verificationCode: string;
  status: 'ACTIVE' | 'REVOKED';
  revocationReason?: string;
}

const PREFIX_MAP: Record<DocumentCategory, string> = {
  BONAFIDE: 'BON',
  MERIT: 'MRT',
  CHARACTER: 'CHR',
  TRANSFER_CERTIFICATE: 'TC',
  ID_CARD: 'IDC',
  FEE_RECEIPT: 'REC',
  REPORT_CARD: 'RC',
  OFFER_LETTER: 'ADM',
  SALARY_SLIP: 'SAL',
};

/**
 * Generates an institutional dispatch registration number following standard CBSE/State Board format.
 * Example: DPGA/BON/2025-26/0142
 */
export function generateDispatchNumber(
  docType: DocumentCategory,
  sequence: number,
  academicSession: string = '2025-26',
  schoolPrefix: string = 'DPGA'
): string {
  const prefix = PREFIX_MAP[docType] || 'DOC';
  const paddedSeq = sequence.toString().padStart(4, '0');
  return `${schoolPrefix}/${prefix}/${academicSession}/${paddedSeq}`;
}

/**
 * Generates an alphanumeric verification code for QR-based certificate verification.
 */
export function generateVerificationCode(docType: DocumentCategory, sequence: number): string {
  const prefix = PREFIX_MAP[docType] || 'DOC';
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VOS-${prefix}-${sequence}-${randomSuffix}`;
}

/**
 * Issues and registers an official school certificate or document.
 */
export function issueCertificate(
  params: {
    documentType: DocumentCategory;
    studentOrStaffId: string;
    recipientName: string;
    admissionOrEmployeeNo: string;
    className?: string;
    academicSession?: string;
    issuedBy: string;
    reasonOrRemarks: string;
    sequence?: number;
  }
): IssuedCertificateRecord {
  const seq = params.sequence || Math.floor(100 + Math.random() * 900);
  const session = params.academicSession || '2025-26';
  const dispatchNumber = generateDispatchNumber(params.documentType, seq, session);
  const verificationCode = generateVerificationCode(params.documentType, seq);

  return {
    id: `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    dispatchNumber,
    documentType: params.documentType,
    studentOrStaffId: params.studentOrStaffId,
    recipientName: params.recipientName,
    admissionOrEmployeeNo: params.admissionOrEmployeeNo,
    className: params.className,
    academicSession: session,
    issuedAt: new Date().toISOString().split('T')[0],
    issuedBy: params.issuedBy,
    reasonOrRemarks: params.reasonOrRemarks,
    verificationCode,
    status: 'ACTIVE',
  };
}

/**
 * Revokes a certificate in case of erroneous issuance, disciplinary review, or TC cancellation.
 */
export function revokeCertificate(
  records: IssuedCertificateRecord[],
  recordId: string,
  reason: string
): { updatedRecords: IssuedCertificateRecord[]; revokedRecord: IssuedCertificateRecord | null } {
  let target: IssuedCertificateRecord | null = null;

  const updatedRecords = records.map((rec) => {
    if (rec.id === recordId) {
      target = {
        ...rec,
        status: 'REVOKED',
        revocationReason: reason,
      };
      return target;
    }
    return rec;
  });

  return { updatedRecords, revokedRecord: target };
}

/**
 * Validates a certificate against the public verification register.
 */
export function verifyCertificate(
  records: IssuedCertificateRecord[],
  verificationCode: string
): { valid: boolean; record?: IssuedCertificateRecord; message: string } {
  const record = records.find(
    (r) => r.verificationCode.trim().toUpperCase() === verificationCode.trim().toUpperCase()
  );

  if (!record) {
    return {
      valid: false,
      message: 'Certificate not found in school registry. Verification failed.',
    };
  }

  if (record.status === 'REVOKED') {
    return {
      valid: false,
      record,
      message: `Certificate was REVOKED on grounds: ${record.revocationReason || 'Administrative order'}.`,
    };
  }

  return {
    valid: true,
    record,
    message: 'Official certificate verified successfully with authentic institutional seal.',
  };
}

/**
 * Filters and searches the certificate dispatch register.
 */
export function filterCertificates(
  records: IssuedCertificateRecord[],
  query: string = '',
  category: DocumentCategory | 'ALL' = 'ALL',
  status: 'ACTIVE' | 'REVOKED' | 'ALL' = 'ALL'
): IssuedCertificateRecord[] {
  return records.filter((r) => {
    if (category !== 'ALL' && r.documentType !== category) return false;
    if (status !== 'ALL' && r.status !== status) return false;

    if (query.trim()) {
      const q = query.toLowerCase();
      const matchName = r.recipientName.toLowerCase().includes(q);
      const matchAdm = r.admissionOrEmployeeNo.toLowerCase().includes(q);
      const matchDispatch = r.dispatchNumber.toLowerCase().includes(q);
      const matchCode = r.verificationCode.toLowerCase().includes(q);
      if (!matchName && !matchAdm && !matchDispatch && !matchCode) return false;
    }

    return true;
  });
}

export const INITIAL_DISPATCH_RECORDS: IssuedCertificateRecord[] = [
  {
    id: 'cert-001',
    dispatchNumber: 'DPGA/BON/2025-26/0101',
    documentType: 'BONAFIDE',
    studentOrStaffId: 'stu-01',
    recipientName: 'Aarav Mehta',
    admissionOrEmployeeNo: 'DPGA/2021/1042',
    className: 'Class 10-A',
    academicSession: '2025-26',
    issuedAt: '2024-11-20',
    issuedBy: 'Dr. S. Mukherjee (Principal)',
    reasonOrRemarks: 'Applied for Passport Application Verification',
    verificationCode: 'VOS-BON-101-7X9K',
    status: 'ACTIVE',
  },
  {
    id: 'cert-002',
    dispatchNumber: 'DPGA/MRT/2025-26/0045',
    documentType: 'MERIT',
    studentOrStaffId: 'stu-02',
    recipientName: 'Diya Sharma',
    admissionOrEmployeeNo: 'DPGA/2021/1089',
    className: 'Class 10-B',
    academicSession: '2025-26',
    issuedAt: '2024-11-18',
    issuedBy: 'Mrs. Rekha Rao (Academic Coordinator)',
    reasonOrRemarks: 'National Science Olympiad Zonal Gold Medalist',
    verificationCode: 'VOS-MRT-45-B83P',
    status: 'ACTIVE',
  },
  {
    id: 'cert-003',
    dispatchNumber: 'DPGA/TC/2025-26/0012',
    documentType: 'TRANSFER_CERTIFICATE',
    studentOrStaffId: 'stu-03',
    recipientName: 'Kabir Verma',
    admissionOrEmployeeNo: 'DPGA/2020/0912',
    className: 'Class 9-C',
    academicSession: '2025-26',
    issuedAt: '2024-11-10',
    issuedBy: 'Dr. S. Mukherjee (Principal)',
    reasonOrRemarks: 'Parent Relocation to Bangalore (Transfer of Service)',
    verificationCode: 'VOS-TC-12-Z4N1',
    status: 'ACTIVE',
  },
  {
    id: 'cert-004',
    dispatchNumber: 'DPGA/IDC/2025-26/0321',
    documentType: 'ID_CARD',
    studentOrStaffId: 'stu-01',
    recipientName: 'Aarav Mehta',
    admissionOrEmployeeNo: 'DPGA/2021/1042',
    className: 'Class 10-A',
    academicSession: '2025-26',
    issuedAt: '2024-04-12',
    issuedBy: 'Admin Office',
    reasonOrRemarks: 'Annual RFID Smart Identity Card Issue',
    verificationCode: 'VOS-IDC-321-9K2L',
    status: 'ACTIVE',
  },
];
