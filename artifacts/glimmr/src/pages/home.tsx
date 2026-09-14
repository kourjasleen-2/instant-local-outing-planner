import { ArrowRight, CalendarClock, Crosshair, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { Header } from '@/components/glimmr-ui';
import GlimmrPreloader from '@/components/glimmr-preloader';
import InfiniteSpiral from '@/components/infinite-spiral';
import TextLoop from '@/components/text-loop';

export default function Home() {
  return <div className="glimmr-app">
    <GlimmrPreloader />
    <Header />
    <main>
      <section className="hero container-shell">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">for the plans that shift</div>
            <h1 className="display">Make the next few hours <span style={{ color: '#3b82f6' }}>glimmr.</span></h1>
             <TextLoop />
             <p className="hero-copy">Tell GLIMMR where you are, what time and energy you have, and where you want to end up. It builds a realistic outing you can still change later.</p>
             <p className="coverage-note">Currently available in Indiranagar, Koramangala &amp; Church Street.</p>
             <div className="hero-actions"><Link href="/planner" className="btn btn-blue" data-testid="button-hero-plan">Plan an Outing <ArrowRight size={16} /></Link><a href="#how-it-works" className="btn btn-ghost" data-testid="link-hero-how">See how it works</a></div>
          </div>
            <InfiniteSpiral />
        </div>
      </section>
      <div className="trust-strip"><div className="container-shell trust-inner"><span>ONE GOOD PLAN, NOT 40 TABS</span><span>LIVE WITH THE MOMENT</span><span>MADE FOR LAST-MINUTE PEOPLE</span></div></div>
      <section className="feature-section container-shell" id="how-it-works">
        <div className="section-heading"><div className="eyebrow">less browsing. more being there.</div><h2 className="display">A little structure for spontaneous people.</h2><p className="muted">Plans change. GLIMMR keeps the good part: an outing with a beginning, a middle, and somewhere worth ending up.</p></div>
        <div className="feature-grid">
          <article className="feature-card surface"><div className="feature-icon"><Crosshair size={21} /></div><div><h3>Knows the shape of your time.</h3><p>Budget, distance, group size, and the mood you actually have today—all in one quick input.</p></div></article>
          <article className="feature-card surface"><div className="feature-icon"><Zap size={21} /></div><div><h3>Three paths. One clear pick.</h3><p>Different energy levels, not three versions of the same list.</p></div></article>
          <article className="feature-card surface"><div className="feature-icon"><CalendarClock size={21} /></div><div><h3>Changes without the reset.</h3><p>Swap a stop, add a detour, and see the route recalculate in place.</p></div></article>
        </div>
      </section>
       <section className="container-shell" style={{ paddingBottom: 100 }}><div className="surface" style={{ background: '#e5efff', padding: '36px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap' }}><div><div className="eyebrow">ready when you are</div><h2 className="display" style={{ fontSize: '2.2rem', margin: '9px 0 0' }}>The plan can be easy.</h2></div><Link href="/planner" className="btn btn-primary" data-testid="button-bottom-plan">Plan an Outing <ArrowRight size={16} /></Link></div></section>
    </main>
    <footer className="footer"><div className="container-shell footer-inner"><span className="brand"><span className="brand-mark">G</span>glimmr</span><small>Good plans for right now.</small></div></footer>
  </div>;
}