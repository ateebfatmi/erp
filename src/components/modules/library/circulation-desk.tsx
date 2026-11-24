'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  PlusCircle,
  Coins,
  Library as LibraryIcon,
} from 'lucide-react';
import { calculateOverdueFine, BookLoan } from '@/modules/library/circulation';

const INITIAL_LOANS: BookLoan[] = [
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
    dueDate: '2026-11-19', // 5 days overdue
    status: 'overdue',
    fineAmount: 20, // (5-1) * 5
    finePaid: false,
  },
  {
    id: 'loan-2',
    bookId: 'book-02',
    bookTitle: 'Mathematics for Class 10 - R.D. Sharma',
    accessionNumber: 'ACC/MTH/2026/044',
    borrowerId: 'stu-02',
    borrowerName: 'Diya Kapoor',
    borrowerType: 'student',
    borrowerCode: 'DPGA/2021/1055',
    issueDate: '2026-11-14',
    dueDate: '2026-11-28',
    status: 'active',
    fineAmount: 0,
    finePaid: false,
  },
  {
    id: 'loan-3',
    bookId: 'book-03',
    bookTitle: 'NCERT Exemplar Problems - Science Class 10',
    accessionNumber: 'ACC/SCI/2026/112',
    borrowerId: 'emp-002',
    borrowerName: 'Mrs. Sunita Deshmukh',
    borrowerType: 'staff',
    borrowerCode: 'DPGA-T02',
    issueDate: '2026-11-10',
    dueDate: '2026-12-10',
    status: 'active',
    fineAmount: 0,
    finePaid: false,
  },
];

export function LibraryCirculationDesk() {
  const [loans, setLoans] = useState<BookLoan[]>(INITIAL_LOANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('Concepts of Physics (Vol 2) - H.C. Verma');
  const [newBorrower, setNewBorrower] = useState('Rohan Verma (DPGA/2021/1048)');
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeLoansCount = loans.filter((l) => l.status !== 'returned').length;
  const overdueCount = loans.filter((l) => l.status === 'overdue').length;
  const totalFines = loans.reduce((sum, l) => sum + (l.finePaid ? 0 : l.fineAmount), 0);

  const handleReturnBook = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          return {
            ...l,
            status: 'returned',
            returnDate: new Date().toISOString().split('T')[0],
            finePaid: true,
          };
        }
        return l;
      })
    );
    setFeedback(`Book returned successfully. Any overdue fine has been settled.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);

    const newLoan: BookLoan = {
      id: `loan-${Date.now()}`,
      bookId: `book-${Date.now()}`,
      bookTitle: newTitle,
      accessionNumber: `ACC/LIB/${Math.floor(1000 + Math.random() * 9000)}`,
      borrowerId: `stu-${Date.now()}`,
      borrowerName: newBorrower.split('(')[0].trim(),
      borrowerType: 'student',
      borrowerCode: newBorrower.match(/\((.*?)\)/)?.[1] || 'DPGA/2026/001',
      issueDate: today.toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      status: 'active',
      fineAmount: 0,
      finePaid: false,
    };

    setLoans([newLoan, ...loans]);
    setIsModalOpen(false);
    setFeedback(`Volume "${newTitle}" checked out to ${newLoan.borrowerName} until ${newLoan.dueDate}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Top Circulation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Checked Out Books</span>
            <span className="text-xl font-bold text-slate-900">{activeLoansCount} Volumes</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border-slate-200 rounded-xl border flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overdue Defaulters</span>
            <span className="text-xl font-bold text-amber-700">{overdueCount} Volumes</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Uncollected Overdue Fines</span>
            <span className="text-xl font-bold text-red-600">₹{totalFines}.00</span>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* Circulation Desk Table */}
      <Card className="bg-white border-slate-200">
        <CardHeader className="p-4 border-b border-slate-200 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-indigo-600" />
              Active Book Circulation Desk & Overdue Tracker
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              14-Day borrowing loan rule &bull; Automatic fine accrual of ₹5/day beyond grace period
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Issue Book Volume
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Accession No</th>
                  <th className="py-2.5 px-3">Title & Subject</th>
                  <th className="py-2.5 px-3">Borrower Details</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status / Overdue Fine</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {loan.accessionNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{loan.bookTitle}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{loan.borrowerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {loan.borrowerCode} ({loan.borrowerType})
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{loan.issueDate}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{loan.dueDate}</td>
                    <td className="py-3 px-3">
                      {loan.status === 'overdue' ? (
                        <div className="flex items-center gap-1.5">
                          <Badge variant="destructive" className="text-[10px]">
                            Overdue
                          </Badge>
                          <span className="text-red-600 font-bold font-mono">₹{loan.fineAmount} Fine</span>
                        </div>
                      ) : loan.status === 'returned' ? (
                        <Badge variant="outline" className="text-[10px] text-slate-500">
                          Returned
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Active Loan
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {loan.status !== 'returned' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnBook(loan.id)}
                          className="h-7 px-2 text-[11px] gap-1 text-slate-700 hover:text-emerald-700 hover:border-emerald-300"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Return Book
                        </Button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Issue Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Issue Book to Student / Faculty
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueBook} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Book Title</label>
                <select
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                >
                  <option>Concepts of Physics (Vol 2) - H.C. Verma</option>
                  <option>A Brief History of Time - Stephen Hawking</option>
                  <option>Oxford Student Atlas for India</option>
                  <option>First Flight & Footprints - NCERT Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Borrower</label>
                <select
                  value={newBorrower}
                  onChange={(e) => setNewBorrower(e.target.value)}
                  className="w-full text-xs h-9 px-3 border border-slate-200 rounded-lg bg-white"
                >
                  <option>Rohan Verma (DPGA/2021/1048)</option>
                  <option>Aarav Mehta (DPGA/2021/1042)</option>
                  <option>Diya Kapoor (DPGA/2021/1055)</option>
                  <option>Dr. Rajeshwar Sharma (DPGA-T01)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div>Loan Duration: <strong className="text-slate-800">14 Days</strong></div>
                <div>Expected Return Date: <strong className="text-blue-600">8 Dec 2026</strong></div>
                <div>Overdue Fine Rate: <strong className="text-red-600">₹5.00 / day</strong></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
                  Confirm Issue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
