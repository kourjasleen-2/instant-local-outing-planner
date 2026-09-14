import { defaultRequest, places } from '@/data/mockData';
import { generatePlans } from '@/lib/recommendationEngine';
import { placePrice } from '@/lib/glimmr-format';
import type { Outing, Plan, PlanEdit, PlannerRequest, PlanStep } from '@/types/glimmr';

const wait = (ms = 420) => new Promise((resolve) => window.setTimeout(resolve, ms));

/**
 * In-memory plan store, keyed by plan id.
 *
 * Client-side cache only — survives navigation within the app but not a hard
 * refresh or a new tab on a deep link. getPlanById falls back to regenerating
 * from the default request rather than 404ing, which is the right trade-off
 * until a real backend replaces this service layer.
 */
const planStore = new Map<string, Plan>();

export function calculatePlanTotals(plan: Plan, status: Plan['status'] = plan.status): Plan {
  const pricePerPerson = plan.steps.reduce((total, step) => total + placePrice(step.place), 0);
  const totalMinutes = plan.steps.reduce((total, step) => total + step.durationMinutes + step.travelMinutes, 0);
  const travelMinutes = plan.steps.reduce((total, step) => total + step.travelMinutes, 0);
  const totalDistanceKm = Number(plan.steps.reduce((total, step) => total + step.distanceKm, 0).toFixed(1));
  const feasible = totalMinutes <= plan.request.availableMinutes;
  const updated: Plan = {
    ...plan,
    totalMinutes,
    pricePerPerson,
    groupTotal: pricePerPerson * plan.request.people,
    totalDistanceKm,
    travelMinutes,
    feasible,
    feasibilityNote: feasible ? undefined : `This edit adds ${totalMinutes - plan.request.availableMinutes} min beyond your available time.`,
    status,
  };
  planStore.set(updated.id, updated);
  return updated;
}

export async function createPlans(request: PlannerRequest): Promise<Plan[]> {
  await wait();
  if (request.availableMinutes <= 30 || request.budget <= 100) return [];
  return generatePlans(request, places).map((plan) => calculatePlanTotals(plan, 'ready'));
}

export async function getPlanById(id: string): Promise<Plan> {
  await wait(260);
  const cached = planStore.get(id);
  if (cached) return calculatePlanTotals(cached, 'ready');
  // Refresh fallback: regenerate from the default request.
  const [fallback] = generatePlans(defaultRequest, places);
  return calculatePlanTotals(fallback, 'ready');
}

export async function getOuting(planId: string): Promise<Outing> {
  const plan = await getPlanById(planId);
  return {
    id: `outing-${planId}`,
    planId,
    startedAt: new Date().toISOString(),
    currentStepId: plan.steps[1]?.id ?? plan.steps[0].id,
    completedStepIds: [plan.steps[0]?.id ?? ''],
  };
}

export async function editPlan(plan: Plan, edit: PlanEdit): Promise<Plan> {
  await wait(220);
  let steps = [...plan.steps];

  if (edit.type === 'delete' && edit.stepId) {
    steps = steps.filter((step) => step.id !== edit.stepId);
  }

  if (edit.type === 'replace' && edit.stepId && edit.placeId) {
    const replacement = places.find((place) => place.id === edit.placeId);
    steps = steps.map((step) =>
      replacement && step.id === edit.stepId
        ? { ...step, place: replacement, durationMinutes: replacement.typicalVisitDuration }
        : step,
    );
  }

  if (edit.type === 'edit' && edit.stepId && edit.changes) {
    steps = steps.map((step) => (step.id === edit.stepId ? { ...step, ...edit.changes } : step));
  }

  // Natural-language instruction: map keywords to a structured place swap
  // against the existing data set — never invents a new place.
  if (edit.type === 'edit' && edit.stepId && edit.instruction) {
    const instruction = edit.instruction.toLowerCase();
    const currentStep = steps.find((step) => step.id === edit.stepId);
    if (currentStep) {
      let candidate: (typeof places)[number] | undefined;
      if (instruction.includes('cheap')) {
        candidate = places
          .filter((place) => place.id !== currentStep.place.id && placePrice(place) < placePrice(currentStep.place))
          .sort((a, b) => placePrice(a) - placePrice(b))[0];
      } else if (instruction.includes('far') || instruction.includes('farther')) {
        candidate = places.find((place) => place.id !== currentStep.place.id && place.category !== currentStep.place.category);
      } else if (instruction.includes('vegetarian') || instruction.includes('veg')) {
        candidate = places.find((place) => place.id !== currentStep.place.id && place.category === currentStep.place.category);
      }
      if (candidate) {
        const found = candidate;
        steps = steps.map((step) =>
          step.id === edit.stepId
            ? { ...step, place: found, durationMinutes: found.typicalVisitDuration, note: edit.instruction }
            : step,
        );
      }
    }
  }

  if (edit.type === 'add' && edit.placeId) {
    const place = places.find((item) => item.id === edit.placeId);
    if (place) {
      const previous = steps[steps.length - 1]?.place;
      const newStep: PlanStep = {
        id: `step-${place.id}-${Date.now()}`,
        place,
        arrival: 'Later that evening',
        durationMinutes: place.typicalVisitDuration,
        travelMinutes: previous ? 12 : 0,
        distanceKm: previous ? 1 : 0,
        note: edit.instruction || 'Added to your route.',
      };
      steps = [...steps, newStep];
    }
  }

  return calculatePlanTotals({ ...plan, steps }, 'success');
}
