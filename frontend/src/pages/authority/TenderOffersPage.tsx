import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OfferCard } from "../../components/offers/OfferCard";
import { TenderCallStatusBadge } from "../../components/tenderCalls/TenderCallStatusBadge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { offerService } from "../../services/offerService";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function TenderOffersPage() {
  const tenderCallId = Number(useParams().id);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const tender = useAsyncData(() => tenderCallService.getById(tenderCallId), [tenderCallId]);
  const offers = useAsyncData(() => offerService.getByTender(tenderCallId), [tenderCallId]);

  const canStartEvaluation =
    tender.data?.statut === "published" || tender.data?.statut === "closed";
  const isInEvaluation = tender.data?.statut === "evaluation";

  const handleStartEvaluation = async () => {
    const confirmed = window.confirm(
      "Lancer la phase d'evaluation ? La commission pourra evaluer les offres recues.",
    );
    if (!confirmed) return;

    try {
      setActionError(null);
      setActionLoading(true);
      const updated = await tenderCallService.startEvaluation(tenderCallId);
      tender.setData(updated);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Impossible de lancer l'evaluation";
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
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
            {actionError && <p className="mt-3 text-sm text-red-700">{actionError}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              {canStartEvaluation && (
                <Button onClick={handleStartEvaluation} disabled={actionLoading}>
                  {actionLoading ? "Lancement..." : "Lancer Evaluation"}
                </Button>
              )}
              {isInEvaluation && (
                <p className="text-sm text-amber-700">
                  Phase d'evaluation en cours. La commission peut evaluer les offres.
                </p>
              )}
              <Link to={`/authority/tender-calls/${tenderCallId}/evaluation`}>
                <Button variant="secondary">Voir les evaluations</Button>
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
