'use client';

import { useState } from 'react';

interface QualitySubmission {
  id: string;
  workerName: string;
  workerEmail: string;
  projectTitle: string;
  submittedAt: string;
  submissionContent: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'disputed';
  disputeReason?: string;
  rating?: number;
}

export default function AdminQualityPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'disputes'>('reviews');
  
  const [submissions, setSubmissions] = useState<QualitySubmission[]>([
    {
      id: 'sub-101',
      workerName: 'Robert Waweru',
      workerEmail: 'robertwaweru324@gmail.com',
      projectTitle: 'RLHF Python Code Evaluation',
      submittedAt: '2026-08-16 10:15',
      submissionContent: 'Verified recursive vs iterative Fibonacci solution. Recursion leads to O(2^n) stack overflow for n > 40. Recommended memoization dynamic programming refactor.',
      status: 'pending_review',
    },
    {
      id: 'sub-102',
      workerName: 'Jane Doe',
      workerEmail: 'jane.doe@example.com',
      projectTitle: 'STEM Physics Reasoning Validation',
      submittedAt: '2026-08-15 14:30',
      submissionContent: 'Applied Newton second law F=ma correctly. However, free body diagram calculations failed to account for friction force vector along incline angle.',
      status: 'disputed',
      disputeReason: 'Client claims evaluator incorrectly marked correct free-body diagram calculation as flawed.',
    },
  ]);

  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({});

  const handleApprove = (id: string, rating: number) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'approved', rating } : item
      )
    );
    alert(`Submission ${id} approved with rating ${rating}/5.`);
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
    alert(`Submission ${id} marked as rejected.`);
  };

  const handleResolveDispute = (id: string, resolution: 'side_with_worker' | 'side_with_client') => {
    const finalStatus = resolution === 'side_with_worker' ? 'approved' : 'rejected';
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: finalStatus } : item
      )
    );
    alert(`Dispute resolved: ${resolution === 'side_with_worker' ? 'Upheld worker submission' : 'Refunded/Upheld client dispute'}.`);
  };

  const reviewQueue = submissions.filter((s) => s.status === 'pending_review');
  const disputeQueue = submissions.filter((s) => s.status === 'disputed');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Quality Assurance & Operations</span>
          <h1 className="text-xl font-black text-white mt-1">Quality Control & Dispute Resolution</h1>
        </div>
        <div className="flex gap-2">
          <span className="bg-amber-500/10 text-amber-400 font-mono text-xs px-3 py-1.5 rounded-xl border border-amber-500/20 font-bold">
            Disputes: {disputeQueue.length}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
            Pending Queue: {reviewQueue.length}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'reviews' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Quality Reviews ({reviewQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
            activeTab === 'disputes' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Client Disputes ({disputeQueue.length})
        </button>
      </div>

      {/* Quality Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Pending Submissions for Quality Audit
          </h2>

          {reviewQueue.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No submissions currently waiting for quality review.
            </div>
          ) : (
            <div className="space-y-4">
              {reviewQueue.map((item) => (
                <div key={item.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                        {item.projectTitle}
                      </span>
                      <h3 className="text-sm font-black text-white">{item.workerName} ({item.workerEmail})</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.submittedAt}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Evaluator Submission:</span>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {item.submissionContent}
                    </div>
                  </div>

                  {/* Rating and Action Row */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <span className="text-xs font-bold text-slate-400 shrink-0">Rate Submission:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleApprove(item.id, star)}
                            className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-lg transition"
                          >
                            ★ {star}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleReject(item.id)}
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-xs px-4 py-2 rounded-xl transition"
                      >
                        Reject Submission
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Active Client Disputes
          </h2>

          {disputeQueue.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No active client disputes open.
            </div>
          ) : (
            <div className="space-y-4">
              {disputeQueue.map((item) => (
                <div key={item.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                        Dispute Flagged
                      </span>
                      <h3 className="text-sm font-black text-white">{item.projectTitle}</h3>
                      <span className="text-xs text-slate-400">Worker: {item.workerName} ({item.workerEmail})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.submittedAt}</span>
                  </div>

                  <div className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-red-400 uppercase">Client Dispute Reason:</span>
                    <p className="text-xs text-slate-200">{item.disputeReason}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Original Submission:</span>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono">
                      {item.submissionContent}
                    </div>
                  </div>

                  {/* Resolution Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleResolveDispute(item.id, 'side_with_client')}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                    >
                      Uphold Client Dispute (Refund Client)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(item.id, 'side_with_worker')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                    >
                      Side with Worker (Approve & Pay)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
