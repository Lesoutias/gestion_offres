import type { OfferStatus } from "../../types";
import { Badge } from "../ui/Badge";

const labels: Record<OfferStatus, string> = {
  draft: "Brouillon incomplet",
  submitted: "Soumise",
  under_review: "En analyse",
  accepted: "Conforme",
  rejected: "Non conforme",
  awarded: "Gagnante",
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const tone = status === "awarded" || status === "accepted" ? "green" : status === "rejected" ? "red" : status === "under_review" ? "amber" : "slate";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}
