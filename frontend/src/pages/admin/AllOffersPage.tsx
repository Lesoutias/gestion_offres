import { OfferCard } from "../../components/offers/OfferCard";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function AllOffersPage() {
  const { data, loading, error } = useAsyncData(() => offerService.getAll(), []);
  return (
    <>
      <PageTitle title="Toutes les offres" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">{(data || []).map((offer) => <OfferCard key={offer.id} offer={offer} />)}</div>
      </StateBlock>
    </>
  );
}
