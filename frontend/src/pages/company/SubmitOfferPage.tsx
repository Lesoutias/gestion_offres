import { useNavigate, useParams } from "react-router-dom";
import { CompanyRequiredBlock } from "../../components/companies/CompanyRequiredBlock";
import { OfferForm } from "../../components/offers/OfferForm";
import { Card } from "../../components/ui/Card";
import { offerService } from "../../services/offerService";
import { PageTitle } from "../PageHelpers";

export default function SubmitOfferPage() {
  const tenderCallId = Number(useParams().id);
  const navigate = useNavigate();

  return (
    <>
      <PageTitle title="Soumettre une offre" />
      <CompanyRequiredBlock>
        {(company) => (
          <Card>
            <OfferForm
              tenderCallId={tenderCallId}
              companyId={company.id}
              onSubmit={async (payload) => {
                await offerService.submit(payload);
                navigate("/company/offers");
              }}
            />
          </Card>
        )}
      </CompanyRequiredBlock>
    </>
  );
}
