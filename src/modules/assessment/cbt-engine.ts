export interface CbtQuestion {
  id: string;
  questionText: string;
  subject: string;
  topic: string;
  type: 'mcq' | 'boolean' | 'numerical';
  options?: string[]; // for MCQ
  correctAnswer: string;
  marks: number;
  negativeMarks: number;
  explanation: string;
}

export interface CbtExam {
  id: string;
  title: string;
  subject: string;
  className: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  questions: CbtQuestion[];
}

export interface StudentSubmission {
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string>; // questionId -> selected answer
  timeSpentSeconds: number;
}

export interface CbtEvaluationResult {
  examId: string;
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  grossMarks: number;
  negativePenalty: number;
  netScore: number;
  maxScore: number;
  percentage: number;
  cbseGrade: string;
  isPassed: boolean;
  topicBreakdown: Record<string, { total: number; correct: number }>;
}

export const SAMPLE_CBSE_EXAM: CbtExam = {
  id: 'cbt-10-sci-01',
  title: 'CBSE Class 10 Science & Technology — Mid-Term Mock Assessment',
  subject: 'Science & Technology',
  className: 'Class 10',
  durationMinutes: 15,
  totalMarks: 20,
  passingPercentage: 40,
  questions: [
    {
      id: 'q1',
      questionText: 'What is the chemical formula of Marble / Limestone?',
      subject: 'Chemistry',
      topic: 'Chemical Reactions and Equations',
      type: 'mcq',
      options: ['Ca(OH)2', 'CaCO3', 'CaO', 'CaCl2'],
      correctAnswer: 'CaCO3',
      marks: 4,
      negativeMarks: 1,
      explanation: 'Limestone, chalk and marble are different chemical forms of Calcium Carbonate (CaCO3).',
    },
    {
      id: 'q2',
      questionText: 'A concave mirror produces a real, inverted and enlarged image when the object is placed:',
      subject: 'Physics',
      topic: 'Light - Reflection and Refraction',
      type: 'mcq',
      options: ['At Focus (F)', 'Between F and Center of Curvature (C)', 'Beyond C', 'At infinity'],
      correctAnswer: 'Between F and Center of Curvature (C)',
      marks: 4,
      negativeMarks: 1,
      explanation: 'When an object is placed between F and C of a concave mirror, the image formed is beyond C, real, inverted, and magnified.',
    },
    {
      id: 'q3',
      questionText: 'Photosynthesis in green plants converts light energy directly into chemical energy.',
      subject: 'Biology',
      topic: 'Life Processes',
      type: 'boolean',
      options: ['True', 'False'],
      correctAnswer: 'True',
      marks: 4,
      negativeMarks: 1,
      explanation: 'Chlorophyll molecules absorb light energy and initiate photochemical reactions yielding glucose ATP.',
    },
    {
      id: 'q4',
      questionText: 'Which enzyme is present in human saliva that breaks down starch into maltose?',
      subject: 'Biology',
      topic: 'Life Processes',
      type: 'mcq',
      options: ['Pepsin', 'Salivary Amylase', 'Trypsin', 'Lipase'],
      correctAnswer: 'Salivary Amylase',
      marks: 4,
      negativeMarks: 1,
      explanation: 'Salivary Amylase (Ptyalin) catalyzes the hydrolysis of starch into maltose sugars.',
    },
    {
      id: 'q5',
      questionText: 'The SI unit of electrical resistivity (rho) is Ohm-meter (Ω·m).',
      subject: 'Physics',
      topic: 'Electricity',
      type: 'boolean',
      options: ['True', 'False'],
      correctAnswer: 'True',
      marks: 4,
      negativeMarks: 1,
      explanation: 'Resistivity ρ = (R × A) / L = (Ω × m²) / m = Ω·m.',
    },
  ],
};

/**
 * Automatically evaluates student answers, applying positive scores, negative penalties, and CBSE grading
 */
export function evaluateCbtSubmission(
  exam: CbtExam,
  answers: Record<string, string>
): CbtEvaluationResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let grossMarks = 0;
  let negativePenalty = 0;
  const topicMap: Record<string, { total: number; correct: number }> = {};

  for (const q of exam.questions) {
    if (!topicMap[q.topic]) topicMap[q.topic] = { total: 0, correct: 0 };
    topicMap[q.topic].total += 1;

    const selected = answers[q.id]?.trim();
    if (selected === undefined || selected === '') {
      continue;
    }

    if (selected.toLowerCase() === q.correctAnswer.toLowerCase()) {
      correctCount += 1;
      grossMarks += q.marks;
      topicMap[q.topic].correct += 1;
    } else {
      incorrectCount += 1;
      negativePenalty += q.negativeMarks;
    }
  }

  const attemptedCount = correctCount + incorrectCount;
  const unansweredCount = exam.questions.length - attemptedCount;
  const rawNet = grossMarks - negativePenalty;
  const netScore = Math.max(0, rawNet);

  const maxScore = exam.questions.reduce((sum, q) => sum + q.marks, 0);
  const percentage = maxScore > 0 ? Number(((netScore / maxScore) * 100).toFixed(1)) : 0;
  const isPassed = percentage >= exam.passingPercentage;

  // CBSE 9-Point Grading Scale
  let cbseGrade = 'E';
  if (percentage >= 91) cbseGrade = 'A1';
  else if (percentage >= 81) cbseGrade = 'A2';
  else if (percentage >= 71) cbseGrade = 'B1';
  else if (percentage >= 61) cbseGrade = 'B2';
  else if (percentage >= 51) cbseGrade = 'C1';
  else if (percentage >= 41) cbseGrade = 'C2';
  else if (percentage >= 33) cbseGrade = 'D';

  return {
    examId: exam.id,
    totalQuestions: exam.questions.length,
    attemptedCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    grossMarks,
    negativePenalty,
    netScore,
    maxScore,
    percentage,
    cbseGrade,
    isPassed,
    topicBreakdown: topicMap,
  };
}
