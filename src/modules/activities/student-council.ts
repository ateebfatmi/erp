/**
 * School Student Council & Prefectorial Board Digital Ballot Engine
 * Manages annual student elections for Head Boy, Head Girl, Sports Captain,
 * and Cultural Secretary with secret ballots, anti-duplicate voting, and live certified tallies.
 */

import { HouseName } from './house-system';

export type CouncilPost = 'HEAD_BOY' | 'HEAD_GIRL' | 'SPORTS_CAPTAIN' | 'CULTURAL_SECRETARY';

export interface CouncilCandidate {
  id: string;
  post: CouncilPost;
  name: string;
  admissionNo: string;
  gradeClass: string;
  house: HouseName;
  manifesto: string;
  keyPriorities: string[];
  votesCount: number;
}

export interface StudentBallotCast {
  voterAdmissionNo: string;
  postId: CouncilPost;
  candidateId: string;
  timestamp: string; // ISO String
}

export interface CouncilElectionSummary {
  post: CouncilPost;
  postTitle: string;
  totalVotesCast: number;
  leadingCandidate: CouncilCandidate;
  candidates: CouncilCandidate[];
  isTie: boolean;
}

export const POST_TITLES: Record<CouncilPost, string> = {
  HEAD_BOY: 'Head Boy (Senior Secondary)',
  HEAD_GIRL: 'Head Girl (Senior Secondary)',
  SPORTS_CAPTAIN: 'Games & Sports Captain',
  CULTURAL_SECRETARY: 'Cultural & Literary Secretary',
};

/**
 * Casts a secret digital vote, ensuring zero duplicate voting per post
 */
export function castCouncilVote(params: {
  voterAdmissionNo: string;
  postId: CouncilPost;
  candidateId: string;
  candidates: CouncilCandidate[];
  existingBallots: StudentBallotCast[];
}): {
  updatedCandidates: CouncilCandidate[];
  newBallot: StudentBallotCast;
} {
  const alreadyVoted = params.existingBallots.some(
    (b) => b.voterAdmissionNo === params.voterAdmissionNo && b.postId === params.postId
  );

  if (alreadyVoted) {
    throw new Error(`Duplicate Vote Barred: You have already cast your ballot for ${POST_TITLES[params.postId]}`);
  }

  const targetCandidate = params.candidates.find(
    (c) => c.id === params.candidateId && c.post === params.postId
  );

  if (!targetCandidate) {
    throw new Error('Invalid candidate selected for this portfolio');
  }

  const updatedCandidates = params.candidates.map((c) =>
    c.id === params.candidateId ? { ...c, votesCount: c.votesCount + 1 } : c
  );

  const newBallot: StudentBallotCast = {
    voterAdmissionNo: params.voterAdmissionNo,
    postId: params.postId,
    candidateId: params.candidateId,
    timestamp: new Date().toISOString(),
  };

  return { updatedCandidates, newBallot };
}

/**
 * Calculates current electoral standings and identifies winners
 */
export function calculateCouncilResults(
  candidates: CouncilCandidate[]
): CouncilElectionSummary[] {
  const posts: CouncilPost[] = ['HEAD_BOY', 'HEAD_GIRL', 'SPORTS_CAPTAIN', 'CULTURAL_SECRETARY'];

  return posts.map((post) => {
    const postCandidates = candidates
      .filter((c) => c.post === post)
      .sort((a, b) => b.votesCount - a.votesCount);

    const totalVotes = postCandidates.reduce((sum, c) => sum + c.votesCount, 0);
    const leader = postCandidates[0];
    const isTie = postCandidates.length > 1 && postCandidates[0].votesCount === postCandidates[1].votesCount && postCandidates[0].votesCount > 0;

    return {
      post,
      postTitle: POST_TITLES[post],
      totalVotesCast: totalVotes,
      leadingCandidate: leader,
      candidates: postCandidates,
      isTie,
    };
  });
}

/**
 * Pre-seeded Student Council Candidates
 */
