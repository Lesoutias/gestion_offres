import { useNavigate } from "react-router-dom";
import { TenderCallForm } from "../../components/tenderCalls/TenderCallForm";
import { Card } from "../../components/ui/Card";
import { tenderCallService } from "../../services/tenderCallService";
import { PageTitle } from "../PageHelpers";

export default function CreateTenderCallPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageTitle title="Creer un appel d'offres" />
      <Card><TenderCallForm onSubmit={async (payload) => { await tenderCallService.create(payload); navigate("/authority/tender-calls"); }} /></Card>
    </>
  );
}
