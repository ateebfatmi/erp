'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Vote,
  Award,
  CheckCircle2,
  Users,
  Trophy,
  Sparkles,
  Printer,
  ShieldCheck,
  Flag,
  Lock,
} from 'lucide-react';
import {
  CouncilCandidate,
  CouncilPost,
  POST_TITLES,
  StudentBallotCast,
  INITIAL_COUNCIL_CANDIDATES,
  INITIAL_STUDENT_BALLOTS,
  castCouncilVote,
  calculateCouncilResults,
} from '@/modules/activities/student-council';
import { HouseName } from '@/modules/activities/house-system';

interface StudentCouncilManagerProps {
  role?: 'student' | 'admin';
  voterAdmissionNo?: string;
}

const HOUSE_THEMES: Record<HouseName, { bg: string; text: string; border: string; badge: string }> = {
  ASHOKA: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
  TAGORE: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-800' },
  SHIVAJI: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
  RAMAN: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
};

export function StudentCouncilManager({
  role = 'student',
  voterAdmissionNo = 'ADM-2024-001',
}: StudentCouncilManagerProps) {
  const [candidates, setCandidates] = useState<CouncilCandidate[]>(INITIAL_COUNCIL_CANDIDATES);
  const [ballots, setBallots] = useState<StudentBallotCast[]>(INITIAL_STUDENT_BALLOTS);
  const [activeTab, setActiveTab] = useState<'ballot' | 'results'>('ballot');
  const [selectedPost, setSelectedPost] = useState<CouncilPost>('HEAD_BOY');
  const [notification, setNotification] = useState<string | null>(null);

  const posts: CouncilPost[] = ['HEAD_BOY', 'HEAD_GIRL', 'SPORTS_CAPTAIN', 'CULTURAL_SECRETARY'];
  const results = calculateCouncilResults(candidates);

  const hasVotedForPost = (post: CouncilPost) => {
    return ballots.some((b) => b.voterAdmissionNo === voterAdmissionNo && b.postId === post);
  };

  const handleVote = (candidate: CouncilCandidate) => {
    try {
      const { updatedCandidates, newBallot } = castCouncilVote({
        voterAdmissionNo,
        postId: candidate.post,
        candidateId: candidate.id,
        candidates,
        existingBallots: ballots,
      });

      setCandidates(updatedCandidates);
      setBallots((prev) => [newBallot, ...prev]);
      setNotification(`Your vote for ${candidate.name} (${POST_TITLES[candidate.post]}) has been securely recorded!`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Voting error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500 text-white font-mono text-[10px] font-bold">
                Session 2024-25 Elections
              </Badge>
              <Badge className="bg-emerald-500/80 text-white text-[10px] font-semibold">
                Secret Digital Ballot
              </Badge>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Vote className="h-5 w-5 text-purple-400" />
              Student Council & Prefectorial Board Elections
            </h1>
            <p className="text-xs text-purple-200 leading-relaxed">
              Exercise your democratic franchise to elect the institutional leadership. Every senior student holds one confidential vote per portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer text-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Certified Results</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('ballot')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'ballot'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Vote className="h-4 w-4" />
          Secret Digital Voting Booth
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'results'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="h-4 w-4" />
          Live Certified Electoral Standings
        </button>
      </div>

      {activeTab === 'ballot' ? (
        <div className="space-y-6">
          {/* Portfolio Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {posts.map((post) => {
              const voted = hasVotedForPost(post);
              return (
                <button
                  key={post}
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    selectedPost === post
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{POST_TITLES[post]}</span>
                  {voted ? (
                    <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      VOTED
                    </span>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.2 rounded-full">
                      Pending
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Voting Status Callout */}
          {hasVotedForPost(selectedPost) ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Ballot Sealed:</strong> Your official confidential vote for{' '}
                <strong>{POST_TITLES[selectedPost]}</strong> has been cast and recorded. Anti-tamper ledger locked.
              </span>
            </div>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600 shrink-0" />
              <span>
                <strong>Confidential Ballot:</strong> Review each candidate&apos;s manifesto below and select one candidate to cast your vote for{' '}
                <strong>{POST_TITLES[selectedPost]}</strong>.
              </span>
            </div>
          )}

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates
              .filter((c) => c.post === selectedPost)
              .map((candidate) => {
                const theme = HOUSE_THEMES[candidate.house];
                const votedForPost = hasVotedForPost(selectedPost);

                return (
                  <Card
                    key={candidate.id}
                    className={`border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between`}
                  >
                    <CardHeader className="p-4 pb-2 border-b border-slate-100">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-sm font-bold text-slate-900">
                            {candidate.name}
                          </CardTitle>
                          <span className="text-xs font-semibold text-slate-500">
                            {candidate.gradeClass} &bull; {candidate.admissionNo}
                          </span>
                        </div>
                        <Badge className={`text-[10px] ${theme.badge}`}>
                          {candidate.house} HOUSE
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 grow">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Candidate Manifesto & Vision
                        </span>
                        <p className="text-xs text-slate-700 italic leading-relaxed">
                          &ldquo;{candidate.manifesto}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Key Campaign Priorities
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {candidate.keyPriorities.map((pri, i) => (
                            <span
                              key={i}
                              className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                            >
                              {pri}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <div className="p-4 pt-0">
                      <Button
                        size="sm"
                        disabled={votedForPost}
                        onClick={() => handleVote(candidate)}
                        className={`w-full gap-1.5 text-xs font-semibold cursor-pointer ${
                          votedForPost
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        }`}
                      >
                        <Vote className="h-3.5 w-3.5" />
                        <span>{votedForPost ? 'Vote Already Recorded' : `Vote for ${candidate.name}`}</span>
                      </Button>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ) : (
        /* Certified Standings View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((res) => (
              <Card key={res.post} className="border-slate-200 shadow-xs">
                <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      {res.postTitle}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Total Ballots Cast: <strong>{res.totalVotesCast} votes</strong>
                    </CardDescription>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Leader: {res.leadingCandidate.name}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {res.candidates.map((cand) => {
                    const pct = res.totalVotesCast > 0 ? Math.round((cand.votesCount / res.totalVotesCast) * 100) : 0;
                    const isWinner = cand.id === res.leadingCandidate.id;
                    const theme = HOUSE_THEMES[cand.house];

                    return (
                      <div key={cand.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{cand.name}</span>
                            <Badge className={`text-[9px] py-0 ${theme.badge}`}>
                              {cand.house}
                            </Badge>
                            {isWinner && (
                              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                                <Trophy className="h-3 w-3" /> Leading
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-slate-700">
                            {cand.votesCount} votes ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isWinner ? 'bg-purple-600' : 'bg-slate-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
