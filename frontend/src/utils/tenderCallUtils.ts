import type { TenderCall } from "../types";

export function isSubmissionOpen(tender: Pick<TenderCall, "statut" | "date_limite">): boolean {
  return tender.statut === "published" && new Date(tender.date_limite) > new Date();
}

export function sortPublishedTenders(tenders: TenderCall[]): TenderCall[] {
  return [...tenders].sort((a, b) => {
    const aOpen = isSubmissionOpen(a);
    const bOpen = isSubmissionOpen(b);
    if (aOpen !== bOpen) return aOpen ? -1 : 1;
    return new Date(b.date_publication || b.created_at).getTime() - new Date(a.date_publication || a.created_at).getTime();
  });
}
