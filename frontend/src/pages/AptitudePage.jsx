import React, { useEffect, useState } from 'react';
import { HiOutlineAcademicCap, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import aptitudeApi from '../api/aptitudeApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const categories = ['Mixed', 'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'];

const AptitudePage = () => {
  const [category, setCategory] = useState('Mixed'); const [test, setTest] = useState(null); const [answers, setAnswers] = useState({}); const [result, setResult] = useState(null); const [history, setHistory] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const loadHistory = async () => { try { const res = await aptitudeApi.getHistory(); setHistory(res.data || []); } catch { /* test can still be started */ } };
  useEffect(() => { loadHistory(); }, []);
  const start = async () => { setLoading(true); setError(''); try { const res = await aptitudeApi.startTest({ category, count: 5, durationMinutes: 10 }); setTest(res.data); setAnswers({}); setResult(null); } catch (e) { setError(e.response?.data?.message || 'Could not start a test.'); } finally { setLoading(false); } };
  const submit = async () => { setLoading(true); try { const res = await aptitudeApi.submitTest({ attemptId: test.attemptId, answers: Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption })) }); setResult(res.data); loadHistory(); } catch (e) { setError(e.response?.data?.message || 'Could not submit the test.'); } finally { setLoading(false); } };
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <HiOutlineAcademicCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Aptitude Practice & Tests</h1>
          <p className="text-xs text-slate-500">
            Timed tests across Quantitative, Logical Reasoning, Verbal, and Data Interpretation
          </p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {!test && <div className="bg-white border border-slate-200 rounded-3xl p-7 max-w-xl"><h2 className="font-bold text-lg">Start a practice test</h2><p className="text-sm text-slate-500 mt-1">Five questions · ten minutes · explanations after submission</p><select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-5 w-full border border-slate-300 rounded-xl p-3 text-sm">{categories.map((c) => <option key={c}>{c}</option>)}</select><button disabled={loading} onClick={start} className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold disabled:opacity-50">{loading ? 'Starting...' : 'Start timed test'}</button></div>}
      {test && !result && <div className="space-y-4"><div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 flex gap-2"><HiOutlineClock className="w-5 h-5" />Timer: {Math.ceil(test.durationLimitSeconds / 60)} minutes. Your score is calculated on the server.</div>{test.questions.map((q, i) => <div key={q._id} className="bg-white border border-slate-200 rounded-2xl p-5"><p className="font-bold text-slate-900">{i + 1}. {q.question}</p><div className="mt-3 space-y-2">{q.options.map((option, index) => <label key={index} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-slate-50 cursor-pointer"><input type="radio" name={q._id} checked={answers[q._id] === index} onChange={() => setAnswers((a) => ({ ...a, [q._id]: index }))} />{option}</label>)}</div></div>)}<button disabled={loading} onClick={submit} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold disabled:opacity-50">{loading ? 'Scoring...' : 'Submit for server scoring'}</button></div>}
      {result && <div className="space-y-4"><div className="bg-white border border-emerald-200 rounded-3xl p-7 text-center"><HiOutlineCheckCircle className="w-10 h-10 mx-auto text-emerald-600" /><p className="mt-2 text-slate-500 text-sm">Score</p><p className="text-4xl font-black text-emerald-700">{result.scorePercentage}%</p><p className="text-sm text-slate-600">{result.correctAnswers} of {result.totalQuestions} correct</p><button onClick={() => { setTest(null); setResult(null); }} className="mt-4 text-sm font-bold text-amber-700">Take another test</button></div>{result.results.map((r, i) => <div key={r.questionId} className={`p-4 rounded-2xl border ${r.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}><p className="font-semibold text-sm">{i + 1}. {r.question}</p><p className="text-xs mt-2">{r.isCorrect ? 'Correct' : `Correct answer: ${r.options[r.correctAnswerIndex]}`}</p><p className="text-xs mt-1 text-slate-600">{r.explanation}</p></div>)}</div>}
      <div className="bg-white border border-slate-200 rounded-2xl p-5"><h2 className="font-bold text-slate-900">Recent attempts</h2>{history.length ? <div className="mt-3 space-y-2">{history.slice(0, 5).map((a) => <div key={a._id} className="text-sm flex justify-between"><span>{a.category}</span><span className="font-bold">{a.scorePercentage}%</span></div>)}</div> : <p className="mt-2 text-sm text-slate-500">No completed tests yet.</p>}</div>
    </div>
  );
};

export default AptitudePage;
