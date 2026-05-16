import { Link, useParams } from "react-router-dom";
import { OfferCard } from "../../components/offers/OfferCard";
import { Button } from "../../components/ui/Button";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function TenderOffersPage() {
  const tenderCallId = Number(useParams().id);
  const { data, loading, error } = useAsyncData(() => offerService.getByTender(tenderCallId), [tenderCallId]);
  return (
    <>
      <PageTitle title="Offres soumises" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">{(data || []).map((offer) => <div key={offer.id}><OfferCard offer={offer} /><Link to={`/commission/offers/${offer.id}/evaluate`}><Button className="mt-2">Evaluer</Button></Link></div>)}</div>
      </StateBlock>
    </>
  );
}
