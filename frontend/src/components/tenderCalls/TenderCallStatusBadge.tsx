import { Badge } from "../ui/Badge";
import type { TenderStatus } from "../../types";

const labels: Record<TenderStatus, string> = {
  draft: "Brouillon",
  published: "Publie",
  closed: "Cloture",
  evaluation: "Evaluation",
  awarded: "Attribue",
  cancelled: "Annule",
};

export function TenderCallStatusBadge({ status }: { status: TenderStatus }) {
  const tone = status === "published" ? "green" : status === "cancelled" ? "red" : status === "evaluation" ? "amber" : "slate";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}
