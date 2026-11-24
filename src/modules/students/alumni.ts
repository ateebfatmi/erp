/**
 * Commercial Alumni Network & Digital Transcript Verification Engine
 * Manages institutional alumni directory, graduate career tracking,
 * 1:1 career mentorship matching, and official educational document verification (WES, Apostille, Transcripts).
 */

export type MentorshipDomain =
  | 'ENGINEERING_TECH'
  | 'MEDICINE_HEALTHCARE'
  | 'COMMERCE_FINANCE'
  | 'LAW_JUDICIARY'
  | 'CIVIL_SERVICES_UPSC'
  | 'CREATIVE_ARTS_MEDIA';

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
  domain?: MentorshipDomain;
  companyOrOrg?: string;
  expertiseAreas?: string[];
  availableSlots?: string[];
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

export type MentorshipStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface MentorshipSessionRequest {
  id: string;
  alumniId: string;
  alumniName: string;
  studentAdmissionNo: string;
  studentName: string;
  studentGrade: string;
  targetDomain: MentorshipDomain;
  statementOfPurpose: string;
  preferredSlot: string;
  meetingPlatform: 'Google Meet' | 'Microsoft Teams' | 'Zoom';
  meetingUrl?: string;
  status: MentorshipStatus;
  requestDate: string;
  mentorFeedbackNote?: string;
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
      a.location.toLowerCase().includes(q) ||
      (a.companyOrOrg && a.companyOrOrg.toLowerCase().includes(q))
    );
  });
}

/**
 * Filters alumni mentors offering active 1:1 guidance
 */
export function filterAlumniMentors(
  alumniList: AlumniProfile[],
  domain?: MentorshipDomain | 'ALL',
  query = ''
): AlumniProfile[] {
  const q = query.trim().toLowerCase();

  return alumniList.filter((a) => {
    if (!a.mentorshipOffered) return false;
    const matchesDomain = !domain || domain === 'ALL' || a.domain === domain;
    if (!matchesDomain) return false;
    if (!q) return true;

    return (
      a.name.toLowerCase().includes(q) ||
      a.higherEducation.toLowerCase().includes(q) ||
      a.currentProfession.toLowerCase().includes(q) ||
      (a.expertiseAreas && a.expertiseAreas.some((exp) => exp.toLowerCase().includes(q)))
    );
  });
}

/**
 * Creates a validated 1:1 student-to-alumni mentorship consultation request
 */
export function createMentorshipRequest(
  mentor: AlumniProfile,
  params: {
    studentAdmissionNo: string;
    studentName: string;
    studentGrade: string;
    statementOfPurpose: string;
    preferredSlot: string;
  }
): MentorshipSessionRequest {
  if (!mentor.mentorshipOffered) {
    throw new Error(`Alumni ${mentor.name} is currently not accepting mentorship bookings.`);
  }

  if (params.statementOfPurpose.trim().length < 15) {
    throw new Error('Please provide a substantive Statement of Purpose (minimum 15 characters).');
  }

  const reqId = `MNT-${Date.now().toString().slice(-6)}`;
  const meetCode = `vidya-${mentor.id}-${params.studentAdmissionNo.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return {
    id: reqId,
    alumniId: mentor.id,
    alumniName: mentor.name,
    studentAdmissionNo: params.studentAdmissionNo,
    studentName: params.studentName,
    studentGrade: params.studentGrade,
    targetDomain: mentor.domain || 'ENGINEERING_TECH',
    statementOfPurpose: params.statementOfPurpose.trim(),
    preferredSlot: params.preferredSlot,
    meetingPlatform: 'Google Meet',
    meetingUrl: `https://meet.google.com/${meetCode}`,
    status: 'CONFIRMED',
    requestDate: new Date().toISOString().split('T')[0],
  };
}

/**
 * Updates status of a mentorship session
 */
