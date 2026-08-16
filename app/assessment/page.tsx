'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentPage() {
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/assessment')
      .then((res) => res.json())
      .then((data) => {
        setAssessment(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold text-sm">
        Loading assessment portal...
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-lg text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center font-black text-2xl ${result.passed ? 'bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400' : 'bg-amber-500/10 border-2 border-amber-500 text-amber-400'}`}>
            {result.score}%
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">{result.passed ? 'Assessment Passed!' : 'Under Review'}</h1>
            <p className="text-xs text-slate-400 leading-relaxed">{result.message}</p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between text-xs">
            <span className="text-slate-400">New Worker Status:</span>
            <span className="font-mono font-bold text-emerald-400">{result.status}</span>
          </div>

          <button onClick={() => router.push('/dashboard')} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition">
            Go to Worker Dashboard
          </button>
        </div>
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-black uppercase tracking-widest text-emerald-400">Skill Evaluation</span>
            <span className="font-mono text-slate-400">Question {currentStep + 1} of {questions.length}</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white leading-snug">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option: string, idx: number) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                    className={`w-full text-left p-4 rounded-2xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 disabled:opacity-30"
          >
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length || submitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              {submitting ? 'Grading Exam...' : 'Submit & Grade Exam'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={answers[currentQuestion?.id] === undefined}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
