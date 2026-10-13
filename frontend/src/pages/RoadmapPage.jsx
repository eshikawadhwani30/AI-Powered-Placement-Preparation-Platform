import React, { useEffect, useState } from 'react';
import { HiOutlineMap, HiOutlineSparkles, HiOutlineCheckCircle } from 'react-icons/hi2';
import roadmapApi from '../api/roadmapApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const RoadmapPage = () => {
  const [roadmap, setRoadmap] = useState(null); const [loading, setLoading] = useState(true); const [generating, setGenerating] = useState(false); const [error, setError] = useState('');
  const load = async () => { setLoading(true); try { const r = await roadmapApi.getRoadmap(); setRoadmap(r.data); } catch (e) { setError(e.response?.data?.message || 'Could not load your roadmap.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const generate = async () => { setGenerating(true); setError(''); try { const r = await roadmapApi.generate(); setRoadmap(r.data); } catch (e) { setError(e.response?.data?.message || 'Could not generate your roadmap.'); } finally { setGenerating(false); } };
  const toggle = async (task) => { try { const r = await roadmapApi.updateTask(task._id, !task.isCompleted); setRoadmap(r.data); } catch (e) { setError(e.response?.data?.message || 'Could not update this task.'); } };
  const completed = roadmap?.tasks?.filter((t) => t.isCompleted).length || 0; const total = roadmap?.tasks?.length || 0;
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <HiOutlineMap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
          <p className="text-xs text-slate-500">
            Synthesized milestones driven by your resume audit, DSA progress, and mock test scores
          </p>
        </div>
        </div>
        <button onClick={generate} disabled={generating} className="shrink-0 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl disabled:opacity-50">{generating ? 'Generating...' : roadmap ? 'Regenerate' : 'Generate roadmap'}</button>
      </div>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      {loading ? <LoadingSpinner text="Loading roadmap..." /> : !roadmap ? <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center"><HiOutlineSparkles className="w-10 h-10 text-purple-600 mx-auto" /><h2 className="font-bold text-lg mt-3">Build your plan</h2><p className="text-sm text-slate-500 mt-1">Generate tasks based on resume, DSA, aptitude, interview, and profile progress.</p></div> : <><div className="bg-white border border-slate-200 rounded-3xl p-6"><div className="flex justify-between gap-4"><div><p className="text-xs text-slate-500 uppercase font-bold">Objective readiness</p><p className="text-4xl font-black text-purple-700">{roadmap.overallReadinessScore}%</p></div><div className="text-right"><p className="text-xs text-slate-500">Task completion</p><p className="font-bold">{completed}/{total}</p></div></div><div className="h-2 mt-4 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-purple-600" style={{ width: `${total ? Math.round(completed / total * 100) : 0}%` }} /></div><p className="mt-4 text-sm text-slate-600">{roadmap.summary}</p></div><div className="grid lg:grid-cols-3 gap-5"><div className="lg:col-span-2 space-y-3">{roadmap.tasks.map((task) => <button key={task._id} onClick={() => toggle(task)} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-4 flex gap-3 hover:border-purple-300"><HiOutlineCheckCircle className={`w-5 h-5 shrink-0 ${task.isCompleted ? 'text-emerald-600' : 'text-slate-300'}`} /><div><p className={`font-semibold text-sm ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>{task.title}</p><p className="text-xs text-slate-500 mt-1">{task.category} · {task.priority} priority · ~{task.estimatedHours}h</p></div></button>)}</div><aside className="bg-purple-50 border border-purple-200 rounded-2xl p-5"><h2 className="font-bold text-purple-950">Recommendations</h2><ul className="mt-3 space-y-3 text-sm text-purple-900">{roadmap.aiRecommendations?.map((r, i) => <li key={i}>• {r}</li>)}</ul></aside></div></>}
    </div>
  );
};

export default RoadmapPage;
