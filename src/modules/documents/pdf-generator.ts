import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface FeeReceiptData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  receiptNumber: string;
  date: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  rollNumber: string | number;
  paymentMethod: string;
  referenceNumber: string;
  items: Array<{
    title: string;
    amount: number;
  }>;
  totalAmount: number;
}

export interface ReportCardData {
  schoolName: string;
  schoolAddress: string;
  affiliation: string;
  termName: string;
  sessionName: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  rollNumber: string | number;
  marks: Array<{
    subject: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
  }>;
  overallPercentage: number;
  overallGrade: string;
  attendancePercentage: number;
  teacherRemarks: string;
}

/**
 * Generates an official, publication-grade Fee Receipt PDF
 */
export async function generateFeeReceiptPdf(data: FeeReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Border frame
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.15, 0.38, 0.92), // CBSE Blue
    borderWidth: 2,
  });

  // Header Box
  page.drawRectangle({
    x: 32,
    y: height - 120,
    width: width - 64,
    height: 88,
    color: rgb(0.95, 0.97, 1.0),
  });

  // School Crest / Name
  page.drawText(data.schoolName.toUpperCase(), {
    x: 50,
    y: height - 65,
    size: 16,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  page.drawText(`${data.schoolAddress} | Affiliation No: ${data.affiliationNumber}`, {
    x: 50,
    y: height - 85,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('OFFICIAL FEE PAYMENT RECEIPT', {
    x: 50,
    y: height - 105,
    size: 11,
    font: fontBold,
    color: rgb(0.15, 0.38, 0.92),
  });

  // Receipt Metadata Grid
  const metaY = height - 150;
  page.drawText(`Receipt No: ${data.receiptNumber}`, { x: 50, y: metaY, size: 10, font: fontBold });
  page.drawText(`Date: ${data.date}`, { x: 400, y: metaY, size: 10, font: fontBold });

  page.drawText(`Student Name: ${data.studentName}`, { x: 50, y: metaY - 22, size: 10, font: fontRegular });
  page.drawText(`Admission No: ${data.admissionNumber}`, { x: 400, y: metaY - 22, size: 10, font: fontRegular });

  page.drawText(`Class & Section: ${data.className} - ${data.sectionName}`, { x: 50, y: metaY - 42, size: 10, font: fontRegular });
  page.drawText(`Roll No: #${data.rollNumber}`, { x: 400, y: metaY - 42, size: 10, font: fontRegular });

  page.drawText(`Payment Mode: ${data.paymentMethod.toUpperCase()}`, { x: 50, y: metaY - 62, size: 10, font: fontRegular });
  page.drawText(`Ref / UTR: ${data.referenceNumber}`, { x: 400, y: metaY - 62, size: 10, font: fontRegular });

  // Table Header
  const tableY = metaY - 100;
  page.drawRectangle({
    x: 50,
    y: tableY - 5,
    width: width - 100,
    height: 25,
    color: rgb(0.9, 0.93, 0.98),
  });

  page.drawText('PARTICULARS / FEE HEAD', { x: 60, y: tableY + 2, size: 10, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
  page.drawText('AMOUNT (INR)', { x: 440, y: tableY + 2, size: 10, font: fontBold, color: rgb(0.1, 0.2, 0.4) });

  // Items
  let currentY = tableY - 30;
  for (const item of data.items) {
    page.drawText(item.title, { x: 60, y: currentY, size: 10, font: fontRegular });
    page.drawText(`INR ${item.amount.toLocaleString('en-IN')}.00`, { x: 440, y: currentY, size: 10, font: fontBold });
    currentY -= 25;
  }

  // Total Line
  page.drawLine({
    start: { x: 50, y: currentY - 5 },
    end: { x: width - 50, y: currentY - 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('TOTAL AMOUNT PAID:', { x: 60, y: currentY - 25, size: 11, font: fontBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`INR ${data.totalAmount.toLocaleString('en-IN')}.00`, { x: 440, y: currentY - 25, size: 12, font: fontBold, color: rgb(0.15, 0.38, 0.92) });

  // Footer / Signatures
  page.drawText('Authorized Signatory / Bursar', { x: 50, y: 80, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText('School Seal & Cash Stamp', { x: 400, y: 80, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });

  page.drawText('* This is a computer-generated tax/fee invoice recognized under CBSE affiliation bye-laws.', {
    x: 50,
    y: 50,
    size: 8,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

/**
 * Generates an official CBSE Term Progress Report Card PDF
 */
export async function generateReportCardPdf(data: ReportCardData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Border frame
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.1, 0.35, 0.2), // Forest Green
    borderWidth: 2,
  });

  // Header Title
  page.drawText(data.schoolName.toUpperCase(), {
    x: 50,
    y: height - 60,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.3, 0.15),
  });

  page.drawText(`${data.schoolAddress} | Affiliated to ${data.affiliation}`, {
    x: 50,
    y: height - 78,
    size: 10,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`ACADEMIC REPORT CARD — ${data.termName.toUpperCase()} (${data.sessionName})`, {
    x: 50,
    y: height - 100,
    size: 11,
    font: fontBold,
    color: rgb(0.8, 0.2, 0.1),
  });

  // Student Particulars
  const metaY = height - 140;
  page.drawText(`Student Name: ${data.studentName}`, { x: 50, y: metaY, size: 10, font: fontBold });
  page.drawText(`Roll No: #${data.rollNumber}`, { x: 400, y: metaY, size: 10, font: fontBold });

  page.drawText(`Admission No: ${data.admissionNumber}`, { x: 50, y: metaY - 20, size: 10, font: fontRegular });
  page.drawText(`Class & Section: ${data.className} - ${data.sectionName}`, { x: 400, y: metaY - 20, size: 10, font: fontRegular });

  page.drawText(`Attendance Record: ${data.attendancePercentage}%`, { x: 50, y: metaY - 40, size: 10, font: fontRegular });

  // Marks Table
  const tableY = metaY - 80;
  page.drawRectangle({
    x: 45,
    y: tableY - 5,
    width: width - 90,
    height: 25,
    color: rgb(0.92, 0.96, 0.92),
  });

  page.drawText('SUBJECT', { x: 55, y: tableY + 2, size: 10, font: fontBold });
  page.drawText('MAX MARKS', { x: 260, y: tableY + 2, size: 10, font: fontBold });
  page.drawText('OBTAINED', { x: 370, y: tableY + 2, size: 10, font: fontBold });
  page.drawText('GRADE', { x: 480, y: tableY + 2, size: 10, font: fontBold });

  let rowY = tableY - 28;
  for (const m of data.marks) {
    page.drawText(m.subject, { x: 55, y: rowY, size: 10, font: fontRegular });
    page.drawText(String(m.maxMarks), { x: 270, y: rowY, size: 10, font: fontRegular });
    page.drawText(String(m.obtainedMarks), { x: 380, y: rowY, size: 10, font: fontBold });
    page.drawText(m.grade, { x: 490, y: rowY, size: 10, font: fontBold, color: rgb(0.1, 0.4, 0.8) });
    rowY -= 24;
  }

  // Summary
  page.drawLine({
    start: { x: 45, y: rowY - 5 },
    end: { x: width - 45, y: rowY - 5 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText(`Cumulative Score: ${data.overallPercentage}%`, { x: 55, y: rowY - 25, size: 11, font: fontBold });
  page.drawText(`Overall CBSE Grade: ${data.overallGrade}`, { x: 370, y: rowY - 25, size: 12, font: fontBold, color: rgb(0.1, 0.5, 0.2) });

  page.drawText(`Class Teacher Remarks: "${data.teacherRemarks}"`, { x: 55, y: rowY - 60, size: 9, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

  // Signatures
  page.drawText('Class Teacher', { x: 60, y: 70, size: 10, font: fontBold });
  page.drawText('Principal / Head of Institution', { x: 380, y: 70, size: 10, font: fontBold });

  return await pdfDoc.save();
}

export interface StudentIdCardData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  academicSession: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  rollNumber: string | number;
  dob: string;
  bloodGroup: string;
  emergencyContact: string;
  guardianName: string;
  address: string;
}

/**
 * Generates an official PVC-style Student Identity Card PDF (CR80 standard badge format)
 */
export async function generateStudentIdCardPdf(data: StudentIdCardData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  // Standard CR80 badge scaled: 380 x 240 pt
  const page = pdfDoc.addPage([380, 240]);
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Outer border & card background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.98, 0.99, 1.0),
  });

  // Top header banner (Deep Navy)
  page.drawRectangle({
    x: 0,
    y: height - 55,
    width,
    height: 55,
    color: rgb(0.08, 0.18, 0.36),
  });

  page.drawText(data.schoolName.toUpperCase(), {
    x: 16,
    y: height - 25,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText(`${data.schoolAddress} | Affil. ${data.affiliationNumber}`, {
    x: 16,
    y: height - 42,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.8, 0.88, 1.0),
  });

  // Student Photo Box
  page.drawRectangle({
    x: 18,
    y: height - 150,
    width: 75,
    height: 90,
    color: rgb(0.92, 0.94, 0.98),
    borderColor: rgb(0.7, 0.75, 0.85),
    borderWidth: 1,
  });

  page.drawText('STUDENT', {
    x: 32,
    y: height - 100,
    size: 7.5,
    font: fontBold,
    color: rgb(0.5, 0.55, 0.65),
  });
  page.drawText('PHOTO', {
    x: 36,
    y: height - 112,
    size: 7.5,
    font: fontBold,
    color: rgb(0.5, 0.55, 0.65),
  });

  // Student Details
  const startX = 106;
  const startY = height - 76;

  page.drawText(data.studentName.toUpperCase(), {
    x: startX,
    y: startY,
    size: 12,
    font: fontBold,
    color: rgb(0.08, 0.18, 0.36),
  });

  page.drawText(`Class: ${data.className} - Sec: ${data.sectionName}  |  Roll: #${data.rollNumber}`, {
    x: startX,
    y: startY - 18,
    size: 9,
    font: fontBold,
    color: rgb(0.15, 0.38, 0.92),
  });

  page.drawText(`Adm No: ${data.admissionNumber}`, {
    x: startX,
    y: startY - 34,
    size: 8,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25),
  });

  page.drawText(`DOB: ${data.dob}   Blood Group: ${data.bloodGroup || 'O+'}`, {
    x: startX,
    y: startY - 48,
    size: 8,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25),
  });

  page.drawText(`Guardian: ${data.guardianName || 'Guardian'}`, {
    x: startX,
    y: startY - 62,
    size: 8,
    font: fontRegular,
    color: rgb(0.25, 0.25, 0.25),
  });

  page.drawText(`Emergency Tel: ${data.emergencyContact || '+91 98765 43210'}`, {
    x: startX,
    y: startY - 76,
    size: 8,
    font: fontBold,
    color: rgb(0.8, 0.2, 0.2),
  });

  // Bottom ribbon with QR badge & principal signature
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 32,
    color: rgb(0.93, 0.95, 0.98),
  });

  page.drawText(`Academic Session: ${data.academicSession}`, {
    x: 16,
    y: 12,
    size: 8,
    font: fontBold,
    color: rgb(0.2, 0.3, 0.4),
  });

  page.drawText('Principal Signature', {
    x: width - 110,
    y: 12,
    size: 8,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdfDoc.save();
}

export interface TransferCertificateData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  schoolCode: string;
  tcNumber: string;
  issueDate: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  nationality: string;
  admissionNumber: string;
  dateOfBirth: string;
  dateOfAdmission: string;
  lastClassStudied: string;
  schoolBoardExamLastTaken: string;
  whetherFailed: string;
  subjectsStudied: string;
  qualifiedForPromotion: string;
  monthUpToWhichDuesPaid: string;
  totalWorkingDays: number;
  daysPresent: number;
  generalConduct: string;
  reasonForLeaving: string;
  anyOtherRemarks: string;
}

/**
 * Generates an official CBSE-compliant Transfer Certificate (TC) PDF
 */
export async function generateTransferCertificatePdf(data: TransferCertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Double decorative border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.12, 0.2, 0.35),
    borderWidth: 2,
  });

  page.drawRectangle({
    x: 29,
    y: 29,
    width: width - 58,
    height: height - 58,
    borderColor: rgb(0.7, 0.55, 0.2), // Gold inner border
    borderWidth: 1,
  });

  // School Header
  page.drawText(data.schoolName.toUpperCase(), {
    x: 50,
    y: height - 70,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.18, 0.35),
  });

  page.drawText(`${data.schoolAddress}`, {
    x: 50,
    y: height - 88,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText(`Affiliation No: ${data.affiliationNumber}  |  School Code: ${data.schoolCode}`, {
    x: 50,
    y: height - 104,
    size: 9,
    font: fontBold,
    color: rgb(0.2, 0.4, 0.6),
  });

  page.drawText('TRANSFER / SCHOOL LEAVING CERTIFICATE', {
    x: 130,
    y: height - 130,
    size: 13,
    font: fontBold,
    color: rgb(0.7, 0.2, 0.1),
  });

  // TC Number and Date
  page.drawText(`TC No: ${data.tcNumber}`, { x: 50, y: height - 155, size: 9.5, font: fontBold });
  page.drawText(`Admission No: ${data.admissionNumber}`, { x: 240, y: height - 155, size: 9.5, font: fontBold });
  page.drawText(`Date: ${data.issueDate}`, { x: 440, y: height - 155, size: 9.5, font: fontBold });

  page.drawLine({
    start: { x: 50, y: height - 165 },
    end: { x: width - 50, y: height - 165 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // 18 Standard CBSE Fields
  const fields = [
    { num: '1.', label: 'Name of the Pupil:', val: data.studentName.toUpperCase() },
    { num: '2.', label: "Father's / Guardian's Name:", val: data.fatherName },
    { num: '3.', label: "Mother's Name:", val: data.motherName },
    { num: '4.', label: 'Nationality:', val: data.nationality },
    { num: '5.', label: 'Date of First Admission in School with Class:', val: data.dateOfAdmission },
    { num: '6.', label: 'Date of Birth (in Christian Era) as per Record:', val: data.dateOfBirth },
    { num: '7.', label: 'Class in which Pupil last studied:', val: data.lastClassStudied },
    { num: '8.', label: 'School / Board Annual Examination last taken:', val: data.schoolBoardExamLastTaken },
    { num: '9.', label: 'Whether failed, if so once/twice in same class:', val: data.whetherFailed },
    { num: '10.', label: 'Subjects Studied:', val: data.subjectsStudied },
    { num: '11.', label: 'Whether qualified for promotion to higher class:', val: data.qualifiedForPromotion },
    { num: '12.', label: 'Month up to which pupil has paid school dues:', val: data.monthUpToWhichDuesPaid },
    { num: '13.', label: 'Total Number of Working Days in Session:', val: String(data.totalWorkingDays) },
    { num: '14.', label: 'Total Number of Working Days Pupil Present:', val: String(data.daysPresent) },
    { num: '15.', label: 'General Conduct / Character:', val: data.generalConduct },
    { num: '16.', label: 'Date of Application for Certificate:', val: data.issueDate },
    { num: '17.', label: 'Reason for Leaving the School:', val: data.reasonForLeaving },
    { num: '18.', label: 'Any Other Remarks:', val: data.anyOtherRemarks || 'NIL' },
  ];

  let currentY = height - 190;
  for (const item of fields) {
    page.drawText(item.num, { x: 50, y: currentY, size: 9, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(item.label, { x: 75, y: currentY, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(item.val, { x: 310, y: currentY, size: 9, font: fontBold, color: rgb(0.08, 0.12, 0.25) });
    currentY -= 25;
  }

  // Signatures at bottom
  page.drawLine({
    start: { x: 50, y: 110 },
    end: { x: width - 50, y: 110 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('Prepared By (Class Teacher)', { x: 60, y: 75, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Checked By (Office Supdt.)', { x: 230, y: 75, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Principal / Institutional Seal', { x: 410, y: 75, size: 9, font: fontBold, color: rgb(0.1, 0.2, 0.4) });

  return await pdfDoc.save();
}

export interface SalarySlipPdfData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  payslipNumber: string;
  payPeriod: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  bankName: string;
  bankAccount: string;
  pan: string;
  pfUan: string;
  workingDays: number;
  presentDays: number;
  lopDays: number;
  earnings: Array<{ title: string; amount: number }>;
  deductions: Array<{ title: string; amount: number }>;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  netPayWords: string;
}

/**
 * Generates an official, publication-grade Staff Salary Payslip PDF
 */
export async function generateSalarySlipPdf(data: SalarySlipPdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Outer border frame
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.15, 0.25, 0.4),
    borderWidth: 1.5,
  });

  // Header Banner Box
  page.drawRectangle({
    x: 32,
    y: height - 110,
    width: width - 64,
    height: 78,
    color: rgb(0.95, 0.97, 1.0),
  });

  page.drawText(data.schoolName.toUpperCase(), {
    x: 50,
    y: height - 60,
    size: 15,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  page.drawText(`${data.schoolAddress} | Affiliation No: ${data.affiliationNumber}`, {
    x: 50,
    y: height - 78,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.45),
  });

  page.drawText(`SALARY PAYSLIP — ${data.payPeriod.toUpperCase()}`, {
    x: 50,
    y: height - 98,
    size: 11,
    font: fontBold,
    color: rgb(0.15, 0.38, 0.92),
  });

  // Metadata Grid
  const metaY = height - 135;
  page.drawRectangle({
    x: 45,
    y: metaY - 80,
    width: width - 90,
    height: 90,
    color: rgb(0.98, 0.99, 1.0),
    borderColor: rgb(0.85, 0.88, 0.95),
    borderWidth: 1,
  });

  // Column 1
  page.drawText(`Emp Code:`, { x: 55, y: metaY - 15, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.employeeCode, { x: 120, y: metaY - 15, size: 8.5, font: fontBold });

  page.drawText(`Emp Name:`, { x: 55, y: metaY - 32, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.employeeName, { x: 120, y: metaY - 32, size: 8.5, font: fontBold });

  page.drawText(`Designation:`, { x: 55, y: metaY - 49, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.designation, { x: 120, y: metaY - 49, size: 8.5, font: fontRegular });

  page.drawText(`Department:`, { x: 55, y: metaY - 66, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.department, { x: 120, y: metaY - 66, size: 8.5, font: fontRegular });

  // Column 2
  const col2X = 330;
  page.drawText(`Bank A/C:`, { x: col2X, y: metaY - 15, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(data.bankAccount, { x: col2X + 70, y: metaY - 15, size: 8.5, font: fontBold });

  page.drawText(`PAN / UAN:`, { x: col2X, y: metaY - 32, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${data.pan} / ${data.pfUan}`, { x: col2X + 70, y: metaY - 32, size: 8.5, font: fontRegular });

  page.drawText(`Total Days:`, { x: col2X, y: metaY - 49, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${data.workingDays} Days`, { x: col2X + 70, y: metaY - 49, size: 8.5, font: fontRegular });

  page.drawText(`Days Paid:`, { x: col2X, y: metaY - 66, size: 8.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${data.presentDays} Days (LOP: ${data.lopDays})`, { x: col2X + 70, y: metaY - 66, size: 8.5, font: fontBold, color: rgb(0.1, 0.5, 0.2) });

  // Two-column Table: Earnings on Left, Deductions on Right
  const tableTopY = metaY - 105;
  const colWidth = (width - 90) / 2;

  // Header band
  page.drawRectangle({
    x: 45,
    y: tableTopY - 20,
    width: width - 90,
    height: 22,
    color: rgb(0.12, 0.22, 0.38),
  });

  page.drawText('EARNINGS', { x: 55, y: tableTopY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('AMOUNT (INR)', { x: 210, y: tableTopY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  page.drawText('DEDUCTIONS', { x: 45 + colWidth + 10, y: tableTopY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('AMOUNT (INR)', { x: width - 130, y: tableTopY - 14, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  // Rows
  const maxRows = Math.max(data.earnings.length, data.deductions.length);
  let rowY = tableTopY - 42;

  for (let i = 0; i < maxRows; i++) {
    const earn = data.earnings[i];
    const ded = data.deductions[i];

    // Background alternate row stripe
    if (i % 2 === 1) {
      page.drawRectangle({
        x: 45,
        y: rowY - 5,
        width: width - 90,
        height: 20,
        color: rgb(0.97, 0.98, 0.99),
      });
    }

    if (earn) {
      page.drawText(earn.title, { x: 55, y: rowY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(earn.amount.toLocaleString('en-IN') + '.00', { x: 230, y: rowY, size: 8.5, font: fontBold });
    }

    if (ded) {
      page.drawText(ded.title, { x: 45 + colWidth + 10, y: rowY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
      page.drawText(ded.amount.toLocaleString('en-IN') + '.00', { x: width - 110, y: rowY, size: 8.5, font: fontBold, color: rgb(0.7, 0.1, 0.1) });
    }

    rowY -= 22;
  }

  // Totals Row
  page.drawLine({
    start: { x: 45, y: rowY + 5 },
    end: { x: width - 45, y: rowY + 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('GROSS EARNINGS:', { x: 55, y: rowY - 14, size: 9, font: fontBold });
  page.drawText(`INR ${data.grossEarnings.toLocaleString('en-IN')}.00`, { x: 210, y: rowY - 14, size: 9, font: fontBold, color: rgb(0.1, 0.5, 0.2) });

  page.drawText('TOTAL DEDUCTIONS:', { x: 45 + colWidth + 10, y: rowY - 14, size: 9, font: fontBold });
  page.drawText(`INR ${data.totalDeductions.toLocaleString('en-IN')}.00`, { x: width - 120, y: rowY - 14, size: 9, font: fontBold, color: rgb(0.7, 0.1, 0.1) });

  rowY -= 30;

  // Net Pay Callout Banner
  page.drawRectangle({
    x: 45,
    y: rowY - 35,
    width: width - 90,
    height: 42,
    color: rgb(0.92, 0.96, 1.0),
    borderColor: rgb(0.2, 0.45, 0.85),
    borderWidth: 1.5,
  });

  page.drawText('NET TAKE-HOME PAYABLE:', {
    x: 55,
    y: rowY - 15,
    size: 10,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  page.drawText(`INR ${data.netPay.toLocaleString('en-IN')}.00`, {
    x: width - 200,
    y: rowY - 15,
    size: 14,
    font: fontBold,
    color: rgb(0.1, 0.45, 0.2),
  });

  page.drawText(`Amount in words: ${data.netPayWords}`, {
    x: 55,
    y: rowY - 28,
    size: 8,
    font: fontRegular,
    color: rgb(0.3, 0.35, 0.4),
  });

  // Signatures
  page.drawText('Bursar / Accounts Officer', { x: 60, y: 75, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });
  page.drawText('Principal / Institutional Seal', { x: 400, y: 75, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });

  page.drawText('* This is a computer-generated salary slip recognized under Indian Income Tax & EPFO guidelines.', {
    x: 45,
    y: 45,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}

export interface MeritCertificateData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  certificateNumber: string;
  issueDate: string;
  studentName: string;
  admissionNumber: string;
  className: string;
  sectionName: string;
  title: string;
  awardReason: string;
  achievementCategory: string;
}

/**
 * Generates an official, regal Certificate of Merit / Achievement (A4 Landscape)
 */
export async function generateMeritCertificatePdf(data: MeritCertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([841.89, 595.28]); // A4 Landscape
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Outer Deep Navy Border
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: height - 50,
    borderColor: rgb(0.08, 0.16, 0.32),
    borderWidth: 4,
  });

  // Inner Ornate Gold Border
  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: rgb(0.78, 0.62, 0.22), // Gold
    borderWidth: 1.5,
  });

  // Background subtle tint
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    color: rgb(0.99, 0.99, 1.0),
  });

  // School Header
  const schoolTitle = data.schoolName.toUpperCase();
  const schoolTitleWidth = fontBold.widthOfTextAtSize(schoolTitle, 20);
  page.drawText(schoolTitle, {
    x: (width - schoolTitleWidth) / 2,
    y: height - 85,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.16, 0.32),
  });

  const subHeader = `${data.schoolAddress} | Affiliated to CBSE (Affil No. ${data.affiliationNumber})`;
  const subHeaderWidth = fontRegular.widthOfTextAtSize(subHeader, 10);
  page.drawText(subHeader, {
    x: (width - subHeaderWidth) / 2,
    y: height - 105,
    size: 10,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.55),
  });

  // Certificate Ribbon Banner
  const certBanner = data.title.toUpperCase();
  const certBannerWidth = fontBold.widthOfTextAtSize(certBanner, 18);
  page.drawRectangle({
    x: (width - certBannerWidth - 40) / 2,
    y: height - 160,
    width: certBannerWidth + 40,
    height: 36,
    color: rgb(0.92, 0.95, 1.0),
    borderColor: rgb(0.78, 0.62, 0.22),
    borderWidth: 1,
  });

  page.drawText(certBanner, {
    x: (width - certBannerWidth) / 2,
    y: height - 148,
    size: 18,
    font: fontBold,
    color: rgb(0.72, 0.52, 0.12), // Deep Gold
  });

  // Citation Body
  const presText = 'THIS IS PROUDLY PRESENTED TO';
  const presWidth = fontBold.widthOfTextAtSize(presText, 10);
  page.drawText(presText, {
    x: (width - presWidth) / 2,
    y: height - 200,
    size: 10,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });

  // Recipient Name (Large Callout)
  const studentName = data.studentName.toUpperCase();
  const nameWidth = fontBold.widthOfTextAtSize(studentName, 26);
  page.drawText(studentName, {
    x: (width - nameWidth) / 2,
    y: height - 245,
    size: 26,
    font: fontBold,
    color: rgb(0.08, 0.16, 0.32),
  });

  page.drawLine({
    start: { x: (width - nameWidth - 30) / 2, y: height - 255 },
    end: { x: (width + nameWidth + 30) / 2, y: height - 255 },
    thickness: 1.5,
    color: rgb(0.78, 0.62, 0.22),
  });

  // Class & Admission Details
  const studentDetails = `Class: ${data.className} - Section ${data.sectionName}   |   Admission No: ${data.admissionNumber}`;
  const detailsWidth = fontRegular.widthOfTextAtSize(studentDetails, 12);
  page.drawText(studentDetails, {
    x: (width - detailsWidth) / 2,
    y: height - 280,
    size: 12,
    font: fontRegular,
    color: rgb(0.2, 0.25, 0.35),
  });

  // Award Reason
  const reasonText = data.awardReason;
  const reasonWidth = fontBold.widthOfTextAtSize(reasonText, 13);
  page.drawText(reasonText, {
    x: (width - reasonWidth) / 2,
    y: height - 330,
    size: 13,
    font: fontBold,
    color: rgb(0.12, 0.35, 0.22),
  });

  const categoryText = `Under category: ${data.achievementCategory.toUpperCase()} (Academic Session 2025–2026)`;
  const catWidth = fontRegular.widthOfTextAtSize(categoryText, 10.5);
  page.drawText(categoryText, {
    x: (width - catWidth) / 2,
    y: height - 355,
    size: 10.5,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Certificate Metadata (Left)
  page.drawText(`Certificate Ref: ${data.certificateNumber}`, {
    x: 60,
    y: 80,
    size: 9,
    font: fontBold,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText(`Issue Date: ${data.issueDate}`, {
    x: 60,
    y: 65,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  // Signatures (Right & Center)
  page.drawLine({
    start: { x: 340, y: 80 },
    end: { x: 490, y: 80 },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });
  page.drawText('Activity / Sports Coordinator', {
    x: 350,
    y: 65,
    size: 9,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawLine({
    start: { x: width - 230, y: 80 },
    end: { x: width - 70, y: 80 },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });
  page.drawText('Principal / Head of Institution', {
    x: width - 215,
    y: 65,
    size: 9,
    font: fontBold,
    color: rgb(0.08, 0.16, 0.32),
  });

  return await pdfDoc.save();
}

export interface AdmissionOfferLetterData {
  schoolName: string;
  schoolAddress: string;
  affiliationNumber: string;
  letterNumber: string;
  issueDate: string;
  parentName: string;
  parentAddress: string;
  studentName: string;
  targetClass: string;
  academicSession: string;
  admissionFee: number;
  cautionMoney: number;
  tuitionQuarterFee: number;
  totalPayable: number;
  paymentDeadline: string;
  orientationDate: string;
}

/**
 * Generates an official Provisional Admission Offer Letter PDF (A4 Portrait)
 */
export async function generateAdmissionOfferLetterPdf(data: AdmissionOfferLetterData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Portrait
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Border frame
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.12, 0.22, 0.4),
    borderWidth: 1.5,
  });

  // Letterhead Top Banner
  page.drawRectangle({
    x: 32,
    y: height - 105,
    width: width - 64,
    height: 73,
    color: rgb(0.96, 0.98, 1.0),
  });

  page.drawText(data.schoolName.toUpperCase(), {
    x: 50,
    y: height - 60,
    size: 15,
    font: fontBold,
    color: rgb(0.08, 0.15, 0.35),
  });

  page.drawText(`${data.schoolAddress} | Affiliated to CBSE (Affiliation No: ${data.affiliationNumber})`, {
    x: 50,
    y: height - 76,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.35, 0.4, 0.5),
  });

  page.drawText('OFFICE OF THE ADMISSIONS DIRECTORATE & REGISTRAR', {
    x: 50,
    y: height - 94,
    size: 8.5,
    font: fontBold,
    color: rgb(0.15, 0.38, 0.92),
  });

  // Metadata: Ref and Date
  const metaY = height - 130;
  page.drawText(`Ref: ${data.letterNumber}`, { x: 50, y: metaY, size: 9, font: fontBold });
  page.drawText(`Date: ${data.issueDate}`, { x: 440, y: metaY, size: 9, font: fontBold });

  page.drawLine({
    start: { x: 50, y: metaY - 10 },
    end: { x: width - 50, y: metaY - 10 },
    thickness: 0.8,
    color: rgb(0.8, 0.85, 0.9),
  });

  // Addressee
  const addrY = metaY - 30;
  page.drawText('To,', { x: 50, y: addrY, size: 9.5, font: fontRegular });
  page.drawText(data.parentName, { x: 50, y: addrY - 14, size: 10.5, font: fontBold });
  page.drawText(data.parentAddress, { x: 50, y: addrY - 28, size: 9, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });

  // Subject
  const subY = addrY - 55;
  page.drawRectangle({
    x: 50,
    y: subY - 6,
    width: width - 100,
    height: 22,
    color: rgb(0.92, 0.96, 1.0),
  });
  page.drawText(`SUBJECT: PROVISIONAL ADMISSION OFFER — ${data.targetClass.toUpperCase()} (${data.academicSession})`, {
    x: 58,
    y: subY,
    size: 9.5,
    font: fontBold,
    color: rgb(0.08, 0.18, 0.4),
  });

  // Body Paragraphs
  const bodyY = subY - 30;
  page.drawText(`Dear ${data.parentName},`, { x: 50, y: bodyY, size: 9.5, font: fontRegular });

  const p1 = `We are pleased to inform you that following the entrance evaluation and document verification,`;
  const p2 = `your ward Master/Miss ${data.studentName.toUpperCase()} has been provisionally selected for admission to`;
  const p3 = `${data.targetClass} at Delhi Public Global Academy for Academic Session ${data.academicSession}.`;

  page.drawText(p1, { x: 50, y: bodyY - 18, size: 9.5, font: fontRegular });
  page.drawText(p2, { x: 50, y: bodyY - 32, size: 9.5, font: fontRegular });
  page.drawText(p3, { x: 50, y: bodyY - 46, size: 9.5, font: fontBold, color: rgb(0.1, 0.3, 0.15) });

  // Fee Structure Table
  const feeTableY = bodyY - 75;
  page.drawRectangle({
    x: 50,
    y: feeTableY - 5,
    width: width - 100,
    height: 20,
    color: rgb(0.12, 0.22, 0.38),
  });
  page.drawText('PARTICULARS OF ADMISSION FEE SCHEDULE', { x: 60, y: feeTableY, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('AMOUNT (INR)', { x: 440, y: feeTableY, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  let feeRowY = feeTableY - 20;
  const feeItems = [
    { title: 'One-Time Admission & Administrative Registration Fee', amt: data.admissionFee },
    { title: 'Refundable Institutional Caution Money (Security Deposit)', amt: data.cautionMoney },
    { title: 'Quarter 1 Tuition, Smart Lab & Activity Fee', amt: data.tuitionQuarterFee },
  ];

  for (const item of feeItems) {
    page.drawText(item.title, { x: 60, y: feeRowY, size: 8.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`INR ${item.amt.toLocaleString('en-IN')}.00`, { x: 440, y: feeRowY, size: 8.5, font: fontBold });
    feeRowY -= 18;
  }

  // Total Line
  page.drawLine({
    start: { x: 50, y: feeRowY + 5 },
    end: { x: width - 50, y: feeRowY + 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  page.drawText('TOTAL AMOUNT PAYABLE TO CONFIRM SEAT:', { x: 60, y: feeRowY - 10, size: 9.5, font: fontBold });
  page.drawText(`INR ${data.totalPayable.toLocaleString('en-IN')}.00`, {
    x: 430,
    y: feeRowY - 10,
    size: 11,
    font: fontBold,
    color: rgb(0.12, 0.45, 0.2),
  });

  // Next Steps & Deadlines
  const stepY = feeRowY - 40;
  page.drawText('IMPORTANT ADMISSION INSTRUCTIONS & DEADLINES:', { x: 50, y: stepY, size: 9, font: fontBold, color: rgb(0.8, 0.2, 0.1) });

  const notes = [
    `1. Seat Confirmation Deadline: The total admission fee must be cleared by ${data.paymentDeadline}.`,
    `2. Mandatory Enclosures: Original Transfer Certificate (TC counter-signed), Birth Certificate, and 4 Photos.`,
    `3. Student Orientation Program: Campus induction is scheduled for ${data.orientationDate}.`,
    `4. Mode of Payment: Online via School Parent Portal (Razorpay UPI/Cards) or Bank Demand Draft.`,
  ];

  let noteY = stepY - 16;
  for (const n of notes) {
    page.drawText(n, { x: 50, y: noteY, size: 8, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
    noteY -= 14;
  }

  // Signatures
  page.drawLine({
    start: { x: 50, y: 95 },
    end: { x: 200, y: 95 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('Dean of Admissions', { x: 75, y: 80, size: 9, font: fontBold, color: rgb(0.3, 0.3, 0.3) });

  page.drawLine({
    start: { x: width - 200, y: 95 },
    end: { x: width - 50, y: 95 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText('Principal / Institutional Seal', { x: width - 185, y: 80, size: 9, font: fontBold, color: rgb(0.08, 0.15, 0.35) });

  page.drawText('* This provisional offer is subject to verification of original academic credentials and timely fee clearance.', {
    x: 50,
    y: 50,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}
