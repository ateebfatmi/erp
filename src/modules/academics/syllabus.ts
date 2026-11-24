/**
 * CBSE Curriculum & Syllabus Progression Engine
 * Monitors term-wise curriculum completion, instructional period velocity,
 * NEP 2020 competency alignment, and teacher lesson plan approvals.
 */

export interface SyllabusUnit {
  id: string;
  subjectCode: string;
  subjectName: string;
  grade: number;
  unitNo: number;
  title: string;
  allocatedPeriods: number;
  completedPeriods: number;
  term: 1 | 2;
  targetCompletionDate: string; // YYYY-MM-DD
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'LAGGING';
  nepCompetencies: string[];
}

export interface LessonPlan {
  id: string;
  unitId: string;
  topic: string;
  plannedDate: string;
  learningObjectives: string;
  pedagogicalApproach: string;
  teachingAids: string;
  status: 'DRAFT' | 'APPROVED' | 'TAUGHT';
}

export interface SyllabusProgressSummary {
  totalAllocated: number;
  totalCompleted: number;
  overallPercentage: number;
  laggingUnitsCount: number;
  completedUnitsCount: number;
}

/**
 * Calculates aggregate completion percentage across a set of curriculum units
 */
export function calculateSyllabusProgress(units: SyllabusUnit[]): SyllabusProgressSummary {
  if (!units || units.length === 0) {
    return {
      totalAllocated: 0,
      totalCompleted: 0,
      overallPercentage: 0,
      laggingUnitsCount: 0,
      completedUnitsCount: 0,
    };
  }

  let totalAllocated = 0;
  let totalCompleted = 0;
  let laggingUnitsCount = 0;
  let completedUnitsCount = 0;

  for (const unit of units) {
    totalAllocated += unit.allocatedPeriods;
    totalCompleted += unit.completedPeriods;
    if (unit.status === 'LAGGING') laggingUnitsCount++;
    if (unit.status === 'COMPLETED') completedUnitsCount++;
  }

  const overallPercentage =
    totalAllocated > 0 ? Math.round((totalCompleted / totalAllocated) * 100) : 0;

  return {
    totalAllocated,
    totalCompleted,
    overallPercentage: Math.min(100, overallPercentage),
    laggingUnitsCount,
    completedUnitsCount,
  };
}

/**
 * Evaluates whether a curriculum unit is lagging behind based on target date
 */
export function evaluateUnitLag(
  unit: SyllabusUnit,
  currentDate: string
): 'ON_TRACK' | 'LAGGING' | 'COMPLETED' {
  if (unit.completedPeriods >= unit.allocatedPeriods) {
    return 'COMPLETED';
  }

  // If current date has passed target completion date and periods remain incomplete
  if (currentDate > unit.targetCompletionDate && unit.completedPeriods < unit.allocatedPeriods) {
    return 'LAGGING';
  }

  return 'ON_TRACK';
}

/**
 * Filter syllabus units by term or subject
 */
export function filterSyllabusUnits(
  units: SyllabusUnit[],
  term?: 1 | 2 | 'ALL',
  subjectCode?: string
): SyllabusUnit[] {
  return units.filter((u) => {
    const matchesTerm = !term || term === 'ALL' || u.term === term;
    const matchesSubject = !subjectCode || subjectCode === 'ALL' || u.subjectCode === subjectCode;
    return matchesTerm && matchesSubject;
  });
}

/**
 * Pre-seeded Official CBSE Class 12 Curriculum
 */
export const INITIAL_CBSE_SYLLABUS: SyllabusUnit[] = [
  {
    id: 'syl-phy-01',
    subjectCode: '042',
    subjectName: 'Physics',
    grade: 12,
    unitNo: 1,
    title: 'Unit I: Electrostatics & Gauss Theorem',
    allocatedPeriods: 24,
    completedPeriods: 24,
    term: 1,
    targetCompletionDate: '2024-08-30',
    status: 'COMPLETED',
    nepCompetencies: ['Electric flux modeling', 'Capacitance in dielectric fields'],
  },
  {
    id: 'syl-phy-02',
    subjectCode: '042',
    subjectName: 'Physics',
    grade: 12,
    unitNo: 2,
    title: 'Unit II: Current Electricity & Kirchhoff Rules',
    allocatedPeriods: 18,
    completedPeriods: 18,
    term: 1,
    targetCompletionDate: '2024-09-30',
    status: 'COMPLETED',
    nepCompetencies: ['Wheatstone bridge sensitivity', 'Potentiometer principles'],
  },
  {
    id: 'syl-phy-03',
    subjectCode: '042',
    subjectName: 'Physics',
    grade: 12,
    unitNo: 3,
    title: 'Unit III: Magnetic Effects of Current & Magnetism',
    allocatedPeriods: 22,
    completedPeriods: 20,
    term: 1,
    targetCompletionDate: '2024-10-31',
    status: 'LAGGING',
    nepCompetencies: ['Biot-Savart Law applications', 'Ampere Circuital Law'],
  },
  {
    id: 'syl-phy-04',
    subjectCode: '042',
    subjectName: 'Physics',
    grade: 12,
    unitNo: 4,
    title: 'Unit IV: Electromagnetic Induction & AC Circuits',
    allocatedPeriods: 20,
    completedPeriods: 14,
    term: 2,
    targetCompletionDate: '2024-11-30',
    status: 'IN_PROGRESS',
    nepCompetencies: ['LCR series resonance', 'Transformer power loss analysis'],
  },
  {
    id: 'syl-phy-05',
    subjectCode: '042',
    subjectName: 'Physics',
    grade: 12,
    unitNo: 5,
    title: 'Unit V: Optics (Wave Optics & Ray Optics)',
    allocatedPeriods: 30,
    completedPeriods: 8,
    term: 2,
    targetCompletionDate: '2024-12-31',
    status: 'IN_PROGRESS',
    nepCompetencies: ['Huygens wave front construction', 'Lens maker formula derivation'],
  },
  {
    id: 'syl-mat-01',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    unitNo: 1,
    title: 'Unit I: Relations, Functions & Inverse Trigonometry',
    allocatedPeriods: 20,
    completedPeriods: 20,
    term: 1,
    targetCompletionDate: '2024-08-31',
    status: 'COMPLETED',
    nepCompetencies: ['Bijective function mappings', 'Principal branch valuations'],
  },
  {
    id: 'syl-mat-02',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    unitNo: 2,
    title: 'Unit II: Matrices & Determinants',
    allocatedPeriods: 22,
    completedPeriods: 22,
    term: 1,
    targetCompletionDate: '2024-09-30',
    status: 'COMPLETED',
    nepCompetencies: ['Matrix inversion via cofactors', 'Cramer rule matrix solutions'],
  },
  {
    id: 'syl-mat-03',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    unitNo: 3,
    title: 'Unit III: Calculus (Continuity, Differentiability & Derivatives)',
    allocatedPeriods: 35,
    completedPeriods: 28,
    term: 1,
    targetCompletionDate: '2024-11-15',
    status: 'LAGGING',
    nepCompetencies: ['Mean Value Theorem', 'Maxima and minima optimization'],
  },
  {
    id: 'syl-mat-04',
    subjectCode: '041',
    subjectName: 'Mathematics Standard',
    grade: 12,
    unitNo: 4,
    title: 'Unit IV: Integrals & Applications of Integrals',
    allocatedPeriods: 30,
    completedPeriods: 10,
    term: 2,
    targetCompletionDate: '2024-12-20',
    status: 'IN_PROGRESS',
    nepCompetencies: ['Definite integral limit of sums', 'Area enclosed under parabolas'],
  },
];