export const INITIAL_COUNCIL_CANDIDATES: CouncilCandidate[] = [
  // Head Boy Candidates
  {
    id: 'can-hb-01',
    post: 'HEAD_BOY',
    name: 'Aarav Mehta',
    admissionNo: 'ADM-2024-001',
    gradeClass: 'Class 12A',
    house: 'ASHOKA',
    manifesto: 'Promoting peer mental health counseling, inter-school science symposiums, and green zero-plastic campus initiatives.',
    keyPriorities: ['Peer Tutoring Cells', 'Zero-Plastic Canteen', 'Annual STEM Hackathon'],
    votesCount: 242,
  },
  {
    id: 'can-hb-02',
    post: 'HEAD_BOY',
    name: 'Devansh Rathore',
    admissionNo: 'ADM-2024-033',
    gradeClass: 'Class 12B',
    house: 'SHIVAJI',
    manifesto: 'Enhancing athletic equipment in boarding dorms, expanding library late hours, and transparent student grievance channels.',
    keyPriorities: ['Expanded Library Hours', 'Dorm Gym Equipment', 'House Transparency'],
    votesCount: 218,
  },

  // Head Girl Candidates
  {
    id: 'can-hg-01',
    post: 'HEAD_GIRL',
    name: 'Tanvi Saxena',
    admissionNo: 'ADM-2024-124',
    gradeClass: 'Class 12C',
    house: 'ASHOKA',
    manifesto: 'Empowering student journalism with school podcast series, debating club workshops, and women in STEM mentorship.',
    keyPriorities: ['Student Voice Podcast', 'Girls in STEM Cell', 'Model UN Delegation'],
    votesCount: 265,
  },
  {
    id: 'can-hg-02',
    post: 'HEAD_GIRL',
    name: 'Ananya Sen',
    admissionNo: 'ADM-2024-112',
    gradeClass: 'Class 12A',
    house: 'TAGORE',
    manifesto: 'Introducing acoustic music practice zones, digital assignment extensions for medical leave, and cultural interchange festivals.',
    keyPriorities: ['Amphitheatre Open Mic', 'Flexible Coursework Desk', 'Tagore Art Festival'],
    votesCount: 231,
  },

  // Sports Captain Candidates
  {
    id: 'can-sp-01',
    post: 'SPORTS_CAPTAIN',
    name: 'Kabir Verma',
    admissionNo: 'ADM-2024-019',
    gradeClass: 'Class 11A',
    house: 'TAGORE',
    manifesto: 'Upgrading the 400m synthetic track markings, introducing inter-school football leagues, and fitness triage cards.',
    keyPriorities: ['Track Upgrades', 'Football Championship', 'Hydration Stations'],
    votesCount: 210,
  },
  {
    id: 'can-sp-02',
    post: 'SPORTS_CAPTAIN',
    name: 'Aryan Bhatia',
    admissionNo: 'ADM-2024-055',
    gradeClass: 'Class 11B',
    house: 'ASHOKA',
    manifesto: 'Procuring high-grade table tennis boards, introducing chess grandmaster masterclasses, and annual athletic shield transparency.',
    keyPriorities: ['Chess Workshops', 'Indoor TT Arena', 'Sports Dietician Talks'],
    votesCount: 198,
  },

  // Cultural Secretary Candidates
  {
    id: 'can-cs-01',
    post: 'CULTURAL_SECRETARY',
    name: 'Riya Kulkarni',
    admissionNo: 'ADM-2024-135',
    gradeClass: 'Class 11C',
    house: 'SHIVAJI',
    manifesto: 'Orchestrating regional folk music evenings, inter-school street play (Nukkad Natak) festivals, and graphic design clubs.',
    keyPriorities: ['Nukkad Natak Meets', 'Digital Art Exhibits', 'Inter-House Choir'],
    votesCount: 220,
  },
  {
    id: 'can-cs-02',
    post: 'CULTURAL_SECRETARY',
    name: 'Meera Nambiar',
    admissionNo: 'ADM-2024-148',
    gradeClass: 'Class 11A',
    house: 'RAMAN',
    manifesto: 'Promoting classical dance recitals, theater acting bootcamps, and digital film festival screenings in the auditorium.',
    keyPriorities: ['Classical Dance Guild', 'Film & Animation Club', 'Auditorium Tech Upgrades'],
    votesCount: 205,
  },
];

/**
 * Pre-seeded initial ballots
 */
export const INITIAL_STUDENT_BALLOTS: StudentBallotCast[] = [
  {
    voterAdmissionNo: 'ADM-2024-999',
    postId: 'HEAD_BOY',
    candidateId: 'can-hb-01',
    timestamp: '2024-11-24T10:00:00.000Z',
  },
];
