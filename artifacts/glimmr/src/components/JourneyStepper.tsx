type Stage = "shape" | "pick" | "go";
const stages: Array<{ id: Stage; label: string; number: number }> = [{ id: "shape", label: "Shape it", number: 1 }, { id: "pick", label: "Pick a path", number: 2 }, { id: "go", label: "Go", number: 3 }];
export function JourneyStepper({ active }: { active: Stage }) {
  const activeIndex = stages.findIndex((stage) => stage.id === active);
  return <div className="stepper" aria-label={`Step ${activeIndex + 1} of 3`}>{stages.map((stage, index) => <span key={stage.id} style={{ display: "contents" }}><div className={`step ${index <= activeIndex ? "active" : ""}`} aria-current={stage.id === active ? "step" : undefined}><strong>{index < activeIndex ? "✓" : stage.number}</strong>{stage.label}</div>{index < stages.length - 1 && <div className={`step-line ${index < activeIndex ? "active" : ""}`} />}</span>)}</div>;
}
