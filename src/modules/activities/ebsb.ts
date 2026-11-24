/**
 * VidyaOS - Ek Bharat Shreshtha Bharat (EBSB) & Bhasha Sangam Cultural Hub
 * Compliant with Ministry of Education EBSB Guidelines and CBSE Annual Cultural Exchange Circulars
 */

export type EBSBPillar =
  | 'bhasha_sangam'
  | 'cuisine_food'
  | 'folk_dance_music'
  | 'indigenous_sports'
  | 'virtual_exchange'
  | 'heritage_monument';

export interface StatePairingInfo {
  hostState: string;
  pairedState: string;
  pairedCapital: string;
  officialLanguages: string[];
  traditionalCuisine: string[];
  folkArtForms: string[];
  indigenousGames: string[];
  partnerSchoolName: string;
  partnerSchoolCity: string;
  partnerSchoolAffiliationNo: string;
}

export interface BhashaSentence {
  id: string;
  sentenceNo: number; // 1 to 100
  englishText: string;
  hindiText: string;
  pairedLanguageText: string; // Native script
  transliteration: string; // Romanized phonetic pronunciation
  audioGuideUrl?: string;
  category: 'greeting' | 'daily_conversation' | 'school_life' | 'culture_festivals' | 'courtesy';
}

export interface EBSBActivity {
  id: string;
  title: string;
  pillar: EBSBPillar;
  scheduledDate: string;
  targetGrades: string[];
  participantCount: number;
  pairedStateFocus: string;
  description: string;
  status: 'planned' | 'completed';
  evidencePhotoCount: number;
  reportFiledToCBSE: boolean;
}

export interface StudentLanguageProgress {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  pairedLanguage: string;
  sentencesMastered: number; // out of 100
  badgeEarned: 'Linguistic Explorer' | 'Bhasha Mitra' | 'Bhasha Champion';
  lastPracticedDate: string;
}

export interface EBSBComplianceReport {
  pillarsCoveredCount: number;
  totalPillars: number; // 6
  pillarCoveragePercentage: number;
  totalActivitiesConducted: number;
  totalStudentReach: number;
  bhashaMasteryAveragePercentage: number;
  cbsePortalStatus: 'Exemplary' | 'Active' | 'Needs Attention';
}

export function formatPillarTitle(pillar: EBSBPillar): string {
  switch (pillar) {
    case 'bhasha_sangam':
      return 'Bhasha Sangam (100 Sentences)';
    case 'cuisine_food':
      return 'Traditional Cuisine & Culinary Heritage';
    case 'folk_dance_music':
      return 'Folk Dance, Music & Indigenous Attire';
    case 'indigenous_sports':
      return 'Traditional & Indigenous Sports';
    case 'virtual_exchange':
      return 'Partner School Virtual Video Exchange';
    case 'heritage_monument':
      return 'Heritage Monument Adoption & Quiz';
  }
}

/**
 * Calculates student Bhasha Sangam badge level based on sentences mastered
 */
export function calculateBhashaBadge(sentencesMastered: number): 'Linguistic Explorer' | 'Bhasha Mitra' | 'Bhasha Champion' {
  if (sentencesMastered >= 75) return 'Bhasha Champion';
  if (sentencesMastered >= 35) return 'Bhasha Mitra';
  return 'Linguistic Explorer';
}

/**
 * Calculates Institutional EBSB Compliance Report for CBSE annual upload
 */
export function calculateEBSBCompliance(
  activities: EBSBActivity[],
  studentLogs: StudentLanguageProgress[]
): EBSBComplianceReport {
  const completed = activities.filter((a) => a.status === 'completed');
  const distinctPillars = new Set(completed.map((a) => a.pillar));
  const coveredCount = distinctPillars.size;
  const totalPillars = 6;
  const pillarPct = Math.round((coveredCount / totalPillars) * 100);

  const totalReach = completed.reduce((acc, a) => acc + a.participantCount, 0);

  const totalMastery = studentLogs.reduce((acc, s) => acc + s.sentencesMastered, 0);
  const avgMastery = studentLogs.length > 0 ? Math.round(totalMastery / studentLogs.length) : 0;

  let portalStatus: EBSBComplianceReport['cbsePortalStatus'] = 'Needs Attention';
  if (pillarPct >= 80 && completed.length >= 4) {
    portalStatus = 'Exemplary';
  } else if (pillarPct >= 50 && completed.length >= 2) {
    portalStatus = 'Active';
  }

  return {
    pillarsCoveredCount: coveredCount,
    totalPillars,
    pillarCoveragePercentage: pillarPct,
    totalActivitiesConducted: completed.length,
    totalStudentReach: totalReach,
    bhashaMasteryAveragePercentage: avgMastery,
    cbsePortalStatus: portalStatus,
  };
}

