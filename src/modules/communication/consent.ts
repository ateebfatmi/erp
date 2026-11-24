/**
 * VidyaOS - Parental Digital Consent & Field Trip Authorization Engine
 * Compliant with POCSO guidelines, CBSE Student Safety Circulars, and excursion boarding protocols.
 */

export type ConsentCategory =
  | 'FIELD_TRIP'
  | 'SPORTS_CAMP'
  | 'HEALTH_CHECKUP'
  | 'MEDIA_RELEASE'
  | 'EXTRA_CLASS';

export type ConsentStatus = 'PENDING' | 'GRANTED' | 'DECLINED';

export interface ConsentCampaign {
  id: string;
  title: string;
  category: ConsentCategory;
  description: string;
  targetClasses: string[];
  eventDate: string; // YYYY-MM-DD
  reportingTime: string; // e.g. "08:15 AM"
  returnTime: string; // e.g. "03:30 PM"
  destination: string;
  facultyInCharge: string;
  facultyPhone: string;
  costInr: number;
  inclusions: string[];
  safetyProtocol: string;
  deadlineDate: string;
  status: 'ACTIVE' | 'CLOSED';
}

export interface StudentConsentRecord {
  id: string;
  campaignId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  rollNo: string;
  status: ConsentStatus;
  parentName?: string;
  emergencyPhone?: string;
  decidedAt?: string;
  specialMedicalNotes?: string;
}

/**
 * Records or updates a parent's digital consent decision for a student excursion or activity.
 */
export function recordParentalConsent(
  records: StudentConsentRecord[],
  campaignId: string,
  studentId: string,
  decision: 'GRANTED' | 'DECLINED',
  parentName: string,
  emergencyPhone: string,
  notes?: string
): StudentConsentRecord[] {
  const now = new Date().toISOString();

  return records.map((rec) => {
    if (rec.campaignId === campaignId && rec.studentId === studentId) {
      return {
        ...rec,
        status: decision,
        parentName,
        emergencyPhone,
        decidedAt: now,
        specialMedicalNotes: notes,
      };
    }
    return rec;
  });
}

/**
 * Calculates manifest metrics (granted, pending, declined) for school administration and bus planning.
 */
export function calculateConsentManifestSummary(
  records: StudentConsentRecord[],
  campaignId: string
): {
  totalStudents: number;
  grantedCount: number;
  declinedCount: number;
  pendingCount: number;
  consentPercentage: number;
} {
  const campaignRecords = records.filter((r) => r.campaignId === campaignId);
  const totalStudents = campaignRecords.length;

  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      grantedCount: 0,
      declinedCount: 0,
      pendingCount: 0,
      consentPercentage: 0,
    };
  }

  const grantedCount = campaignRecords.filter((r) => r.status === 'GRANTED').length;
  const declinedCount = campaignRecords.filter((r) => r.status === 'DECLINED').length;
  const pendingCount = campaignRecords.filter((r) => r.status === 'PENDING').length;
  const consentPercentage = Math.round((grantedCount / totalStudents) * 100);

  return {
    totalStudents,
    grantedCount,
    declinedCount,
    pendingCount,
    consentPercentage,
  };
}

/**
 * Generates the official passenger boarding manifest: only students with verified 'GRANTED' consent.
 */
export function getAuthorizedPassengerManifest(
  records: StudentConsentRecord[],
  campaignId: string
): StudentConsentRecord[] {
  return records.filter((r) => r.campaignId === campaignId && r.status === 'GRANTED');
}

