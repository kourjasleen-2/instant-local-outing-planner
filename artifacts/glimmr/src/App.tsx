import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { PageTransition } from '@/components/motion/PageTransition';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Planner from '@/pages/planner';
import Results from '@/pages/results';
import PlanDetail from '@/pages/plan-detail';
import Outing from '@/pages/outing';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <PageTransition routeKey={location}>
        <Switch>
           <Route path="/" component={Home} />
           <Route path="/planner" component={Planner} />
           <Route path="/results" component={Results} />
           <Route path="/plan/:id" component={PlanDetail} />
           <Route path="/outing/:id" component={Outing} />
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