export const INITIAL_STATE_PAIRING: StatePairingInfo = {
  hostState: 'Delhi (NCT)',
  pairedState: 'Sikkim',
  pairedCapital: 'Gangtok',
  officialLanguages: ['Nepali', 'Sikkimese (Bhutia)', 'Lepcha', 'English'],
  traditionalCuisine: ['Momos', 'Thukpa', 'Gundruk', 'Phagshapa', 'Kinema Curry', 'Sel Roti'],
  folkArtForms: ['Cham Mask Dance', 'Maruni Dance', 'Tamang Selo', 'Thangka Painting', 'Choktse Woodcarving'],
  indigenousGames: ['Darcho (Traditional Archery)', 'Chholley', 'Khuru (Dart Throwing)', 'Kabaddi'],
  partnerSchoolName: 'Government Senior Secondary School, Tadong',
  partnerSchoolCity: 'Gangtok, East Sikkim',
  partnerSchoolAffiliationNo: '1820005',
};

export const INITIAL_BHASHA_SENTENCES: BhashaSentence[] = [
  {
    id: 'bs-001',
    sentenceNo: 1,
    englishText: 'Hello / Greetings!',
    hindiText: 'नमस्ते / नमस्कार!',
    pairedLanguageText: 'नमस्ते / नमस्कार!',
    transliteration: 'Namaste / Namaskar!',
    category: 'greeting',
  },
  {
    id: 'bs-002',
    sentenceNo: 2,
    englishText: 'What is your name?',
    hindiText: 'आपका नाम क्या है?',
    pairedLanguageText: 'तपाईंको नाम के हो?',
    transliteration: 'Tapāīm̐kō nāma kē hō?',
    category: 'greeting',
  },
  {
    id: 'bs-003',
    sentenceNo: 3,
    englishText: 'My name is Aarav.',
    hindiText: 'मेरा नाम आरव है।',
    pairedLanguageText: 'मेरो नाम आरव हो।',
    transliteration: 'Mērō nāma Aarav hō.',
    category: 'greeting',
  },
  {
    id: 'bs-004',
    sentenceNo: 4,
    englishText: 'How are you?',
    hindiText: 'आप कैसे हैं?',
    pairedLanguageText: 'तपाईंलाई कस्तो छ?',
    transliteration: 'Tapāīm̐lāī kastō cha?',
    category: 'daily_conversation',
  },
  {
    id: 'bs-005',
    sentenceNo: 5,
    englishText: 'I am fine, thank you.',
    hindiText: 'मैं ठीक हूँ, धन्यवाद।',
    pairedLanguageText: 'म ठीक छु, धन्यवाद।',
    transliteration: 'Ma thīka chu, dhan’yavāda.',
    category: 'daily_conversation',
  },
  {
    id: 'bs-006',
    sentenceNo: 6,
    englishText: 'Welcome to our school!',
    hindiText: 'हमारे विद्यालय में आपका स्वागत है!',
    pairedLanguageText: 'हाम्रो विद्यालयमा तपाईंलाई स्वागत छ!',
    transliteration: 'Hāmrō vidyālayamā tapāīm̐lāī svāgata cha!',
    category: 'school_life',
  },
  {
    id: 'bs-007',
    sentenceNo: 7,
    englishText: 'Sikkim is a beautiful organic state.',
    hindiText: 'सिक्किम एक सुंदर जैविक राज्य है।',
    pairedLanguageText: 'सिक्किम एउटा सुन्दर जैविक राज्य हो।',
    transliteration: 'Sikkim ē’uṭā sundara jaivika rājya hō.',
    category: 'culture_festivals',
  },
];

