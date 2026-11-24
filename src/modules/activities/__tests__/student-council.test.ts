import { describe, it, expect } from 'vitest';
import {
  castCouncilVote,
  calculateCouncilResults,
  INITIAL_COUNCIL_CANDIDATES,
  StudentBallotCast,
} from '../student-council';

describe('School Student Council Digital Ballot Engine', () => {
  it('should allow casting a vote, increment the candidate tally, and record a ballot timestamp', () => {
    const existingBallots: StudentBallotCast[] = [];
    const { updatedCandidates, newBallot } = castCouncilVote({
      voterAdmissionNo: 'ADM-2024-001',
      postId: 'HEAD_BOY',
      candidateId: 'can-hb-01', // Aarav Mehta (currently 242)
      candidates: INITIAL_COUNCIL_CANDIDATES,
      existingBallots,
    });

    const updated = updatedCandidates.find((c) => c.id === 'can-hb-01');
    expect(updated?.votesCount).toBe(243);
    expect(newBallot.voterAdmissionNo).toBe('ADM-2024-001');
    expect(newBallot.postId).toBe('HEAD_BOY');
  });

  it('should strictly bar duplicate voting for the same post by the same student', () => {
    const existingBallots: StudentBallotCast[] = [
      {
        voterAdmissionNo: 'ADM-2024-001',
        postId: 'HEAD_BOY',
        candidateId: 'can-hb-01',
        timestamp: new Date().toISOString(),
      },
    ];

    expect(() =>
      castCouncilVote({
        voterAdmissionNo: 'ADM-2024-001',
        postId: 'HEAD_BOY',
        candidateId: 'can-hb-02',
        candidates: INITIAL_COUNCIL_CANDIDATES,
        existingBallots,
      })
    ).toThrowError(/Duplicate Vote Barred/);
  });

  it('should permit voting for different posts (e.g. Head Girl after voting for Head Boy)', () => {
    const existingBallots: StudentBallotCast[] = [
      {
        voterAdmissionNo: 'ADM-2024-001',
        postId: 'HEAD_BOY',
        candidateId: 'can-hb-01',
        timestamp: new Date().toISOString(),
      },
    ];

    const { newBallot } = castCouncilVote({
      voterAdmissionNo: 'ADM-2024-001',
      postId: 'HEAD_GIRL',
      candidateId: 'can-hg-01',
      candidates: INITIAL_COUNCIL_CANDIDATES,
      existingBallots,
    });

    expect(newBallot.postId).toBe('HEAD_GIRL');
    expect(newBallot.candidateId).toBe('can-hg-01');
  });

  it('should accurately calculate council winners across all four posts', () => {
    const results = calculateCouncilResults(INITIAL_COUNCIL_CANDIDATES);
    expect(results.length).toBe(4);

    const headBoyResult = results.find((r) => r.post === 'HEAD_BOY');
    expect(headBoyResult?.leadingCandidate.name).toBe('Aarav Mehta');
    expect(headBoyResult?.totalVotesCast).toBe(460); // 242 + 218

    const headGirlResult = results.find((r) => r.post === 'HEAD_GIRL');
    expect(headGirlResult?.leadingCandidate.name).toBe('Tanvi Saxena');
  });
});
