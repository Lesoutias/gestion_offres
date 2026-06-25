import { api, unwrap } from "./api";

export type ReportType =
  | "companies_ranking"
  | "offers_summary"
  | "commission_evaluations"
  | "tenders_overview";

export interface ReportArchive {
  id: number;
  report_type: ReportType;
  tender_call_id?: number | null;
  file_name: string;
  file_path: string;
  generated_by_id: number;
  created_at: string;
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  companies_ranking: "Classement des entreprises",
  offers_summary: "Synthese des offres",
  commission_evaluations: "Rapport commission",
  tenders_overview: "Vue globale des appels",
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function extractFilename(contentDisposition: string | undefined, fallback: string): string {
  if (!contentDisposition) return fallback;
  const match = /filename="?([^"]+)"?/i.exec(contentDisposition);
  return match?.[1] || fallback;
}

async function downloadPdf(path: string, fallbackFilename: string) {
  const response = await api.get(path, { responseType: "blob" });
  const filename = extractFilename(response.headers["content-disposition"], fallbackFilename);
  downloadBlob(response.data, filename);
}

export const reportService = {
  downloadCompaniesRanking: (tenderCallId: number) =>
    downloadPdf(`/reports/tender/${tenderCallId}/companies-ranking/pdf`, `classement-entreprises-${tenderCallId}.pdf`),
  downloadOffersSummary: (tenderCallId: number) =>
    downloadPdf(`/reports/tender/${tenderCallId}/offers-summary/pdf`, `synthese-offres-${tenderCallId}.pdf`),
  downloadCommissionEvaluations: (tenderCallId: number) =>
    downloadPdf(`/reports/tender/${tenderCallId}/commission-evaluations/pdf`, `rapport-commission-${tenderCallId}.pdf`),
  downloadTendersOverview: () =>
    downloadPdf("/reports/tenders-overview/pdf", "vue-globale-appels-offres.pdf"),
  listArchives: (tenderCallId?: number) =>
    unwrap<ReportArchive[]>(
      api.get("/reports/archives", { params: tenderCallId ? { tender_call_id: tenderCallId } : undefined }),
    ),
  downloadArchive: (exportId: number, fallbackFilename: string) =>
    downloadPdf(`/reports/archives/${exportId}/download`, fallbackFilename),
};
