import { useParams } from "react-router-dom";
import { EvaluationForm } from "../../components/evaluations/EvaluationForm";
import { OfferCard } from "../../components/offers/OfferCard";
import { Card } from "../../components/ui/Card";
import { offerEvaluationService } from "../../services/offerEvaluationService";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function EvaluationOffersPage() {
  const tenderCallId = Number(useParams().id);
  const offerId = Number(useParams().id);
  const evaluatingSingle = window.location.pathname.includes("/commission/offers/");
  const offers = useAsyncData(() => evaluatingSingle ? Promise.resolve([]) : offerService.getByTender(tenderCallId), [tenderCallId, evaluatingSingle]);
  const singleOffer = useAsyncData(() => evaluatingSingle ? offerService.getById(offerId) : Promise.resolve(null), [offerId, evaluatingSingle]);
  return (
    <>
      <PageTitle title="Evaluation des offres" />
      {evaluatingSingle ? (
        <StateBlock loading={singleOffer.loading} error={singleOffer.error}>
          {singleOffer.data && <div className="grid gap-6 lg:grid-cols-2"><OfferCard offer={singleOffer.data} /><Card title="Notation"><EvaluationForm offerId={singleOffer.data.id} onSubmit={async (payload) => { await offerEvaluationService.create(payload); }} /></Card></div>}
        </StateBlock>
      ) : (
        <StateBlock loading={offers.loading} error={offers.error}>
          <div className="grid gap-4">{(offers.data || []).map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div>
        </StateBlock>
      )}
    </>
  );
}
