import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublishedTenderCallDetailsPage() {
  const id = Number(useParams().id);
  const { data, loading, error } = useAsyncData(() => tenderCallService.getById(id), [id]);
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <StateBlock loading={loading} error={error}>
        {data && (
          <>
            <PageTitle title={data.objet} description={`Reference ${data.reference}`} />
            <Card>
              <div className="mb-4"><TenderCallStatusBadge status={data.statut} /></div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{data.description || "Aucune description."}</p>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="font-semibold">Date limite</dt><dd>{new Date(data.date_limite).toLocaleString()}</dd></div>
                <div><dt className="font-semibold">Lieu</dt><dd>{data.lieu_execution || "-"}</dd></div>
                <div><dt className="font-semibold">Type</dt><dd>{data.type_marche || "-"}</dd></div>
                <div><dt className="font-semibold">Budget</dt><dd>{data.budget_previsionnel?.toLocaleString() || "-"}</dd></div>
              </dl>
              <Link to="/login" className="mt-6 inline-block"><Button>Se connecter pour soumettre une offre</Button></Link>
            </Card>
          </>
        )}
      </StateBlock>
    </main>
  );
}
