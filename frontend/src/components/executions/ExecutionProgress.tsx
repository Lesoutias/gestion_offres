import type { Execution } from "../../types";
import { Badge } from "../ui/Badge";

export function ExecutionProgress({ execution }: { execution: Execution }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge tone={execution.statut === "completed" ? "green" : execution.statut === "delayed" ? "amber" : "blue"}>{execution.statut}</Badge>
        <span className="text-sm font-semibold">{execution.avancement}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-emerald-700" style={{ width: `${Math.min(100, Math.max(0, execution.avancement))}%` }} />
      </div>
    </div>
  );
}
