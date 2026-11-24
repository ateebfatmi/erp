/**
 * Commercial Alumni Network & Digital Transcript Verification Engine
 * Manages institutional alumni directory, graduate career tracking,
 * and official educational document verification (WES, Apostille, Transcripts).
 */

export interface AlumniProfile {
  id: string;
  admissionNo: string;
  name: string;
  passingYear: number;
  boardRollNo: string;
  stream: 'SCIENCE' | 'COMMERCE' | 'HUMANITIES';
  higherEducation: string;
  currentProfession: string;
  location: string;
  email: string;
  phone: string;
  mentorshipOffered: boolean;
}

export type TranscriptDocType =
  | 'OFFICIAL_TRANSCRIPT'
  | 'MIGRATION_CERTIFICATE'
  | 'CHARACTER_CERTIFICATE'
  | 'WES_APOSTILLE_VERIFICATION';

export interface TranscriptRequest {
  id: string;
  alumniId: string;
  alumniName: string;
  passingYear: number;
  documentType: TranscriptDocType;
  recipientInstitution: string;
  applicationDate: string;
  verificationBarcode: string;
  status: 'SUBMITTED' | 'VERIFIED_BY_REGISTRAR' | 'SEALED_AND_DISPATCHED';
}

/**
 * Filters alumni directory by graduation batch, academic stream, or search keyword
 */
export function filterAlumniDirectory(
  alumniList: AlumniProfile[],
  batchYear?: number | 'ALL',
  stream?: string | 'ALL',
  query = ''
): AlumniProfile[] {
  const q = query.trim().toLowerCase();

  return alumniList.filter((a) => {
    const matchesYear = !batchYear || batchYear === 'ALL' || a.passingYear === batchYear;
    const matchesStream = !stream || stream === 'ALL' || a.stream === stream;

    if (!matchesYear || !matchesStream) return false;
    if (!q) return true;

    return (
      a.name.toLowerCase().includes(q) ||
      a.admissionNo.toLowerCase().includes(q) ||
      a.higherEducation.toLowerCase().includes(q) ||
      a.currentProfession.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  });
}

/**
 * Generates an institutional verification barcode for WES/Apostille compliance
 */
export function generateVerificationBarcode(admissionNo: string, docType: TranscriptDocType): string {
  const code = docType.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `VIDYA-${admissionNo}-${code}-${timestamp}`;
}

/**
 * Curated Pre-seeded Institutional Alumni Roster
 */
export const INITIAL_ALUMNI_ROSTER: AlumniProfile[] = [
  {
    id: 'alm-01',
    admissionNo: 'ADM-2016-042',
    name: 'Rohan Deshmukh',
    passingYear: 2021,
    boardRollNo: 'CBSE-2130-9841',
    stream: 'SCIENCE',
    higherEducation: 'IIT Bombay • B.Tech Computer Science',
    currentProfession: 'Systems Engineer at Apple, Cupertino',
    location: 'San Francisco, USA',
    email: 'rohan.deshmukh@alumni.vidyaos.org',
    phone: '+1 408 555 0192',
    mentorshipOffered: true,
  },
  {
    id: 'alm-02',
    admissionNo: 'ADM-2017-088',
    name: 'Pooja Iyer',
    passingYear: 2022,
    boardRollNo: 'CBSE-2130-8812',
    stream: 'COMMERCE',
    higherEducation: 'SRCC Delhi University • B.Com (Hons)',
    currentProfession: 'Investment Banking Analyst at Goldman Sachs',
    location: 'Mumbai, India',
    email: 'pooja.iyer@alumni.vidyaos.org',
    phone: '+91 98201 44521',
    mentorshipOffered: true,
  },
  {
    id: 'alm-03',
    admissionNo: 'ADM-2018-105',
    name: 'Dr. Siddharth Varma',
    passingYear: 2020,
    boardRollNo: 'CBSE-2130-7734',
    stream: 'SCIENCE',
    higherEducation: 'AIIMS New Delhi • MBBS',
    currentProfession: 'Junior Resident Physician at Safdarjung Hospital',
    location: 'New Delhi, India',
    email: 'dr.siddharth@alumni.vidyaos.org',
    phone: '+91 98103 88471',
    mentorshipOffered: true,
  },
  {
    id: 'alm-04',
    admissionNo: 'ADM-2019-142',
    name: 'Tanvi Saxena',
    passingYear: 2023,
    boardRollNo: 'CBSE-2130-6621',
    stream: 'HUMANITIES',
    higherEducation: 'National Law School of India University (NLSIU) Bangalore • B.A. LL.B',
    currentProfession: 'Law Clerk at Supreme Court of India',
    location: 'New Delhi, India',
    email: 'tanvi.saxena@alumni.vidyaos.org',
    phone: '+91 98711 23490',
    mentorshipOffered: false,
  },
];

/**
 * Curated Active Transcript Verification Requests
 */
export const INITIAL_TRANSCRIPT_REQUESTS: TranscriptRequest[] = [
  {
    id: 'tr-01',
    alumniId: 'alm-01',
    alumniName: 'Rohan Deshmukh',
    passingYear: 2021,
    documentType: 'WES_APOSTILLE_VERIFICATION',
    recipientInstitution: 'World Education Services (WES) Canada — Reference #5892144',
    applicationDate: '2024-11-20',
    verificationBarcode: 'VIDYA-ADM-2016-042-WES-9102',
    status: 'VERIFIED_BY_REGISTRAR',
  },
  {
    id: 'tr-02',
    alumniId: 'alm-02',
    alumniName: 'Pooja Iyer',
    passingYear: 2022,
    documentType: 'OFFICIAL_TRANSCRIPT',
    recipientInstitution: 'London Business School (Masters in Finance Admissions)',
    applicationDate: '2024-11-23',
    verificationBarcode: 'VIDYA-ADM-2017-088-OFF-4412',
    status: 'SUBMITTED',
  },
];
