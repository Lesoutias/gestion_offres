import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OfferCard } from "../../components/offers/OfferCard";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { offerService } from "../../services/offerService";
import { tenderCallService } from "../../services/tenderCallService";
import type { TenderCall } from "../../types";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

function loadTenderCall(id: number): Promise<TenderCall> {
  return tenderCallService.getById(id).catch(() =>
    tenderCallService.getAll().then((items) => {
      const tender = items.find((item) => item.id === id);
      if (!tender) throw new Error("Appel d'offres introuvable");
      return tender;
    }),
  );
}

export default function TenderOffersPage() {
  const tenderCallId = Number(useParams().id);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const tender = useAsyncData(() => loadTenderCall(tenderCallId), [tenderCallId]);
  const offers = useAsyncData(() => offerService.getByTender(tenderCallId), [tenderCallId]);

  const status = tender.data?.statut;
  const canPublish = status === "draft";
  const canClose = status === "published";
  const canStartEvaluation = status === "published" || status === "closed";
  const isInEvaluation = status === "evaluation";

  const runAction = async (action: () => Promise<TenderCall>, label: string) => {
    try {
      setActionError(null);
      setActionLoading(true);
      const updated = await action();
      tender.setData(updated);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        `${label} impossible`;
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartEvaluation = async () => {
    const confirmed = window.confirm(
      "Lancer la phase d'evaluation ? La commission pourra evaluer les offres recues.",
    );
    if (!confirmed) return;
    await runAction(() => tenderCallService.startEvaluation(tenderCallId), "Lancement de l'evaluation");
  };

  return (
    <>
      <PageTitle title="Offres soumises" />
      <StateBlock loading={tender.loading || offers.loading} error={tender.error || offers.error}>
        {tender.data && (
          <Card className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <TenderCallStatusBadge status={tender.data.statut} />
              <span className="text-sm text-slate-600">{tender.data.reference}</span>
            </div>

            {canPublish && (
              <p className="mt-3 text-sm text-slate-600">
                Publiez l'appel d'offres avant de lancer l'evaluation.
              </p>
            )}

            {actionError && <p className="mt-3 text-sm text-red-700">{actionError}</p>}

            <div className="mt-4 flex flex-wrap gap-3">
              {canPublish && (
                <Button
                  disabled={actionLoading}
                  onClick={() => runAction(() => tenderCallService.publish(tenderCallId), "Publication")}
                >
                  Publier
                </Button>
              )}
              {canClose && (
                <Button
                  variant="secondary"
                  disabled={actionLoading}
                  onClick={() => runAction(() => tenderCallService.close(tenderCallId), "Cloture")}
                >
                  Cloturer
                </Button>
              )}
              {canStartEvaluation && (
                <Button disabled={actionLoading} onClick={handleStartEvaluation}>
                  {actionLoading ? "Lancement..." : "Lancer Evaluation"}
                </Button>
              )}
              {isInEvaluation && (
                <p className="text-sm text-amber-700">
                  Phase d'evaluation en cours. La commission peut evaluer les offres.
                </p>
              )}
              {status === "awarded" && (
                <p className="text-sm text-slate-600">Cet appel d'offres a deja ete attribue.</p>
              )}
              <Link to={`/authority/tender-calls/${tenderCallId}/evaluation`}>
                <Button variant="secondary">Voir les evaluations</Button>
              </Link>
              <Link to={`/authority/tender-calls/${tenderCallId}`}>
                <Button variant="ghost">Retour au detail</Button>
              </Link>
            </div>
          </Card>
        )}
        <div className="grid gap-4">
          {(offers.data || []).map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </StateBlock>
    </>
  );
}
