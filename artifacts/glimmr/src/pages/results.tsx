import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { Header, PlanCard, EmptyState } from '@/components/glimmr-ui';
import { JourneyStepper } from '@/components/JourneyStepper';
import { StaggerContainer, StaggerItem } from '@/components/motion/Stagger';
import { createPlans } from '@/services/glimmrService';
import { defaultRequest } from '@/data/mockData';
import type { Plan, PlannerRequest } from '@/types/glimmr';
import { formatDuration, formatINR } from '@/lib/glimmr-format';

export default function Results() {
  const [, setLocation] = useLocation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [request, setRequest] = useState<PlannerRequest>(defaultRequest);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMode, setLoadingMode] = useState<'initial' | 'regenerate'>('initial');
  const load = async (mode: 'initial' | 'regenerate' = 'initial') => {
    setLoadingMode(mode);
    setLoading(true); setError(null);
    try { const nextRequest = JSON.parse(sessionStorage.getItem('glimmr-request') ?? JSON.stringify(defaultRequest)) as PlannerRequest; setRequest(nextRequest); setPlans(await createPlans(nextRequest)); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not create plans.'); } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  return <div className="glimmr-app"><Header compact /><main className="page container-shell"><JourneyStepper active="pick" />
     <div className="page-header"><div><Link href="/planner" className="btn btn-ghost" style={{ paddingLeft: 0 }} data-testid="link-results-back"><ArrowLeft size={15} /> Tune inputs</Link><div className="eyebrow" style={{ marginTop: 20 }}>three ways to spend it</div><h1 className="display">Pick your kind of good.</h1><p className="muted">Built for {request.people === 6 ? '6+' : request.people} {request.people === 1 ? 'person' : 'people'} · {request.from} to {request.to} · {formatDuration(request.availableMinutes)}</p></div><button className="btn btn-soft" onClick={() => void load('regenerate')} disabled={loading} data-testid="button-regenerate"><RefreshCw size={15} /> Regenerate</button></div>
     <div className="surface results-context"><span className="context-pill blue">{request.outingType}</span><span className="context-pill">{request.transport}</span><span className="context-pill">{formatINR(request.budget)} per person</span>{request.preference && <span className="context-pill">“{request.preference}”</span>}</div>
      {loading ? <div role="status" aria-live="polite"><div className="loading-copy"><strong>{loadingMode === 'regenerate' ? 'Finding a better fit...' : 'Finding places that fit...'}</strong><span>{loadingMode === 'regenerate' ? 'Checking travel and building another plan.' : 'Checking travel time and building your plan.'}</span></div><div className="plans-grid"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div></div> : error ? <div className="surface error-card"><h2 className="display">We couldn’t update these plans.</h2><p className="muted">{error}</p><p className="muted">Check that the API is running, the Supabase SQL schema was run, and your backend `.env` has valid database credentials.</p><button className="btn btn-blue" onClick={() => void load('regenerate')} data-testid="button-retry-results">Try again</button></div> : plans.length ? <StaggerContainer className="plans-grid">{plans.map((plan) => <StaggerItem key={plan.id} className="plan-card-slot" strong={plan.recommendationLabel === 'Best fit'}><PlanCard plan={plan} /></StaggerItem>)}</StaggerContainer> : <EmptyState onReset={() => setLocation('/planner')} />}
  </main></div>;
}
