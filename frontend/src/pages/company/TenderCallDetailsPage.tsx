import { Link, useParams } from "react-router-dom";
import { DaoDocumentViewer } from "../../components/dao/DaoDocumentViewer";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { daoDocumentService } from "../../services/daoDocumentService";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function CompanyTenderCallDetailsPage() {
  const id = Number(useParams().id);
  const tender = useAsyncData(() => tenderCallService.getById(id), [id]);
  const dao = useAsyncData(() => daoDocumentService.getByTender(id), [id]);
  return (
    <>
      <StateBlock loading={tender.loading} error={tender.error}>
        {tender.data && <><PageTitle title={tender.data.objet} description={tender.data.reference} /><Card><TenderCallStatusBadge status={tender.data.statut} /><p className="mt-4 text-sm text-slate-700">{tender.data.description}</p>{tender.data.statut === "published" && <Link className="mt-5 inline-block" to={`/company/tender-calls/${id}/submit-offer`}><Button>Soumettre une offre</Button></Link>}</Card></>}
      </StateBlock>
      <div className="mt-6"><DaoDocumentViewer dao={dao.data} /></div>
    </>
  );
}
