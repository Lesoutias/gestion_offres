import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function TenderCallDetailsPage() {
  const id = Number(useParams().id);
  const { data, loading, error, setData } = useAsyncData(
    () =>
      tenderCallService
        .getById(id)
        .catch(() =>
          tenderCallService
            .getAll()
            .then((items) => items.find((i) => i.id === id)!),
        ),
    [id],
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAction = async (
    action: () => Promise<any>,
    actionName: string,
  ) => {
    try {
      setActionError(null);
      const result = await action();
      setData(result);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail || err?.message || `${actionName} a échoué`;
      setActionError(errorMessage);
      console.error(actionName, err);
    }
  };

  return (
    <>
      <StateBlock loading={loading} error={error}>
        {data && (
          <>
            <PageTitle title={data.objet} description={data.reference} />
            <Card>
              {actionError && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}
              <div className="mb-4 flex flex-wrap gap-2">
                <TenderCallStatusBadge status={data.statut} />
              </div>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {data.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {data.statut === "draft" && (
                  <Button
                    onClick={() =>
                      handleAction(
                        () => tenderCallService.publish(data.id),
                        "Publication",
                      )
                    }
                  >
                    Publier
                  </Button>
                )}
                {data.statut === "published" && (
                  <Button
                    onClick={() =>
                      handleAction(
                        () => tenderCallService.close(data.id),
                        "Clôture",
                      )
                    }
                  >
                    Cloturer
                  </Button>
                )}
                {(data.statut === "published" || data.statut === "closed") && (
                  <Button
                    onClick={() =>
                      handleAction(
                        () => tenderCallService.startEvaluation(data.id),
                        "Mise en evaluation",
                      )
                    }
                  >
                    Mettre en phase d'evaluation
                  </Button>
                )}
                {data.statut === "evaluation" && (
                  <p className="w-full text-sm text-amber-700">
                    Cet appel est en phase d'evaluation. La commission peut evaluer les offres recues.
                  </p>
                )}
                <Link to={`/authority/tender-calls/${data.id}/dao`}>
                  <Button variant="secondary">DAO</Button>
                </Link>
                <Link to={`/authority/tender-calls/${data.id}/offers`}>
                  <Button variant="secondary">Offres</Button>
                </Link>
              </div>
            </Card>
          </>
        )}
      </StateBlock>
    </>
  );
}
