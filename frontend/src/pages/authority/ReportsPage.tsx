import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Select } from "../../components/ui/Select";
import { Table } from "../../components/ui/Table";
import { getApiErrorMessage } from "../../services/api";
import { REPORT_TYPE_LABELS, reportService } from "../../services/reportService";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

type ReportAction =
  | "ranking"
  | "summary"
  | "commission"
  | "overview";

export default function ReportsPage() {
  const tenders = useAsyncData(() => tenderCallService.getAll(), []);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState<ReportAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [archiveVersion, setArchiveVersion] = useState(0);
  const archives = useAsyncData(
    () => reportService.listArchives(selectedId ? Number(selectedId) : undefined),
    [selectedId, archiveVersion],
  );

  const tenderOptions = (tenders.data || []).map((tender) => ({
    label: `${tender.reference} — ${tender.objet}`,
    value: String(tender.id),
  }));

  const selectedTender = (tenders.data || []).find((tender) => String(tender.id) === selectedId);

  const refreshArchives = () => setArchiveVersion((value) => value + 1);

  const handleDownload = async (type: ReportAction) => {
    if (type !== "overview" && !selectedId) {
      setError("Selectionnez un appel d'offres.");
      return;
    }
    try {
      setLoadingReport(type);
      setError(null);
      const tenderCallId = Number(selectedId);
      if (type === "ranking") await reportService.downloadCompaniesRanking(tenderCallId);
      else if (type === "summary") await reportService.downloadOffersSummary(tenderCallId);
      else if (type === "commission") await reportService.downloadCommissionEvaluations(tenderCallId);
      else await reportService.downloadTendersOverview();
      refreshArchives();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Generation du rapport impossible"));
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <>
      <PageTitle
        title="Rapports"
        description="Generez, archivez et telechargez les PDF de classement, synthese, commission et vue globale."
      />
      <StateBlock loading={tenders.loading} error={tenders.error}>
        <div className="grid gap-6">
          <Card title="Selection de l'appel d'offres">
            <Select
              label="Appel d'offres (rapports par appel)"
              value={selectedId}
              onChange={(event) => {
                setSelectedId(event.target.value);
                setError(null);
              }}
              options={[{ label: "Choisir un appel d'offres", value: "" }, ...tenderOptions]}
            />
            {selectedTender && (
              <p className="mt-3 text-sm text-slate-600">
                Statut : {selectedTender.statut} — Date limite :{" "}
                {new Date(selectedTender.date_limite).toLocaleString()}
              </p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              Les rapports par appel peuvent etre generes meme sans offre recue (contenu informatif).
            </p>
          </Card>

          <Card title="Rapports PDF disponibles">
            <div className="grid gap-4 lg:grid-cols-2">
              <ReportBlock
                title="Classement des entreprises"
                description="Classement par score total avec montants et statuts."
                loading={loadingReport === "ranking"}
                disabled={!selectedId || loadingReport !== null}
                onClick={() => handleDownload("ranking")}
              />
              <ReportBlock
                title="Synthese des offres et DAO"
                description="Offres, pieces exigees et conformite documentaire."
                loading={loadingReport === "summary"}
                disabled={!selectedId || loadingReport !== null}
                variant="secondary"
                onClick={() => handleDownload("summary")}
              />
              <ReportBlock
                title="Rapport commission"
                description="Recommandations, commentaires et scores au moment de l'evaluation."
                loading={loadingReport === "commission"}
                disabled={!selectedId || loadingReport !== null}
                onClick={() => handleDownload("commission")}
              />
              <ReportBlock
                title="Vue globale des appels"
                description="Tous les appels d'offres : statut, nombre d'offres et meilleur score."
                loading={loadingReport === "overview"}
                disabled={loadingReport !== null}
                variant="secondary"
                onClick={() => handleDownload("overview")}
              />
            </div>
            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          </Card>

          <Card title="Archives des rapports generes">
            <StateBlock loading={archives.loading} error={archives.error}>
              {(archives.data || []).length === 0 ? (
                <p className="text-sm text-slate-600">Aucun rapport archive pour le moment.</p>
              ) : (
                <Table headers={["Type", "Fichier", "Appel", "Date", "Action"]}>
                  {(archives.data || []).map((archive) => (
                    <tr key={archive.id}>
                      <td className="px-4 py-3 text-sm">{REPORT_TYPE_LABELS[archive.report_type]}</td>
                      <td className="px-4 py-3 text-sm">{archive.file_name}</td>
                      <td className="px-4 py-3 text-sm">{archive.tender_call_id ?? "Global"}</td>
                      <td className="px-4 py-3 text-sm">{new Date(archive.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          onClick={() => reportService.downloadArchive(archive.id, archive.file_name)}
                        >
                          Telecharger
                        </Button>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
            </StateBlock>
          </Card>
        </div>
      </StateBlock>
    </>
  );
}

function ReportBlock({
  title,
  description,
  loading,
  disabled,
  onClick,
  variant = "primary",
}: {
  title: string;
  description: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <Button className="mt-3" variant={variant === "secondary" ? "secondary" : undefined} disabled={disabled} onClick={onClick}>
        {loading ? "Generation..." : "Telecharger le PDF"}
      </Button>
    </div>
  );
}
