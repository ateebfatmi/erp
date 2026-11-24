'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Library,
  BookOpen,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  BookmarkPlus,
  Coins,
  MapPin,
  Sparkles,
  BookMarked,
  Info,
} from 'lucide-react';
import { calculateOverdueFine, BookLoan } from '@/modules/library/circulation';

interface CatalogBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  subject: string;
  rackLocation: string;
  totalCopies: number;
  availableCopies: number;
  recommendedFor: string;
}

const INITIAL_STUDENT_LOANS: BookLoan[] = [
  {
    id: 'loan-1',
    bookId: 'book-01',
    bookTitle: 'Concepts of Physics (Vol 1) - H.C. Verma',
    accessionNumber: 'ACC/PHY/2026/089',
    borrowerId: 'stu-01',
    borrowerName: 'Aarav Mehta',
    borrowerType: 'student',
    borrowerCode: 'DPGA/2021/1042',
    issueDate: '2026-11-05',
    dueDate: '2026-11-19',
    status: 'overdue',
    fineAmount: 20,
    finePaid: false,
  },
  {
    id: 'loan-3',
    bookId: 'book-04',
    bookTitle: 'NCERT Exemplar Problems - Mathematics Class 10',
    accessionNumber: 'ACC/MTH/2026/112',
    borrowerId: 'stu-01',
    borrowerName: 'Aarav Mehta',
    borrowerType: 'student',
    borrowerCode: 'DPGA/2021/1042',
    issueDate: '2026-11-18',
    dueDate: '2026-12-02',
    status: 'active',
    fineAmount: 0,
    finePaid: false,
  },
];

const CATALOG_BOOKS: CatalogBook[] = [
  {
    id: 'cat-1',
    isbn: '978-8177091878',
    title: 'Concepts of Physics (Vol 1)',
    author: 'Dr. H.C. Verma',
    subject: 'Physics',
    rackLocation: 'Rack 3-B',
    totalCopies: 8,
    availableCopies: 3,
    recommendedFor: 'Class 10 & 11 Science Stream',
  },
  {
    id: 'cat-2',
    isbn: '978-9352744046',
    title: 'Mathematics for Class 10 (CBSE Guide)',
    author: 'Dr. R.D. Sharma',
    subject: 'Mathematics',
    rackLocation: 'Rack 2-A',
    totalCopies: 12,
    availableCopies: 5,
    recommendedFor: 'Board Exam Preparation',
  },
  {
    id: 'cat-3',
    isbn: '978-9387410053',
    title: 'Computer Science with Python',
    author: 'Sumita Arora',
    subject: 'Computer Science',
    rackLocation: 'Rack 5-C',
    totalCopies: 6,
    availableCopies: 2,
    recommendedFor: 'CBSE AI & CS Curriculum',
  },
  {
    id: 'cat-4',
    isbn: '978-8121924986',
    title: 'Science for Class 10 (Chemistry Part 2)',
    author: 'Lakhmir Singh & Manjit Kaur',
    subject: 'Chemistry',
    rackLocation: 'Rack 3-A',
    totalCopies: 10,
    availableCopies: 0,
    recommendedFor: 'Class 10 Board Core Concept',
  },
  {
    id: 'cat-5',
    isbn: '978-0143424123',
    title: 'Wings of Fire: An Autobiography',
    author: 'Dr. A.P.J. Abdul Kalam',
    subject: 'Literature / Biography',
    rackLocation: 'Rack 1-D',
    totalCopies: 5,
    availableCopies: 4,
    recommendedFor: 'General Student Inspiration',
  },
  {
    id: 'cat-6',
    isbn: '978-9350942512',
    title: 'India and the Contemporary World - II (History)',
    author: 'NCERT Editorial Board',
    subject: 'Social Science',
    rackLocation: 'Rack 4-A',
    totalCopies: 15,
    availableCopies: 7,
    recommendedFor: 'CBSE Term Syllabus',
  },
];