export const INITIAL_CONSENT_CAMPAIGNS: ConsentCampaign[] = [
  {
    id: 'cmp-01',
    title: 'National Science Centre & Nehru Planetarium Educational Excursion',
    category: 'FIELD_TRIP',
    description:
      'Curriculum experiential tour exploring the 3D Space Dome, Human Biology interactive gallery, and Nuclear Energy demonstration exhibits.',
    targetClasses: ['Class 10-A', 'Class 10-B', 'Class 10-C'],
    eventDate: '2024-12-06',
    reportingTime: '08:15 AM at School Main Porch',
    returnTime: '03:45 PM at Campus Gate 2',
    destination: 'National Science Centre, Bhairon Road, Pragati Maidan, New Delhi',
    facultyInCharge: 'Dr. S. K. Rastogi (HOD Physics)',
    facultyPhone: '+91 98101 44556',
    costInr: 450,
    inclusions: [
      'Deluxe AC Coach Transport with GPS & Speed Governor',
      'Planetarium Sky-Show 3D Entry Pass',
      'Hygienic Boxed Lunch & Mineral Water',
      'Comprehensive Medical First Aid Kit on Bus',
    ],
    safetyProtocol:
      'Ratio of 1 teacher per 15 students. Dedicated school nurse escorting. Real-time GPS bus broadcast enabled for all parents.',
    deadlineDate: '2024-12-02',
    status: 'ACTIVE',
  },
  {
    id: 'cmp-02',
    title: 'Inter-School CBSE Zonal Athletics & Football Tournament Camp',
    category: 'SPORTS_CAMP',
    description:
      'Participation in 3-day zonal athletic heats, track events (100m, 400m, 4x100m relay) and football quarterfinals.',
    targetClasses: ['Class 9-A', 'Class 10-A', 'Class 11-A', 'Class 12-A'],
    eventDate: '2024-12-14',
    reportingTime: '07:30 AM at Sports Complex',
    returnTime: '05:00 PM at Sports Complex',
    destination: 'Thyagaraj Indoor & Outdoor Sports Stadium, INA, New Delhi',
    facultyInCharge: 'Coach Ranveer Singh (HOD Physical Education)',
    facultyPhone: '+91 98200 77889',
    costInr: 0,
    inclusions: [
      'School Athletic Jersey & Track Kit',
      'Sports Physiotherapist Escort',
      'High-Protein Electrolyte Hydration Station',
      'Official CBSE Tournament Certification',
    ],
    safetyProtocol:
      'Certified athletic trainer present on site. Immediate infirmary transfer standby in school emergency van.',
    deadlineDate: '2024-12-08',
    status: 'ACTIVE',
  },
  {
    id: 'cmp-03',
    title: 'Annual Dental & Preventive Ophthalmology Screening Clinic',
    category: 'HEALTH_CHECKUP',
    description:
      'Free in-campus annual dental caries examination, vision acuity Snellen check, and pediatric postural screening per CBSE health mandates.',
    targetClasses: ['Class 10-A', 'Class 10-B'],
    eventDate: '2024-11-28',
    reportingTime: 'During Regular School Hours',
    returnTime: 'Regular Dismissal',
    destination: 'School Medical Infirmary Wing & AV Hall 1',
    facultyInCharge: 'Sister Rekha (RN) & Dr. Alok Verma (Pediatrician)',
    facultyPhone: '+91 98100 11223',
    costInr: 0,
    inclusions: [
      'Comprehensive Dental & Vision Diagnostic Check',
      'Official CBSE Health Card Updation',
      'Preventive Oral Hygiene Dental Kit',
    ],
    safetyProtocol:
      'Sterile single-use disposable diagnostic mirrors and probes. Certified medical doctors from empanelled hospital.',
    deadlineDate: '2024-11-27',
    status: 'ACTIVE',
  },
];

export const INITIAL_STUDENT_CONSENTS: StudentConsentRecord[] = [
  {
    id: 'con-101',
    campaignId: 'cmp-01',
    studentId: 'stu-01',
    studentName: 'Aarav Mehta',
    admissionNo: 'DPGA/2021/1042',
    classSection: 'Class 10-A',
    rollNo: '14',
    status: 'GRANTED',
    parentName: 'Mr. Rajesh Mehta',
    emergencyPhone: '+91 98101 23456',
    decidedAt: '2024-11-22T10:15:00Z',
    specialMedicalNotes: 'Mild seasonal pollen allergy; carries personal antihistamine inhaler.',
  },
  {
    id: 'con-102',
    campaignId: 'cmp-01',
    studentId: 'stu-02',
    studentName: 'Diya Sharma',
    admissionNo: 'DPGA/2021/1089',
    classSection: 'Class 10-A',
    rollNo: '18',
    status: 'GRANTED',
    parentName: 'Mrs. Sunita Sharma',
    emergencyPhone: '+91 98102 33445',
    decidedAt: '2024-11-22T11:45:00Z',
  },
  {
    id: 'con-103',
    campaignId: 'cmp-01',
    studentId: 'stu-03',
    studentName: 'Kabir Verma',
    admissionNo: 'DPGA/2020/0912',
    classSection: 'Class 10-A',
    rollNo: '22',
    status: 'PENDING',
  },
  {
    id: 'con-104',
    campaignId: 'cmp-01',
    studentId: 'stu-04',
    studentName: 'Rohan Gupta',
    admissionNo: 'DPGA/2022/1155',
    classSection: 'Class 10-A',
    rollNo: '31',
    status: 'DECLINED',
    parentName: 'Mr. P. K. Gupta',
    emergencyPhone: '+91 98200 44556',
    decidedAt: '2024-11-23T09:20:00Z',
    specialMedicalNotes: 'Family out of town on scheduled date.',
  },
  {
    id: 'con-201',
    campaignId: 'cmp-02',
    studentId: 'stu-01',
    studentName: 'Aarav Mehta',
    admissionNo: 'DPGA/2021/1042',
    classSection: 'Class 10-A',
    rollNo: '14',
    status: 'PENDING',
  },
];
