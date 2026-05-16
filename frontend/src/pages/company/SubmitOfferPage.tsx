import { useNavigate, useParams } from "react-router-dom";
import { OfferForm } from "../../components/offers/OfferForm";
import { Card } from "../../components/ui/Card";
import { companyService } from "../../services/companyService";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function SubmitOfferPage() {
  const tenderCallId = Number(useParams().id);
  const navigate = useNavigate();
  const company = useAsyncData(() => companyService.getMine(), []);
  return (
    <>
      <PageTitle title="Soumettre une offre" />
      <StateBlock loading={company.loading} error={company.error}>
        {company.data && <Card><OfferForm tenderCallId={tenderCallId} companyId={company.data.id} onSubmit={async (payload) => { await offerService.submit(payload); navigate("/company/offers"); }} /></Card>}
      </StateBlock>
    </>
  );
}