export function StudentLibraryManager() {
  const [loans, setLoans] = useState<BookLoan[]>(INITIAL_STUDENT_LOANS);
  const [catalog, setCatalog] = useState<CatalogBook[]>(CATALOG_BOOKS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'issued' | 'catalog' | 'history'>('issued');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRenewBook = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const currentDue = new Date(l.dueDate);
          currentDue.setDate(currentDue.getDate() + 7);
          const newDueDate = currentDue.toISOString().split('T')[0];
          return {
            ...l,
            dueDate: newDueDate,
            status: 'active',
            fineAmount: 0,
          };
        }
        return l;
      })
    );
    setFeedback('Book loan renewed successfully! 7 days added to due date.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleReserveBook = (book: CatalogBook) => {
    if (book.availableCopies <= 0) return;

    setCatalog((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );

    setFeedback(
      `Book "${book.title}" reserved! Collect from ${book.rackLocation} at the Circulation Counter within 24 hours.`
    );
    setTimeout(() => setFeedback(null), 5000);
  };

  const filteredCatalog = catalog.filter((book) => {
    if (selectedSubject !== 'ALL' && book.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchIsbn = book.isbn.toLowerCase().includes(q);
      if (!matchTitle && !matchAuthor && !matchIsbn) return false;
    }
    return true;
  });

  const totalOutstandingFines = loans.reduce((acc, curr) => acc + (curr.finePaid ? 0 : curr.fineAmount), 0);

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-700 h-7"
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Currently Borrowed</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{loans.length} / 3 Books</h3>
              <p className="text-[11px] text-slate-400">CBSE Student Limit: 3</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                totalOutstandingFines > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Overdue Fine</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">₹{totalOutstandingFines}</h3>
              <p className="text-[11px] text-slate-400">
                {totalOutstandingFines > 0 ? 'Clear at library desk' : 'No dues pending'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Digital Catalog</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{catalog.length} Titles</h3>
              <p className="text-[11px] text-slate-400">Online Reservation Open</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('issued')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'issued'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookMarked className="h-4 w-4" />
          My Borrowed Books ({loans.length})
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Search className="h-4 w-4" />
          Search Catalog & Reserve
        </button>
      </div>

      {/* TAB 1: ISSUED BOOKS */}
      {activeTab === 'issued' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Active Books in Hand
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Books currently issued against your Admission Number (DPGA/2021/1042). Standard loan duration is 14 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loans.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Library className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">You have no active book loans.</p>
                <p className="text-xs mt-1">Browse the catalog to reserve titles for pickup!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {loans.map((loan) => {
                  const fineCalc = calculateOverdueFine(loan.dueDate);
                  return (
                    <div
                      key={loan.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{loan.bookTitle}</h4>
                          {fineCalc.isOverdue ? (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Overdue by {fineCalc.daysLate} Days
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Active Loan
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                          <span>Accession: {loan.accessionNumber}</span>
                          <span>•</span>
                          <span>Issued: {loan.issueDate}</span>
                          <span>•</span>
                          <span
                            className={
                              fineCalc.isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700 font-medium'
                            }
                          >
                            Due Date: {loan.dueDate}
                          </span>
                        </div>
                        {fineCalc.isOverdue && (
                          <p className="text-xs text-rose-700 font-medium">
                            Penalty Calculated: ₹{fineCalc.fineAmount} (Rate: ₹5/day after 1 day grace)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRenewBook(loan.id)}
                          className="border-slate-300 text-xs flex items-center gap-1.5 hover:bg-slate-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
                          Renew for 7 Days
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 2: SEARCH CATALOG & RESERVE */}
      {activeTab === 'catalog' && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              School Library Master Catalog
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Search across reference texts, board guides, and literature. Check rack shelf locations and reserve available copies.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="sm:col-span-8 relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by book title, author, or ISBN..."
                  className="pl-9 text-xs bg-white"
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 bg-white"
                >
                  <option value="ALL">All Subjects</option>
                  <option value="Physics">Physics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Literature / Biography">Literature</option>
                </select>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatalog.map((book) => (
                <div
                  key={book.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{book.title}</h4>
                      <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
                        {book.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">By {book.author}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{book.rackLocation}</span>
                      <span>•</span>
                      <span className="font-mono">ISBN: {book.isbn}</span>
                    </div>
                    <div className="pt-1">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">
                        {book.recommendedFor}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {book.availableCopies > 0 ? (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          {book.availableCopies} Copies Available
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Currently Checked Out
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      disabled={book.availableCopies <= 0}
                      onClick={() => handleReserveBook(book)}
                      className={`text-xs ${
                        book.availableCopies > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <BookmarkPlus className="h-3.5 w-3.5 mr-1" />
                      Reserve Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
