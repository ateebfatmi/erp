import { describe, it, expect } from 'vitest';
import {
  generateFeeReceiptPdf,
  generateReportCardPdf,
  generateStudentIdCardPdf,
  generateTransferCertificatePdf,
  generateMeritCertificatePdf,
  generateAdmissionOfferLetterPdf,
} from '../pdf-generator';

describe('Document Generation Engine (pdf-lib)', () => {
  it('generates a valid Fee Receipt PDF with proper magic bytes (%PDF)', async () => {
    const bytes = await generateFeeReceiptPdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Sector 4, Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      receiptNumber: 'REC-2026-001',
      date: '24/11/2026',
      studentName: 'Aarav Mehta',
      admissionNumber: 'DPGA/2021/1042',
      className: 'Class 10',
      sectionName: 'A',
      rollNumber: 1,
      paymentMethod: 'UPI',
      referenceNumber: 'UPI/2026/89410',
      items: [
        { title: 'Tuition Fee (Q4)', amount: 15000 },
        { title: 'Computer Lab Fee', amount: 4500 },
      ],
      totalAmount: 19500,
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    // Verify standard PDF header %PDF-
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('generates a valid CBSE Report Card PDF', async () => {
    const bytes = await generateReportCardPdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Sector 4, Vasant Kunj, New Delhi',
      affiliation: 'CBSE New Delhi',
      termName: 'Mid-Term Examination 2026',
      sessionName: '2025-2026',
      studentName: 'Aarav Mehta',
      admissionNumber: 'DPGA/2021/1042',
      className: 'Class 10',
      sectionName: 'A',
      rollNumber: 1,
      marks: [
        { subject: 'English Communicative', maxMarks: 100, obtainedMarks: 94, grade: 'A1' },
        { subject: 'Mathematics Standard', maxMarks: 100, obtainedMarks: 98, grade: 'A1' },
        { subject: 'Science (Theory & Prac)', maxMarks: 100, obtainedMarks: 91, grade: 'A1' },
      ],
      overallPercentage: 94.3,
      overallGrade: 'A1',
      attendancePercentage: 96.5,
      teacherRemarks: 'Outstanding analytical capability and disciplined conduct.',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('generates a valid Student ID Card badge PDF', async () => {
    const bytes = await generateStudentIdCardPdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      academicSession: '2025-2026',
      studentName: 'Aarav Mehta',
      admissionNumber: 'DPGA/2021/1042',
      className: 'Class 10',
      sectionName: 'A',
      rollNumber: 1,
      dob: '14-04-2010',
      bloodGroup: 'B+',
      emergencyContact: '+91 98101 23456',
      guardianName: 'Rajesh Mehta',
      address: 'B-4/112 Vasant Kunj, New Delhi',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(500);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('generates a valid CBSE Transfer Certificate (TC) PDF', async () => {
    const bytes = await generateTransferCertificatePdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Sector 4, Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      schoolCode: '20194',
      tcNumber: 'TC/2026/8912',
      issueDate: '24/11/2026',
      studentName: 'Aarav Mehta',
      fatherName: 'Mr. Rajesh Mehta',
      motherName: 'Mrs. Sunita Mehta',
      nationality: 'Indian',
      admissionNumber: 'DPGA/2021/1042',
      dateOfBirth: '14-04-2010',
      dateOfAdmission: '05-04-2021 in Class 5',
      lastClassStudied: 'Class 10 (Tenth)',
      schoolBoardExamLastTaken: 'CBSE Secondary Exam Passed',
      whetherFailed: 'No',
      subjectsStudied: 'English, Math, Science, Social Science, Hindi',
      qualifiedForPromotion: 'Yes, promoted to Class 11',
      monthUpToWhichDuesPaid: 'March 2026',
      totalWorkingDays: 218,
      daysPresent: 204,
      generalConduct: 'Exemplary',
      reasonForLeaving: 'Parent Transfer',
      anyOtherRemarks: 'NIL',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('generates a valid, landscape Certificate of Merit PDF', async () => {
    const bytes = await generateMeritCertificatePdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      certificateNumber: 'DPGA/MERIT/2026/0491',
      issueDate: '24/11/2026',
      studentName: 'Aarav Mehta',
      admissionNumber: 'DPGA/2021/1042',
      className: 'Class 10',
      sectionName: 'A',
      title: 'Certificate of Merit & Academic Excellence',
      awardReason: 'For securing 1st Position with 98.4% in CBSE Mid-Term Examination',
      achievementCategory: 'Senior Secondary Academic Distinction',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });

  it('generates a valid, official Admission Offer Letter PDF', async () => {
    const bytes = await generateAdmissionOfferLetterPdf({
      schoolName: 'Delhi Public Global Academy',
      schoolAddress: 'Vasant Kunj, New Delhi',
      affiliationNumber: '2130894',
      letterNumber: 'DPGA/ADM-OFFER/2026/089',
      issueDate: '24/11/2026',
      parentName: 'Mr. Sanjay Malhotra',
      parentAddress: 'Safdarjung Enclave, New Delhi',
      studentName: 'Vihaan Malhotra',
      targetClass: 'Class 9',
      academicSession: '2026–2027',
      admissionFee: 25000,
      cautionMoney: 10000,
      tuitionQuarterFee: 19500,
      totalPayable: 54500,
      paymentDeadline: '15 December 2026',
      orientationDate: '28 March 2027',
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(1000);
    const header = String.fromCharCode(...bytes.slice(0, 5));
    expect(header).toBe('%PDF-');
  });
});
