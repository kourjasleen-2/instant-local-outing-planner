import { generatePlans } from './src/lib/recommendationEngine';
import { places, defaultRequest } from './src/data/mockData';
import { placePrice } from './src/lib/glimmr-format';

function run(label: string, request: typeof defaultRequest) {
  console.log(`\n=== ${label} ===`);
  console.log('request:', JSON.stringify(request));
  const plans = generatePlans(request, places);
  if (!plans.length) { console.log('NO PLANS GENERATED'); return; }
  for (const plan of plans) {
    console.log(`\n[${plan.recommendationLabel}] ${plan.title}`);
    console.log(`  vibe: ${plan.vibe}`);
    console.log(`  feasible: ${plan.feasible}${plan.feasibilityNote ? ' -- ' + plan.feasibilityNote : ''}`);
    console.log(`  price/person: Rs${plan.pricePerPerson}  group total: Rs${plan.groupTotal}`);
    console.log(`  total time: ${plan.totalMinutes}min  travel: ${plan.travelMinutes}min  distance: ${plan.totalDistanceKm}km`);
    console.log(`  reasons: ${plan.recommendationReason.join(', ')}`);
    for (const step of plan.steps) {
      console.log(`    - ${step.arrival}  ${step.place.name} (${step.place.category}, Rs${placePrice(step.place)})  [+${step.travelMinutes}min travel, ${step.distanceKm}km]`);
    }
  }
}

run('Default request (Food crawl, 180min, budget 500, 4 people, transit)', defaultRequest);
run('Tight budget + short time', { ...defaultRequest, availableMinutes: 90, budget: 250 });
run('Date night, low-key', { ...defaultRequest, outingType: 'Date night', people: 2, preference: 'somewhere peaceful and quiet, good for photos' });
run('Fresh air, walking', { ...defaultRequest, outingType: 'Fresh air', transport: 'walk', preference: 'outdoor and free' });
run('Impossible: 20 min available', { ...defaultRequest, availableMinutes: 20 });
