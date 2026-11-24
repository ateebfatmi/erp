import { describe, it, expect } from 'vitest';
import {
  filterAlumniDirectory,
  filterAlumniMentors,
  createMentorshipRequest,
  updateMentorshipStatus,
  generateVerificationBarcode,
  INITIAL_ALUMNI_ROSTER,
  INITIAL_MENTORSHIP_SESSIONS,
} from '../alumni';

describe('Alumni Directory & Mentorship Guidance Engine', () => {
  it('filters alumni by graduation batch year and academic stream', () => {
    const batch2021 = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 2021);
    expect(batch2021.length).toBe(1);
    expect(batch2021[0].name).toBe('Rohan Deshmukh');

    const scienceGrads = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'SCIENCE');
    expect(scienceGrads.length).toBe(2);
    expect(scienceGrads.every((a) => a.stream === 'SCIENCE')).toBe(true);

    const humanitiesGrads = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'HUMANITIES');
    expect(humanitiesGrads.length).toBe(2);
    expect(humanitiesGrads.some((a) => a.name === 'Tanvi Saxena')).toBe(true);
  });

  it('searches alumni by career, institution, or keyword', () => {
    const aiimsSearch = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'ALL', 'AIIMS');
    expect(aiimsSearch.length).toBe(1);
    expect(aiimsSearch[0].name).toBe('Dr. Siddharth Varma');

    const appleSearch = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'ALL', 'Apple');
    expect(appleSearch.length).toBe(1);
    expect(appleSearch[0].location).toContain('Cupertino');
  });

  it('filters active alumni mentors by domain and expertise keyword', () => {
    const techMentors = filterAlumniMentors(INITIAL_ALUMNI_ROSTER, 'ENGINEERING_TECH');
    expect(techMentors.length).toBe(1);
    expect(techMentors[0].name).toBe('Rohan Deshmukh');

    const upscMentors = filterAlumniMentors(INITIAL_ALUMNI_ROSTER, 'CIVIL_SERVICES_UPSC');
    expect(upscMentors.length).toBe(1);
    expect(upscMentors[0].name).toContain('Vikramaditya Rao');

    const clatSearch = filterAlumniMentors(INITIAL_ALUMNI_ROSTER, 'ALL', 'CLAT');
    expect(clatSearch.length).toBe(1);
    expect(clatSearch[0].name).toBe('Tanvi Saxena');
  });

  it('creates and validates a 1:1 mentorship booking session', () => {
    const mentor = INITIAL_ALUMNI_ROSTER[0]; // Rohan Deshmukh
    const session = createMentorshipRequest(mentor, {
      studentAdmissionNo: 'ADM-2024-001',
      studentName: 'Aarav Mehta',
      studentGrade: 'Class 10A',
      statementOfPurpose: 'Seeking JEE Advanced prep guidance and IIT Bombay CS career insights.',
      preferredSlot: 'Saturday 7:00 PM IST',
    });

    expect(session.status).toBe('CONFIRMED');
    expect(session.alumniName).toBe('Rohan Deshmukh');
    expect(session.meetingPlatform).toBe('Google Meet');
    expect(session.meetingUrl).toContain('meet.google.com/vidya-alm-01');
  });

  it('rejects mentorship bookings if mentor is unavailable or statement is too short', () => {
    const unavailableMentor = {
      ...INITIAL_ALUMNI_ROSTER[0],
      mentorshipOffered: false,
    };

    expect(() =>
      createMentorshipRequest(unavailableMentor, {
        studentAdmissionNo: 'ADM-2024-001',
        studentName: 'Aarav Mehta',
        studentGrade: 'Class 10A',
        statementOfPurpose: 'A detailed valid reason for wanting to connect with the mentor.',
        preferredSlot: 'Saturday 7:00 PM IST',
      })
    ).toThrowError(/not accepting mentorship bookings/);

    expect(() =>
      createMentorshipRequest(INITIAL_ALUMNI_ROSTER[0], {
        studentAdmissionNo: 'ADM-2024-001',
        studentName: 'Aarav Mehta',
        studentGrade: 'Class 10A',
        statementOfPurpose: 'Hi help me', // too short
        preferredSlot: 'Saturday 7:00 PM IST',
      })
    ).toThrowError(/substantive Statement of Purpose/);
  });

  it('updates mentorship session status and attaches feedback notes', () => {
    const sessions = updateMentorshipStatus(
      INITIAL_MENTORSHIP_SESSIONS,
      'MNT-88102',
      'COMPLETED',
      'Excellent discussion on physics problem solving.'
    );

    const updated = sessions.find((s) => s.id === 'MNT-88102');
    expect(updated?.status).toBe('COMPLETED');
    expect(updated?.mentorFeedbackNote).toBe('Excellent discussion on physics problem solving.');
  });

  it('generates compliant institutional verification barcodes for WES & transcripts', () => {
    const barcode = generateVerificationBarcode('ADM-2016-042', 'WES_APOSTILLE_VERIFICATION');
    expect(barcode).toContain('VIDYA-ADM-2016-042');
    expect(barcode).toContain('WES');
  });
});
