'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Sparkles,
  Download,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import {
  AlumniProfile,
  TranscriptRequest,
  INITIAL_ALUMNI_ROSTER,
  INITIAL_TRANSCRIPT_REQUESTS,
  filterAlumniDirectory,
  generateVerificationBarcode,
} from '@/modules/students/alumni';

export function AlumniManager() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>(INITIAL_ALUMNI_ROSTER);
  const [requests, setRequests] = useState<TranscriptRequest[]>(INITIAL_TRANSCRIPT_REQUESTS);
  const [activeTab, setActiveTab] = useState<'directory' | 'transcripts' | 'newAlumni'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchYear, setBatchYear] = useState<number | 'ALL'>('ALL');
  const [streamFilter, setStreamFilter] = useState<string>('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Alumni Form State
  const [newName, setNewName] = useState('');
  const [newAdmNo, setNewAdmNo] = useState('');
  const [newRollNo, setNewRollNo] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newStream, setNewStream] = useState<'SCIENCE' | 'COMMERCE' | 'HUMANITIES'>('SCIENCE');
  const [newHigherEd, setNewHigherEd] = useState('');
  const [newProfession, setNewProfession] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMentorship, setNewMentorship] = useState(true);

  const displayedAlumni = filterAlumniDirectory(alumni, batchYear, streamFilter, searchQuery);

  const handleVerifyTranscript = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId ? { ...r, status: 'VERIFIED_BY_REGISTRAR' } : r
      )
    );
    const item = requests.find((r) => r.id === reqId);
    setFeedback(`Official transcript for ${item?.alumniName} verified against institutional ledger.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSealAndDispatch = (reqId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId ? { ...r, status: 'SEALED_AND_DISPATCHED' } : r
      )
    );
    const item = requests.find((r) => r.id === reqId);
    setFeedback(`Transcript envelope for ${item?.alumniName} sealed with school embossing and dispatched.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAdmNo || !newHigherEd) return;

    const newProfile: AlumniProfile = {
      id: `alm-${Date.now()}`,
      admissionNo: newAdmNo,
      name: newName,
      passingYear: newYear,
      boardRollNo: newRollNo || `CBSE-2130-${Math.floor(1000 + Math.random() * 9000)}`,
      stream: newStream,
      higherEducation: newHigherEd,
      currentProfession: newProfession || 'Undergraduate Scholar',
      location: newLocation || 'India',
      email: newEmail || `${newName.toLowerCase().replace(' ', '.')}@alumni.vidyaos.org`,
      phone: '+91 98000 00000',
      mentorshipOffered: newMentorship,
    };

    setAlumni([newProfile, ...alumni]);
    setNewName('');
    setNewAdmNo('');
    setNewRollNo('');
    setNewHigherEd('');
    setNewProfession('');
    setNewLocation('');
    setNewEmail('');
    setActiveTab('directory');
    setFeedback(`Alumni profile for ${newProfile.name} (Batch of ${newProfile.passingYear}) registered successfully.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-600 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Registered Alumni</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{alumni.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Batches 2020 to 2024</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Mentors</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                {alumni.filter((a) => a.mentorshipOffered).length}
              </h3>
              <p className="text-[11px] text-indigo-600 mt-0.5">Available for student career talks</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Verification Requests</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{requests.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">WES, Apostille & Transcripts</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Global Footprint</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">6+</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Countries & Premier Tech / Med Hubs</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'directory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('directory')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            Alumni Directory ({displayedAlumni.length})
          </Button>

          <Button
            variant={activeTab === 'transcripts' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('transcripts')}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <FileCheck className="h-3.5 w-3.5" />
            Official Transcripts & WES Desk ({requests.length})
          </Button>

          <Button
            variant={activeTab === 'newAlumni' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('newAlumni')}
            className="text-xs h-8 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Register Graduate
          </Button>
        </div>

        {activeTab === 'directory' && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Batches</option>
              <option value="2024">Class of 2024</option>
              <option value="2023">Class of 2023</option>
              <option value="2022">Class of 2022</option>
              <option value="2021">Class of 2021</option>
              <option value="2020">Class of 2020</option>
            </select>

            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="ALL">All Streams</option>
              <option value="SCIENCE">Science</option>
              <option value="COMMERCE">Commerce</option>
              <option value="HUMANITIES">Humanities</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: ALUMNI DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search alumni by name, university, profession, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedAlumni.map((a) => (
              <Card key={a.id} className="border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] font-mono text-slate-700 bg-slate-50">
                            Class of {a.passingYear}
                          </Badge>
                          <Badge
                            className={`text-[10px] font-semibold ${
                              a.stream === 'SCIENCE'
                                ? 'bg-blue-100 text-blue-800'
                                : a.stream === 'COMMERCE'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {a.stream}
                          </Badge>
                          {a.mentorshipOffered && (
                            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" /> Alumni Mentor
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                          {a.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 font-mono mt-0.5">
                          Adm No: {a.admissionNo} • Board Roll: {a.boardRollNo}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs text-slate-700">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                        {a.higherEducation}
                      </div>
                      <div className="text-slate-600 flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                        {a.currentProfession}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        {a.location}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                  <span className="text-slate-500 text-[11px] truncate">{a.email}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Simulating alumni contact connection to ${a.name} (${a.email})`)}
                    className="text-xs h-7 text-blue-600 hover:text-blue-700"
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSCRIPTS & WES VERIFICATION */}
      {activeTab === 'transcripts' && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              Official Transcript & Statutory WES / Apostille Verification Desk
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Registrar verification queue for overseas university admissions, credential evaluation agencies, and employer background checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-2.5 px-3">Applicant Name</th>
                    <th className="py-2.5 px-3">Batch</th>
                    <th className="py-2.5 px-3">Document Requested</th>
                    <th className="py-2.5 px-3">Target Institution</th>
                    <th className="py-2.5 px-3">Verification Barcode</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Registrar Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-semibold text-slate-900">{r.alumniName}</td>
                      <td className="py-3 px-3 text-slate-600">Class of {r.passingYear}</td>
                      <td className="py-3 px-3 font-medium text-blue-600">
                        {r.documentType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                        {r.recipientInstitution}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {r.verificationBarcode}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] ${
                            r.status === 'SEALED_AND_DISPATCHED'
                              ? 'bg-purple-100 text-purple-800'
                              : r.status === 'VERIFIED_BY_REGISTRAR'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {r.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {r.status === 'SUBMITTED' ? (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyTranscript(r.id)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Verify Records
                          </Button>
                        ) : r.status === 'VERIFIED_BY_REGISTRAR' ? (
                          <Button
                            size="sm"
                            onClick={() => handleSealAndDispatch(r.id)}
                            className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Seal & Dispatch
                          </Button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">Dispatched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: REGISTER NEW ALUMNI */}
      {activeTab === 'newAlumni' && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Register Passout Graduate to Alumni Directory
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Record post-school destination, university degree, and professional career coordinates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAlumni} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Vikramaditya Rathore"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admission Number *
                  </label>
                  <Input
                    required
                    placeholder="e.g. ADM-2019-214"
                    value={newAdmNo}
                    onChange={(e) => setNewAdmNo(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Board Roll Number
                  </label>
                  <Input
                    placeholder="e.g. CBSE-2130-9941"
                    value={newRollNo}
                    onChange={(e) => setNewRollNo(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Passing Batch Year *
                    </label>
                    <select
                      value={newYear}
                      onChange={(e) => setNewYear(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={2024}>2024</option>
                      <option value={2023}>2023</option>
                      <option value={2022}>2022</option>
                      <option value={2021}>2021</option>
                      <option value={2020}>2020</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Stream *
                    </label>
                    <select
                      value={newStream}
                      onChange={(e) => setNewStream(e.target.value as any)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SCIENCE">Science</option>
                      <option value="COMMERCE">Commerce</option>
                      <option value="HUMANITIES">Humanities</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    University / Degree Program *
                  </label>
                  <Input
                    required
                    placeholder="e.g. BITS Pilani • B.E. Computer Science"
                    value={newHigherEd}
                    onChange={(e) => setNewHigherEd(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Profession / Organization
                  </label>
                  <Input
                    placeholder="e.g. Associate Consultant at Bain & Co"
                    value={newProfession}
                    onChange={(e) => setNewProfession(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current City / Country
                  </label>
                  <Input
                    placeholder="e.g. Gurugram, India"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alumni Email ID
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. vikram.r@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={newMentorship}
                    onChange={(e) => setNewMentorship(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  Opt-in as Alumni Career Mentor for current school students
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('directory')}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Register Alumni Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
