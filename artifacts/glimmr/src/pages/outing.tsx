import { useEffect, useState } from 'react';
import { Check, ChevronRight, MapPin, Navigation } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { Header } from '@/components/glimmr-ui';
import { formatDuration, formatINR } from '@/lib/glimmr-format';
import { getOuting, getPlanById } from '@/services/glimmrService';
import type { Outing as OutingRecord, Plan } from '@/types/glimmr';

export default function Outing() {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [outing, setOuting] = useState<OutingRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPlanById(id ?? '').then((loadedPlan) => {
      if (cancelled) return;
      setPlan(loadedPlan);
      void getOuting(loadedPlan.id).then((loadedOuting) => { if (!cancelled) setOuting(loadedOuting); });
    });
    return () => { cancelled = true; };
  }, [id]);

  if (!plan || !outing) return <div className="glimmr-app"><Header compact /><main className="page container-shell"><p className="muted" role="status">Loading your outing…</p></main></div>;

  return <div className="glimmr-app"><Header compact /><main className="page container-shell"><div className="outing-layout">
    <section className="map-panel" aria-label="Decorative route map"><div className="map-chip"><Navigation size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Live route · 42% complete</div><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 76 C 24 62, 27 25, 47 35 S 62 80, 83 18" fill="none" stroke="#3B82F6" strokeWidth="1.3" strokeDasharray="2 1" /><circle cx="12" cy="76" r="3" fill="#FBBF24" stroke="#fff" strokeWidth="1" /><circle cx="47" cy="35" r="3" fill="#3B82F6" stroke="#fff" strokeWidth="1" /><circle cx="83" cy="18" r="3" fill="#fff" stroke="#3B82F6" strokeWidth="1" /></svg></section>
      <section className="surface outlining-card"><span className="outing-status"><i className="status-dot" />outing in progress</span><h1>{plan.title}</h1><p className="muted">Keep the route loose. GLIMMR will keep the next thing obvious.</p><div className="outing-summary"><span>{formatINR(plan.pricePerPerson)} / person</span><span>{formatINR(plan.groupTotal)} group total</span><span>{formatDuration(plan.totalMinutes)}</span></div><div className="next-stop"><span>next stop</span><h2>{plan.steps[1]?.place.name ?? plan.steps[0].place.name}</h2><p className="muted">{plan.steps[1]?.place.address ?? plan.steps[0].place.address}</p><div className="progress-bar"><i /></div><small className="muted">12 min by transit · 1 km</small></div><ul className="stop-list">{plan.steps.map((step, index) => <li key={step.id} className={step.id === outing.completedStepIds[0] ? 'done' : ''}><b>{step.id === outing.completedStepIds[0] ? <Check size={13} /> : index + 1}</b><span>{step.place.name}</span>{step.id === outing.currentStepId && <ChevronRight size={15} color="#3b82f6" style={{ marginLeft: 'auto' }} />}</li>)}</ul><div style={{ display: 'flex', gap: 8, marginTop: 22 }}><button className="btn btn-blue" style={{ flex: 1 }} data-testid="button-open-directions" onClick={() => window.alert('Directions are ready — follow the blue line.') }><MapPin size={15} /> Open directions</button><Link href={`/plan/${plan.id}`} className="btn btn-soft" data-testid="button-edit-active-plan">Edit plan</Link></div></section>
  </div></main></div>;
}