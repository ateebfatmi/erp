/**
 * VidyaOS - NEP 2020 Senior Secondary Subject Stream & Career Readiness Engine
 * Implements multidisciplinary subject basket selection, board cutoff evaluation, and career mapping.
 */

export type StreamDiscipline =
  | 'SCIENCE_PCM'
  | 'SCIENCE_PCB'
  | 'COMMERCE_WITH_MATH'
  | 'COMMERCE_WITHOUT_MATH'
  | 'HUMANITIES';

export interface SubjectBasket {
  stream: StreamDiscipline;
  title: string;
  streamBadge: string;
  compulsorySubjects: string[];
  electiveOptions: string[];
  maxElectivesAllowed: number;
  minimumAggregateCutoff: number;
  minimumSubjectCutoffs: { subject: string; minMarks: number }[];
  careerPathways: string[];
  entranceExams: string[];
}

export interface StudentAcademicScores {
  math: number;
  science: number;
  english: number;
  socialScience: number;
  aggregatePercent: number;
  [key: string]: number;
}

export const INITIAL_STREAM_BASKETS: SubjectBasket[] = [
  {
    stream: 'SCIENCE_PCM',
    title: 'Science (Physics, Chemistry & Mathematics)',
    streamBadge: 'STEM Engineering & Tech',
    compulsorySubjects: ['English Core', 'Physics', 'Chemistry', 'Mathematics'],
    electiveOptions: [
      'Computer Science (Python)',
      'Artificial Intelligence (CBSE Skill Subject)',
      'Engineering Graphics',
      'Physical Education',
      'Economics',
    ],
    maxElectivesAllowed: 1,
    minimumAggregateCutoff: 75,
    minimumSubjectCutoffs: [
      { subject: 'math', minMarks: 75 },
      { subject: 'science', minMarks: 75 },
    ],
    careerPathways: [
      'Software Engineering & AI Architecture',
      'Aerospace & Robotics Engineering',
      'Data Science & Quantum Computing',
      'Architecture (B.Arch) & Product Design',
    ],
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'NDA (Air Force/Navy)', 'CUET-UG'],
  },
  {
    stream: 'SCIENCE_PCB',
    title: 'Science (Physics, Chemistry & Biology)',
    streamBadge: 'Medical & Life Sciences',
    compulsorySubjects: ['English Core', 'Physics', 'Chemistry', 'Biology'],
    electiveOptions: [
      'Psychology',
      'Biotechnology',
      'Physical Education',
      'Home Science',
      'Fine Arts',
    ],
    maxElectivesAllowed: 1,
    minimumAggregateCutoff: 70,
    minimumSubjectCutoffs: [{ subject: 'science', minMarks: 70 }],
    careerPathways: [
      'Medicine & Surgery (MBBS / BDS)',
      'Biotechnology & Genomic Research',
      'Pharmacy & Clinical Diagnostics',
      'Cognitive Neuroscience & Psychology',
    ],
    entranceExams: ['NEET-UG', 'CUET (Biotech)', 'ICAR AIEEA (Agriculture)', 'AIIMS Nursing'],
  },
  {
    stream: 'COMMERCE_WITH_MATH',
    title: 'Commerce with Applied Mathematics',
    streamBadge: 'Finance, Banking & Quantitative Economics',
    compulsorySubjects: ['English Core', 'Accountancy', 'Business Studies', 'Economics'],
    electiveOptions: [
      'Applied Mathematics',
      'Informatics Practices (IP)',
      'Financial Markets Management (FMM)',
      'Physical Education',
      'Entrepreneurship',
    ],
    maxElectivesAllowed: 1,
    minimumAggregateCutoff: 65,
    minimumSubjectCutoffs: [{ subject: 'math', minMarks: 65 }],
    careerPathways: [
      'Chartered Accountancy (CA) & CFA',
      'Investment Banking & Equity Research',
      'Actuarial Science & Quantitative Finance',
      'Corporate Law & Business Management',
    ],
    entranceExams: ['CA Foundation', 'CUET-UG (SRCC / Shaheed Sukhdev)', 'IPMAT (IIM Indore/Rohtak)', 'CLAT'],
  },
  {
    stream: 'COMMERCE_WITHOUT_MATH',
    title: 'Commerce with Entrepreneurship',
    streamBadge: 'Business Administration & Trade',
    compulsorySubjects: ['English Core', 'Accountancy', 'Business Studies', 'Economics'],
    electiveOptions: [
      'Entrepreneurship',
      'Financial Markets Management (FMM)',
      'Physical Education',
      'Fine Arts',
      'Legal Studies',
    ],
    maxElectivesAllowed: 1,
    minimumAggregateCutoff: 60,
    minimumSubjectCutoffs: [],
    careerPathways: [
      'Business Administration (BBA/BMS)',
      'Hotel & Hospitality Management',
      'Digital Marketing & Media Advertising',
      'Retail & Supply Chain Operations',
    ],
    entranceExams: ['CUET-UG', 'NCHMCT JEE', 'SET Symbiosis', 'Christ University Entrance'],
  },
  {
    stream: 'HUMANITIES',
    title: 'Humanities & Liberal Arts',
    streamBadge: 'Policy, Law & Social Sciences',
    compulsorySubjects: ['English Core', 'Political Science', 'History'],
    electiveOptions: [
      'Economics',
      'Psychology',
      'Sociology',
      'Legal Studies',
      'Geography',
      'Fine Arts',
    ],
    maxElectivesAllowed: 2,
    minimumAggregateCutoff: 55,
    minimumSubjectCutoffs: [{ subject: 'socialScience', minMarks: 55 }],
    careerPathways: [
      'Civil Services (UPSC IAS/IFS/IPS)',
      'Corporate & Constitutional Law',
      'International Diplomacy & Think Tanks',
      'Journalism, Mass Media & Content Direction',
    ],
    entranceExams: ['CLAT (National Law Universities)', 'CUET-UG (St. Stephen / LSR)', 'NID / NIFT', 'TISS-BAT'],
  },
];

