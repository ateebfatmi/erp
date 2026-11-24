/**
 * CBSE Question Bank & Auto Exam Blueprint Generator Engine
 * Generates official CBSE-pattern examination papers according to Bloom's Taxonomy,
 * Sectional mark distributions (Section A to E), and cognitive weightage guidelines.
 */

export type QuestionType =
  | 'MCQ' // 1 mark
  | 'ASSERTION_REASON' // 1 mark
  | 'VSA' // 2 marks (Very Short Answer)
  | 'SA' // 3 marks (Short Answer)
  | 'LA' // 5 marks (Long Answer)
  | 'CASE_BASED'; // 4 marks (Case-based unit)

export type CognitiveLevel =
  | 'REMEMBERING'
  | 'UNDERSTANDING'
  | 'APPLYING'
  | 'ANALYZING_EVALUATING';

export interface BankQuestion {
  id: string;
  subjectCode: string;
  subjectName: string;
  grade: number;
  chapter: string;
  questionType: QuestionType;
  cognitiveLevel: CognitiveLevel;
  questionText: string;
  options?: string[]; // For MCQs
  answerScheme: string;
  marks: number;
}

export interface GeneratedExamPaper {
  id: string;
  title: string;
  subjectName: string;
  subjectCode: string;
  grade: number;
  maxMarks: number;
  durationMinutes: number;
  generalInstructions: string[];
  sections: {
    sectionName: string;
    description: string;
    questions: BankQuestion[];
    subtotalMarks: number;
  }[];
  cognitiveBreakdown: Record<CognitiveLevel, { marks: number; percentage: number }>;
}

export interface BlueprintConfig {
  mcqCount: number; // Section A
  vsaCount: number; // Section B
  saCount: number; // Section C
  laCount: number; // Section D
  caseCount: number; // Section E
}

/**
 * Standard CBSE Class 10/12 80-Mark Blueprint Configuration
 */
export const STANDARD_CBSE_80_BLUEPRINT: BlueprintConfig = {
  mcqCount: 16, // 16 x 1 = 16
  vsaCount: 5, // 5 x 2 = 10
  saCount: 6, // 6 x 3 = 18
  laCount: 4, // 4 x 5 = 20
  caseCount: 4, // 4 x 4 = 16 (Total = 80 marks)
};

/**
 * Rapid 40-Mark Mock / Terminal Examination Blueprint
 */
export const STANDARD_CBSE_40_BLUEPRINT: BlueprintConfig = {
  mcqCount: 8, // 8 x 1 = 8
  vsaCount: 3, // 3 x 2 = 6
  saCount: 4, // 4 x 3 = 12
  laCount: 1, // 1 x 5 = 5
  caseCount: 2, // 2 x 4 = 8 (Total = 39 or 40 marks)
};

/**
 * Calculates Bloom's Taxonomy cognitive level weightage
 */
export function calculateCognitiveDistribution(
  questions: BankQuestion[]
): Record<CognitiveLevel, { marks: number; percentage: number }> {
  const result: Record<CognitiveLevel, { marks: number; percentage: number }> = {
    REMEMBERING: { marks: 0, percentage: 0 },
    UNDERSTANDING: { marks: 0, percentage: 0 },
    APPLYING: { marks: 0, percentage: 0 },
    ANALYZING_EVALUATING: { marks: 0, percentage: 0 },
  };

  let totalMarks = 0;
  for (const q of questions) {
    result[q.cognitiveLevel].marks += q.marks;
    totalMarks += q.marks;
  }

  for (const key of Object.keys(result) as CognitiveLevel[]) {
    result[key].percentage =
      totalMarks > 0 ? Math.round((result[key].marks / totalMarks) * 100) : 0;
  }

  return result;
}

/**
 * Assembles a standardized CBSE Question Paper layout based on question bank inventory
 */
