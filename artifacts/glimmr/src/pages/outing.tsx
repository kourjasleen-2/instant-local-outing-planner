import { useEffect, useState } from 'react';
import { Check, ChevronRight, MapPin, Navigation } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { Header } from '@/components/glimmr-ui';
import { formatDuration, formatINR } from '@/lib/glimmr-format';
import { getOuting, getPlanById, saveOuting } from '@/services/glimmrService';
import type { Outing as OutingRecord, Plan } from '@/types/glimmr';

export default function Outing() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [outing, setOuting] = useState<OutingRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPlanById(id ?? '').then((loadedPlan) => {
      if (cancelled || !loadedPlan) return;
      setPlan(loadedPlan);
      void getOuting(loadedPlan.id).then((loadedOuting) => {
        if (!cancelled && loadedOuting) setOuting(loadedOuting);
      });
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="glimmr-app"><Header compact /><main className="page container-shell"><p className="muted" role="status">Loading your outing…</p></main></div>;
  if (!plan || !outing) return <div className="glimmr-app"><Header compact /><main className="page container-shell"><div className="surface error-card"><h1 className="display">That outing is no longer available.</h1><p className="muted">Create or open a plan first, then start the outing from there.</p><Link href="/results" className="btn btn-blue">Back to plans</Link></div></main></div>;

  const currentIndex = Math.max(0, plan.steps.findIndex((step) => step.id === outing.currentStepId));
  const currentStep = plan.steps[currentIndex];
  const completedCount = outing.completedStepIds.length;
  const progress = Math.round((completedCount / plan.steps.length) * 100);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentStep.place.lat},${currentStep.place.lng}`;
  const completeCurrentStop = () => {
    const nextIndex = Math.min(currentIndex + 1, plan.steps.length - 1);
    setOuting((current) => {
      if (!current) return current;
      const updated = {
      ...current,
      completedStepIds: current.completedStepIds.includes(currentStep.id) ? current.completedStepIds : [...current.completedStepIds, currentStep.id],
      currentStepId: plan.steps[nextIndex].id,
      };
      saveOuting(updated);
      return updated;
    });
  };

  return <div className="glimmr-app"><Header compact /><main className="page container-shell"><div className="outing-layout">
    <section className="map-panel" aria-label="Decorative route map"><div className="map-chip"><Navigation size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Live route · {progress}% complete</div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 76 C 24 62, 27 25, 47 35 S 62 80, 83 18" fill="none" stroke="#3B82F6" strokeWidth="1.3" strokeDasharray="2 1" /><circle cx="12" cy="76" r="3" fill="#FBBF24" stroke="#fff" strokeWidth="1" /><circle cx="47" cy="35" r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1" /><circle cx="83" cy="18" r="3" fill="#fff" stroke="#3B82F6" strokeWidth="1" /></svg></section>
    <section className="surface outlining-card"><span className="outing-status"><i className="status-dot" />outing in progress</span><h1>{plan.title}</h1><p className="muted">Keep the route loose. GLIMMR will keep the next thing obvious.</p><div className="outing-summary"><span>{formatINR(plan.pricePerPerson)} / person</span><span>{formatINR(plan.groupTotal)} group total</span><span>{formatDuration(plan.totalMinutes)}</span></div><div className="next-stop"><span>{currentIndex === plan.steps.length - 1 && completedCount === plan.steps.length ? 'outing complete' : 'next stop'}</span><h2>{currentStep.place.name}</h2><p className="muted">{currentStep.place.address}</p><div className="progress-bar"><i style={{ width: `${progress}%` }} /></div><small className="muted">{currentStep.travelMinutes ? `${currentStep.travelMinutes} min · ${currentStep.distanceKm} km` : 'You’re at the first stop'}</small></div><ul className="stop-list">{plan.steps.map((step, index) => <li key={step.id} className={outing.completedStepIds.includes(step.id) ? 'done' : ''}><b>{outing.completedStepIds.includes(step.id) ? <Check size={13} /> : index + 1}</b><span>{step.place.name}</span>{step.id === outing.currentStepId && completedCount < plan.steps.length && <ChevronRight size={15} color="#3b82f6" style={{ marginLeft: 'auto' }} />}</li>)}</ul><div style={{ display: 'flex', gap: 8, marginTop: 22 }}><a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-blue" style={{ flex: 1 }} data-testid="button-open-directions"><MapPin size={15} /> Open directions</a><button className="btn btn-soft" onClick={completeCurrentStop} disabled={completedCount === plan.steps.length} data-testid="button-complete-stop">Mark complete</button><Link href={`/plan/${plan.id}`} className="btn btn-soft" data-testid="button-edit-active-plan">Edit plan</Link></div></section>
  </div></main></div>;
}