export const INITIAL_EBSB_ACTIVITIES: EBSBActivity[] = [
  {
    id: 'ebsb-001',
    title: 'Daily Morning Assembly Bhasha Sangam: Nepali & Bhutia Greetings',
    pillar: 'bhasha_sangam',
    scheduledDate: '2026-11-04',
    targetGrades: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    participantCount: 420,
    pairedStateFocus: 'Sikkim',
    description:
      'Daily morning prayer session where students recite 5 conversational sentences in Nepali and Bhutia languages with phonetic audio guides.',
    status: 'completed',
    evidencePhotoCount: 14,
    reportFiledToCBSE: true,
  },
  {
    id: 'ebsb-002',
    title: 'Sikkimese Traditional Culinary Tasting & Organic Food Fest',
    pillar: 'cuisine_food',
    scheduledDate: '2026-11-15',
    targetGrades: ['Class 8', 'Class 9', 'Class 10'],
    participantCount: 185,
    pairedStateFocus: 'Sikkim',
    description:
      'Live cooking demonstration of Sel Roti, Thukpa and steamed vegetable Momos, explaining the organic agriculture model of Sikkim.',
    status: 'completed',
    evidencePhotoCount: 22,
    reportFiledToCBSE: true,
  },
  {
    id: 'ebsb-003',
    title: 'Maruni Folk Dance & Thangka Painting Exhibition',
    pillar: 'folk_dance_music',
    scheduledDate: '2026-11-20',
    targetGrades: ['Class 9', 'Class 10', 'Class 11'],
    participantCount: 140,
    pairedStateFocus: 'Sikkim',
    description:
      'Students dressed in traditional Bakhu (Kho) attire performed the Maruni folk dance and exhibited handmade Thangka geometric tapestries.',
    status: 'completed',
    evidencePhotoCount: 18,
    reportFiledToCBSE: true,
  },
  {
    id: 'ebsb-004',
    title: 'Traditional Himalayan Archery & Darcho Sports Clinic',
    pillar: 'indigenous_sports',
    scheduledDate: '2026-11-28',
    targetGrades: ['Class 7', 'Class 8', 'Class 9'],
    participantCount: 95,
    pairedStateFocus: 'Sikkim',
    description:
      'Introduction to indigenous archery stances and traditional target scoring games popular in Gangtok and West Sikkim villages.',
    status: 'completed',
    evidencePhotoCount: 12,
    reportFiledToCBSE: true,
  },
  {
    id: 'ebsb-005',
    title: 'Virtual Student Exchange: Vidya Mandir Delhi & GSSS Tadong (Gangtok)',
    pillar: 'virtual_exchange',
    scheduledDate: '2026-12-08',
    targetGrades: ['Class 10', 'Class 11'],
    participantCount: 60,
    pairedStateFocus: 'Sikkim',
    description:
      'Interactive 90-minute digital classroom conference with students from Tadong Gangtok discussing climate conservation and biodiversity in the Himalayas.',
    status: 'planned',
    evidencePhotoCount: 0,
    reportFiledToCBSE: false,
  },
  {
    id: 'ebsb-006',
    title: 'CBSE Heritage India Quiz: Monuments of Delhi & Monasteries of Sikkim',
    pillar: 'heritage_monument',
    scheduledDate: '2026-12-14',
    targetGrades: ['Class 9', 'Class 10', 'Class 11', 'Class 12'],
    participantCount: 120,
    pairedStateFocus: 'Delhi & Sikkim',
    description:
      'Inter-house digital multimedia quiz comparing the architecture of Rumtek and Enchey Monasteries with Indo-Islamic architecture of Delhi.',
    status: 'planned',
    evidencePhotoCount: 0,
    reportFiledToCBSE: false,
  },
];

export const INITIAL_STUDENT_BHASHA_LOGS: StudentLanguageProgress[] = [
  {
    id: 'log-01',
    studentId: 'STU-1021',
    studentName: 'Aarav Sharma',
    grade: 'Class 10',
    section: 'A',
    pairedLanguage: 'Nepali (Sikkim)',
    sentencesMastered: 82,
    badgeEarned: 'Bhasha Champion',
    lastPracticedDate: '2026-11-22',
  },
  {
    id: 'log-02',
    studentId: 'STU-1024',
    studentName: 'Diya Sengupta',
    grade: 'Class 10',
    section: 'B',
    pairedLanguage: 'Nepali (Sikkim)',
    sentencesMastered: 64,
    badgeEarned: 'Bhasha Mitra',
    lastPracticedDate: '2026-11-21',
  },
  {
    id: 'log-03',
    studentId: 'STU-1033',
    studentName: 'Ananya Deshmukh',
    grade: 'Class 11',
    section: 'A',
    pairedLanguage: 'Bhutia (Sikkimese)',
    sentencesMastered: 45,
    badgeEarned: 'Bhasha Mitra',
    lastPracticedDate: '2026-11-20',
  },
  {
    id: 'log-04',
    studentId: 'STU-1040',
    studentName: 'Harshvardhan Singh',
    grade: 'Class 12',
    section: 'A',
    pairedLanguage: 'Nepali (Sikkim)',
    sentencesMastered: 90,
    badgeEarned: 'Bhasha Champion',
    lastPracticedDate: '2026-11-23',
  },
  {
    id: 'log-05',
    studentId: 'STU-1051',
    studentName: 'Tanvi Aggarwal',
    grade: 'Class 12',
    section: 'A',
    pairedLanguage: 'Lepcha',
    sentencesMastered: 30,
    badgeEarned: 'Linguistic Explorer',
    lastPracticedDate: '2026-11-18',
  },
];
