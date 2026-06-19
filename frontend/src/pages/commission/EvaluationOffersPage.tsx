import { Link, useNavigate, useParams } from "react-router-dom";
import { EvaluationForm } from "../../components/evaluations/EvaluationForm";
import { OfferCard } from "../../components/offers/OfferCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { offerEvaluationService } from "../../services/offerEvaluationService";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function EvaluationOffersPage() {
  const navigate = useNavigate();
  const { tenderCallId, offerId } = useParams();
  const evaluatingSingle = Boolean(offerId);
  const parsedTenderCallId = Number(tenderCallId);
  const parsedOfferId = Number(offerId);
  const offers = useAsyncData(
    () => (evaluatingSingle ? Promise.resolve([]) : offerService.getByTender(parsedTenderCallId)),
    [parsedTenderCallId, evaluatingSingle],
  );
  const singleOffer = useAsyncData(
    () => (evaluatingSingle ? offerService.getById(parsedOfferId) : Promise.resolve(null)),
    [parsedOfferId, evaluatingSingle],
  );

  return (
    <>
      <PageTitle
        title="Evaluation des offres"
        description={
          evaluatingSingle
            ? "Saisissez les notes et le rapport de conformite pour cette offre."
            : "Les entreprises doivent avoir soumis leurs offres avant le lancement de l'evaluation."
        }
      />
      {evaluatingSingle ? (
        <StateBlock loading={singleOffer.loading} error={singleOffer.error}>
          {singleOffer.data && (
            <div className="grid gap-6 lg:grid-cols-2">
              <OfferCard offer={singleOffer.data} />
              <Card title="Rapport d'evaluation">
                <EvaluationForm
                  offerId={singleOffer.data.id}
                  onSubmit={async (payload) => {
                    await offerEvaluationService.create(payload);
                    setTimeout(() => {
                      navigate(`/commission/tender-calls/${singleOffer.data!.tender_call_id}/offers`);
                    }, 1500);
                  }}
                />
              </Card>
            </div>
          )}
        </StateBlock>
      ) : (
        <StateBlock loading={offers.loading} error={offers.error}>
          {(offers.data || []).length === 0 ? (
            <Card>
              <p className="text-sm text-slate-700">
                Aucune offre recue pour cet appel d'offres. Avant de lancer l'evaluation, une ou plusieurs
                entreprises doivent soumettre leur offre tant que l'appel est publie et que la date limite
                n'est pas depassee.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Workflow : publier l'appel → entreprises soumettent leurs offres → l'autorite lance
                l'evaluation → la commission evalue chaque offre recue.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {(offers.data || []).map((offer) => (
                <div key={offer.id}>
                  <OfferCard offer={offer} />
                  <Link to={`/commission/offers/${offer.id}/evaluate`}>
                    <Button className="mt-2">Evaluer et rediger le rapport</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </StateBlock>
      )}
    </>
  );
}