export function updateMentorshipStatus(
  sessions: MentorshipSessionRequest[],
  sessionId: string,
  newStatus: MentorshipStatus,
  feedbackNote?: string
): MentorshipSessionRequest[] {
  return sessions.map((s) => {
    if (s.id !== sessionId) return s;
    return {
      ...s,
      status: newStatus,
      mentorFeedbackNote: feedbackNote || s.mentorFeedbackNote,
    };
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
    domain: 'ENGINEERING_TECH',
    higherEducation: 'IIT Bombay • B.Tech Computer Science & Engineering',
    currentProfession: 'Systems Engineer at Apple, Silicon Valley',
    companyOrOrg: 'Apple Inc.',
    location: 'Cupertino, CA, USA',
    email: 'rohan.deshmukh@alumni.vidyaos.org',
    phone: '+1 408 555 0192',
    mentorshipOffered: true,
    expertiseAreas: ['JEE Advanced Strategy', 'IIT Bombay CS Curriculum', 'AI / Systems Architecture', 'Study Abroad in USA'],
    availableSlots: ['Saturday 7:00 PM IST', 'Sunday 10:00 AM IST'],
  },
  {
    id: 'alm-02',
    admissionNo: 'ADM-2017-088',
    name: 'Pooja Iyer',
    passingYear: 2022,
    boardRollNo: 'CBSE-2130-8812',
    stream: 'COMMERCE',
    domain: 'COMMERCE_FINANCE',
    higherEducation: 'SRCC Delhi University • B.Com (Hons) & CFA Level 2',
    currentProfession: 'Investment Banking Analyst at Goldman Sachs',
    companyOrOrg: 'Goldman Sachs',
    location: 'Mumbai, India',
    email: 'pooja.iyer@alumni.vidyaos.org',
    phone: '+91 98201 44521',
    mentorshipOffered: true,
    expertiseAreas: ['CUET Commerce Prep', 'SRCC Admission & Campus Life', 'CFA vs CA Roadmap', 'Financial Modeling'],
    availableSlots: ['Saturday 4:00 PM IST', 'Sunday 5:00 PM IST'],
  },
  {
    id: 'alm-03',
    admissionNo: 'ADM-2018-105',
    name: 'Dr. Siddharth Varma',
    passingYear: 2020,
    boardRollNo: 'CBSE-2130-7734',
    stream: 'SCIENCE',
    domain: 'MEDICINE_HEALTHCARE',
    higherEducation: 'AIIMS New Delhi • MBBS (Gold Medalist)',
    currentProfession: 'Junior Resident Physician at Safdarjung Hospital',
    companyOrOrg: 'Safdarjung Hospital / AIIMS',
    location: 'New Delhi, India',
    email: 'dr.siddharth@alumni.vidyaos.org',
    phone: '+91 98103 88471',
    mentorshipOffered: true,
    expertiseAreas: ['NEET UG 700+ Score Strategy', 'Biology NCERT Mastery', 'AIIMS Medical Life', 'USMLE Guidance'],
    availableSlots: ['Sunday 2:00 PM IST', 'Sunday 6:00 PM IST'],
  },
  {
    id: 'alm-04',
    admissionNo: 'ADM-2019-142',
    name: 'Tanvi Saxena',
    passingYear: 2023,
    boardRollNo: 'CBSE-2130-6621',
    stream: 'HUMANITIES',
    domain: 'LAW_JUDICIARY',
    higherEducation: 'National Law School of India University (NLSIU) Bangalore • B.A. LL.B',
    currentProfession: 'Law Clerk at Supreme Court of India',
    companyOrOrg: 'Supreme Court of India',
    location: 'New Delhi, India',
    email: 'tanvi.saxena@alumni.vidyaos.org',
    phone: '+91 98711 23490',
    mentorshipOffered: true,
    expertiseAreas: ['CLAT UG Rank 1-100 Plan', 'NLSIU Moot Court Culture', 'Corporate Law Internships', 'Judicial Services'],
    availableSlots: ['Saturday 5:30 PM IST'],
  },
  {
    id: 'alm-05',
    admissionNo: 'ADM-2015-018',
    name: 'Vikramaditya Rao, IAS',
    passingYear: 2018,
    boardRollNo: 'CBSE-2130-5519',
    stream: 'HUMANITIES',
    domain: 'CIVIL_SERVICES_UPSC',
    higherEducation: 'St. Stephen\'s College • B.A. History (Hons)',
    currentProfession: 'Assistant Collector & Sub-Divisional Magistrate (SDM)',
    companyOrOrg: 'Government of India (IAS)',
    location: 'Dehradun, Uttarakhand, India',
    email: 'vikramaditya.ias@alumni.vidyaos.org',
    phone: '+91 94111 00219',
    mentorshipOffered: true,
    expertiseAreas: ['UPSC Civil Services Prelims & Mains', 'Answer Writing Skills', 'Optional Subject Selection', 'General Studies'],
    availableSlots: ['Sunday 11:00 AM IST'],
  },
];

/**
 * Curated Pre-seeded Mentorship Sessions
 */
export const INITIAL_MENTORSHIP_SESSIONS: MentorshipSessionRequest[] = [
  {
    id: 'MNT-88102',
    alumniId: 'alm-01',
    alumniName: 'Rohan Deshmukh',
    studentAdmissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    studentGrade: 'Class 10A',
    targetDomain: 'ENGINEERING_TECH',
    statementOfPurpose: 'Preparing for JEE Advanced 2026. Would love guidance on managing CBSE Class 11-12 PCM syllabus alongside advanced physics problem-solving and exploring IIT Bombay CS expectations.',
    preferredSlot: 'Saturday 7:00 PM IST',
    meetingPlatform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/vidya-alm-01-adm2024001',
    status: 'CONFIRMED',
    requestDate: '2024-11-20',
    mentorFeedbackNote: 'Confirmed! Focus on HC Verma mechanics and keep your NCERT math fundamentals crystal clear before the session.',
  },
  {
    id: 'MNT-88103',
    alumniId: 'alm-03',
    alumniName: 'Dr. Siddharth Varma',
    studentAdmissionNo: 'ADM-2024-001',
    studentName: 'Aarav Mehta',
    studentGrade: 'Class 10A',
    targetDomain: 'MEDICINE_HEALTHCARE',
    statementOfPurpose: 'Considering whether to choose PCM or PCMB stream in Class 11. Need clarification on medical research pathways vs computer science.',
    preferredSlot: 'Sunday 2:00 PM IST',
    meetingPlatform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/vidya-alm-03-adm2024001',
    status: 'COMPLETED',
    requestDate: '2024-11-10',
    mentorFeedbackNote: 'Completed session. Advised Aarav to focus on STEM core strengths and evaluate computational biology if interested in bridging medical science and tech.',
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
