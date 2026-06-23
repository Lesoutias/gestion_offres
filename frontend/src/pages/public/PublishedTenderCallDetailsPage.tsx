import { Link, useParams } from "react-router-dom";
import { DaoDocumentViewer } from "../../components/dao/DaoDocumentViewer";
import { PublicShell } from "../../components/layout/PublicShell";
import { SubmitOfferPrompt } from "../../components/offers/SubmitOfferPrompt";
import { Card } from "../../components/ui/Card";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { daoDocumentService } from "../../services/daoDocumentService";
import { tenderCallService } from "../../services/tenderCallService";
import { formatAmount } from "../../utils/formatCurrency";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublishedTenderCallDetailsPage() {
  const id = Number(useParams().id);
  const tender = useAsyncData(() => tenderCallService.getById(id), [id]);
  const dao = useAsyncData(
    () => daoDocumentService.getByTender(id).catch(() => null),
    [id],
  );

  return (
    <PublicShell>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <StateBlock loading={tender.loading} error={tender.error}>
          {tender.data && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 text-slate-900">
                <PageTitle title={tender.data.objet} description={`Reference ${tender.data.reference}`} />
                <Card>
                  <div className="mb-4"><TenderCallStatusBadge status={tender.data.statut} /></div>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{tender.data.description || "Aucune description."}</p>
                  <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="font-semibold">Date limite</dt><dd>{new Date(tender.data.date_limite).toLocaleString()}</dd></div>
                    <div><dt className="font-semibold">Lieu</dt><dd>{tender.data.lieu_execution || "-"}</dd></div>
                    <div><dt className="font-semibold">Type</dt><dd>{tender.data.type_marche || "-"}</dd></div>
                    <div><dt className="font-semibold">Budget</dt><dd>{tender.data.budget_previsionnel != null ? formatAmount(tender.data.budget_previsionnel, tender.data.budget_devise) : "-"}</dd></div>
                  </dl>
                  <div className="mt-6">
                    <SubmitOfferPrompt tender={tender.data} />
                  </div>
                </Card>
                <Link to="/tender-calls" className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  Retour aux appels publies
                </Link>
              </div>
              <DaoDocumentViewer dao={dao.data} />
            </div>
          )}
        </StateBlock>
      </main>
    </PublicShell>
  );
}
