import { useParams } from "react-router-dom";
import { DaoDocumentForm } from "../../components/dao/DaoDocumentForm";
import { DaoDocumentViewer } from "../../components/dao/DaoDocumentViewer";
import { Card } from "../../components/ui/Card";
import { daoDocumentService } from "../../services/daoDocumentService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function DaoDocumentPage() {
  const tenderCallId = Number(useParams().id);
  const { data, loading, error, setData } = useAsyncData(
    () => daoDocumentService.getByTender(tenderCallId).catch(() => null),
    [tenderCallId],
  );

  const save = async (payload: Parameters<typeof daoDocumentService.create>[0]) => {
    if (data) {
      setData(await daoDocumentService.update(data.id, payload));
      return;
    }
    setData(await daoDocumentService.create(payload));
  };

  return (
    <>
      <PageTitle title="Dossier DAO" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-6 lg:grid-cols-2">
          <DaoDocumentViewer dao={data} />
          <Card title={data ? "Modifier le DAO" : "Saisie du DAO"}>
            <DaoDocumentForm tenderCallId={tenderCallId} initial={data} onSubmit={save} />
          </Card>
        </div>
      </StateBlock>
    </>
  );
}
