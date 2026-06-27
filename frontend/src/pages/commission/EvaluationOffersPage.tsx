import { Link, useNavigate, useParams } from "react-router-dom";
import { DocumentComplianceChecklist, OfferScoresSummary } from "../../components/evaluations/EvaluationSummary";
import { EvaluationForm } from "../../components/evaluations/EvaluationForm";
import { OfferCard } from "../../components/offers/OfferCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { daoDocumentService } from "../../services/daoDocumentService";
import { offerDocumentService } from "../../services/offerDocumentService";
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
  const dao = useAsyncData(
    () =>
      evaluatingSingle && singleOffer.data
        ? daoDocumentService.getByTender(singleOffer.data.tender_call_id).catch(() => null)
        : Promise.resolve(null),
    [evaluatingSingle, singleOffer.data?.tender_call_id],
  );
  const documents = useAsyncData(
    () => (evaluatingSingle ? offerDocumentService.getByOffer(parsedOfferId) : Promise.resolve([])),
    [parsedOfferId, evaluatingSingle],
  );

  return (
    <>
      <PageTitle
        title="Evaluation des offres"
        description={
          evaluatingSingle
            ? "Telechargez et verifiez chaque piece, puis saisissez l'avis et le rapport de la commission."
            : "Les entreprises doivent avoir soumis leurs offres avant le lancement de l'evaluation."
        }
      />
      {evaluatingSingle ? (
        <StateBlock loading={singleOffer.loading || documents.loading} error={singleOffer.error || documents.error}>
          {singleOffer.data && (
            <div className="grid gap-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <OfferCard offer={singleOffer.data} />
                <OfferScoresSummary offer={singleOffer.data} />
              </div>
              <DocumentComplianceChecklist
                requiredTypes={dao.data?.required_document_types ?? []}
                documents={documents.data ?? []}
              />
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
                Aucune offre recue pour cet appel d'offres.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {(offers.data || []).map((offer) => (
                <div key={offer.id}>
                  <OfferCard offer={offer} />
                  <p className="mt-2 text-sm text-slate-600">
                    Score total: {offer.score_total ?? "Non calcule"}
                  </p>
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