/**
 * Evaluates whether a student meets the institutional academic cutoffs for a desired stream.
 */
export function evaluateStreamEligibility(
  scores: StudentAcademicScores,
  stream: StreamDiscipline,
  checkAlternatives: boolean = true
): {
  eligible: boolean;
  shortfallReasons: string[];
  recommendedAlternatives: StreamDiscipline[];
} {
  const basket = INITIAL_STREAM_BASKETS.find((b) => b.stream === stream);
  if (!basket) {
    return {
      eligible: false,
      shortfallReasons: ['Specified stream basket not found in curriculum catalog.'],
      recommendedAlternatives: ['HUMANITIES'],
    };
  }

  const shortfallReasons: string[] = [];

  // Check aggregate cutoff
  if (scores.aggregatePercent < basket.minimumAggregateCutoff) {
    shortfallReasons.push(
      `Aggregate score ${scores.aggregatePercent}% is below the required ${basket.minimumAggregateCutoff}% cutoff for ${basket.title}.`
    );
  }

  // Check subject-specific cutoffs
  for (const cutoff of basket.minimumSubjectCutoffs) {
    const studentMark = scores[cutoff.subject] || 0;
    if (studentMark < cutoff.minMarks) {
      shortfallReasons.push(
        `Score in ${cutoff.subject.toUpperCase()} (${studentMark}%) is below minimum threshold of ${cutoff.minMarks}%.`
      );
    }
  }

  const eligible = shortfallReasons.length === 0;

  // Determine recommended alternatives based on scores
  const recommendedAlternatives: StreamDiscipline[] = [];
  if (!eligible && checkAlternatives) {
    for (const other of INITIAL_STREAM_BASKETS) {
      if (other.stream !== stream) {
        const altCheck = evaluateStreamEligibility(scores, other.stream, false);
        if (altCheck.eligible) {
          recommendedAlternatives.push(other.stream);
        }
      }
    }
  }

  return { eligible, shortfallReasons, recommendedAlternatives };
}

/**
 * Validates selected multidisciplinary electives against maximum limits.
 */
export function validateSubjectCombination(
  stream: StreamDiscipline,
  selectedElectives: string[]
): { valid: boolean; error?: string } {
  const basket = INITIAL_STREAM_BASKETS.find((b) => b.stream === stream);
  if (!basket) {
    return { valid: false, error: 'Invalid stream selection.' };
  }

  if (selectedElectives.length !== basket.maxElectivesAllowed) {
    return {
      valid: false,
      error: `Please select exactly ${basket.maxElectivesAllowed} elective course(s) from the multidisciplinary basket. Currently selected: ${selectedElectives.length}.`,
    };
  }

  const invalidElectives = selectedElectives.filter((e) => !basket.electiveOptions.includes(e));
  if (invalidElectives.length > 0) {
    return {
      valid: false,
      error: `Elective(s) [${invalidElectives.join(', ')}] are not available under ${basket.title}.`,
    };
  }

  return { valid: true };
}
