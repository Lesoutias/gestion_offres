import { Link, useParams } from "react-router-dom";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function TenderCallDetailsPage() {
  const id = Number(useParams().id);
  const { data, loading, error, setData } = useAsyncData(() => tenderCallService.getById(id).catch(() => tenderCallService.getAll().then((items) => items.find((i) => i.id === id)!)), [id]);
  return (
    <>
      <StateBlock loading={loading} error={error}>
        {data && <>
          <PageTitle title={data.objet} description={data.reference} />
          <Card>
            <div className="mb-4 flex flex-wrap gap-2"><TenderCallStatusBadge status={data.statut} /></div>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{data.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {data.statut === "draft" && <Button onClick={async () => setData(await tenderCallService.publish(data.id))}>Publier</Button>}
              {data.statut === "published" && <Button onClick={async () => setData(await tenderCallService.close(data.id))}>Cloturer</Button>}
              {(data.statut === "published" || data.statut === "closed") && <Button onClick={async () => setData(await tenderCallService.startEvaluation(data.id))}>Lancer evaluation</Button>}
              <Link to={`/authority/tender-calls/${data.id}/dao`}><Button variant="secondary">DAO</Button></Link>
              <Link to={`/authority/tender-calls/${data.id}/offers`}><Button variant="secondary">Offres</Button></Link>
            </div>
          </Card>
        </>}
      </StateBlock>
    </>
  );
}