export function generateExamPaperFromBlueprint(
  bank: BankQuestion[],
  subjectCode: string,
  grade: number,
  title = 'CBSE Term-1 Pre-Board Examination'
): GeneratedExamPaper {
  const filtered = bank.filter((q) => q.subjectCode === subjectCode && q.grade === grade);

  const sectionAQuestions = filtered.filter((q) => q.questionType === 'MCQ' || q.questionType === 'ASSERTION_REASON');
  const sectionBQuestions = filtered.filter((q) => q.questionType === 'VSA');
  const sectionCQuestions = filtered.filter((q) => q.questionType === 'SA');
  const sectionDQuestions = filtered.filter((q) => q.questionType === 'LA');
  const sectionEQuestions = filtered.filter((q) => q.questionType === 'CASE_BASED');

  const allSelected = [
    ...sectionAQuestions,
    ...sectionBQuestions,
    ...sectionCQuestions,
    ...sectionDQuestions,
    ...sectionEQuestions,
  ];

  const totalMarks = allSelected.reduce((sum, q) => sum + q.marks, 0);
  const subjectName = filtered[0]?.subjectName || 'Academic Subject';

  return {
    id: `paper-${Date.now()}`,
    title,
    subjectName,
    subjectCode,
    grade,
    maxMarks: totalMarks,
    durationMinutes: 180,
    generalInstructions: [
      'This question paper contains 5 sections: A, B, C, D and E.',
      'Section A comprises multiple choice questions of 1 mark each.',
      'Section B comprises Very Short Answer questions of 2 marks each.',
      'Section C comprises Short Answer questions of 3 marks each.',
      'Section D comprises Long Answer questions of 5 marks each.',
      'Section E comprises Case-based units of assessment of 4 marks each with sub-parts.',
      'Use of electronic calculators is strictly prohibited.',
    ],
    sections: [
      {
        sectionName: 'Section A (Objective & MCQs)',
        description: 'Questions 1 to ' + sectionAQuestions.length + ' carry 1 mark each.',
        questions: sectionAQuestions,
        subtotalMarks: sectionAQuestions.reduce((s, q) => s + q.marks, 0),
      },
      {
        sectionName: 'Section B (Very Short Answer)',
        description: 'Very short answer type questions carrying 2 marks each.',
        questions: sectionBQuestions,
        subtotalMarks: sectionBQuestions.reduce((s, q) => s + q.marks, 0),
      },
      {
        sectionName: 'Section C (Short Answer)',
        description: 'Short answer type questions carrying 3 marks each.',
        questions: sectionCQuestions,
        subtotalMarks: sectionCQuestions.reduce((s, q) => s + q.marks, 0),
      },
      {
        sectionName: 'Section D (Long Answer)',
        description: 'Long answer type questions carrying 5 marks each.',
        questions: sectionDQuestions,
        subtotalMarks: sectionDQuestions.reduce((s, q) => s + q.marks, 0),
      },
      {
        sectionName: 'Section E (Case-Based Assessment)',
        description: 'Competency-focused integrated case problem units carrying 4 marks each.',
        questions: sectionEQuestions,
        subtotalMarks: sectionEQuestions.reduce((s, q) => s + q.marks, 0),
      },
    ],
    cognitiveBreakdown: calculateCognitiveDistribution(allSelected),
  };
}

/**
 * Curated Pre-seeded Question Bank for Mathematics (041) Class 12
 */
export const INITIAL_QUESTION_BANK: BankQuestion[] = [
  // Section A
  {
    id: 'q-01',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Matrices',
    questionType: 'MCQ',
    cognitiveLevel: 'REMEMBERING',
    questionText: 'If A is a square matrix such that A² = A, then (I + A)³ - 7A is equal to:',
    options: ['A', 'I - A', 'I', '3A'],
    answerScheme: 'Option (C) : I. Expanding (I + A)³ = I³ + 3I²A + 3IA² + A³ = I + 3A + 3A + A = I + 7A. Thus (I + 7A) - 7A = I.',
    marks: 1,
  },
  {
    id: 'q-02',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Continuity & Differentiability',
    questionType: 'ASSERTION_REASON',
    cognitiveLevel: 'UNDERSTANDING',
    questionText: 'Assertion (A): The function f(x) = |x - 2| is continuous at x = 2.\nReason (R): Every continuous function is differentiable.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is NOT the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    answerScheme: 'Option (C) : A is true but R is false (|x| is continuous at 0 but not differentiable).',
    marks: 1,
  },
  // Section B
  {
    id: 'q-03',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Inverse Trigonometry',
    questionType: 'VSA',
    cognitiveLevel: 'APPLYING',
    questionText: 'Find the principal value of cos⁻¹(-1/2) + 2 sin⁻¹(1/2).',
    answerScheme: 'cos⁻¹(-1/2) = 2π/3. 2 sin⁻¹(1/2) = 2(π/6) = π/3. Total = 2π/3 + π/3 = π.',
    marks: 2,
  },
  // Section C
  {
    id: 'q-04',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Integrals',
    questionType: 'SA',
    cognitiveLevel: 'APPLYING',
    questionText: 'Evaluate the definite integral ∫ (from 0 to π/2) [sin²(x) / (sin(x) + cos(x))] dx.',
    answerScheme: 'Using property P4: ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx. 2I = (1/√2) ln(√2 + 1). Final result = (1/2√2) ln(√2 + 1).',
    marks: 3,
  },
  // Section D
  {
    id: 'q-05',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Applications of Derivatives',
    questionType: 'LA',
    cognitiveLevel: 'ANALYZING_EVALUATING',
    questionText: 'An open topped cylindrical tank of volume V is to be constructed. Show that the surface area is minimum when its radius is equal to its height.',
    answerScheme: 'V = πr²h => h = V/(πr²). Surface area S = πr² + 2πrh = πr² + 2V/r. dS/dr = 2πr - 2V/r² = 0 => r³ = V/π = r²h => r = h. d²S/dr² = 2π + 4V/r³ > 0 (Minimum confirmed).',
    marks: 5,
  },
  // Section E
  {
    id: 'q-06',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    chapter: 'Probability',
    questionType: 'CASE_BASED',
    cognitiveLevel: 'ANALYZING_EVALUATING',
    questionText: 'Case Study: In an engineering manufacturing plant, machine A produces 60% of output and machine B produces 40%. Past records show 2% of items from machine A and 1% from machine B are defective.\n(i) What is the total probability of selecting a defective item?\n(ii) Given that an item is found defective, find the probability it was produced by machine B.',
    answerScheme: '(i) P(D) = P(A)P(D|A) + P(B)P(D|B) = 0.6(0.02) + 0.4(0.01) = 0.012 + 0.004 = 0.016.\n(ii) By Bayes Theorem: P(B|D) = (0.4 * 0.01) / 0.016 = 0.004 / 0.016 = 1/4 = 0.25 (25%).',
    marks: 4,
  },
];
