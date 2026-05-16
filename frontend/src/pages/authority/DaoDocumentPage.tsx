import { useParams } from "react-router-dom";
import { DaoDocumentForm } from "../../components/dao/DaoDocumentForm";
import { DaoDocumentViewer } from "../../components/dao/DaoDocumentViewer";
import { Card } from "../../components/ui/Card";
import { daoDocumentService } from "../../services/daoDocumentService";
import { PageTitle, useAsyncData } from "../PageHelpers";

export default function DaoDocumentPage() {
  const tenderCallId = Number(useParams().id);
  const { data, setData } = useAsyncData(() => daoDocumentService.getByTender(tenderCallId), [tenderCallId]);
  return (
    <>
      <PageTitle title="Dossier DAO" />
      <div className="grid gap-6 lg:grid-cols-2">
        <DaoDocumentViewer dao={data} />
        <Card title="Saisie du DAO"><DaoDocumentForm tenderCallId={tenderCallId} onSubmit={async (payload) => setData(await daoDocumentService.create(payload))} /></Card>
      </div>
    </>
  );
}
