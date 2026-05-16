import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { offerService } from "../../services/offerService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function AwardMarketPage() {
  const tenderCallId = Number(useParams().id);
  const { data, loading, error } = useAsyncData(() => offerService.getByTender(tenderCallId), [tenderCallId]);
  return (
    <>
      <PageTitle title="Attribuer le marche" />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Offre", "Montant", "Score", "Statut", "Action"]}>
          {(data || []).map((offer) => <tr key={offer.id}><td className="px-4 py-3">#{offer.id}</td><td className="px-4 py-3">{offer.montant}</td><td className="px-4 py-3">{offer.score_total || "-"}</td><td className="px-4 py-3">{offer.statut}</td><td className="px-4 py-3"><Button onClick={() => offerService.award(offer.id)}>Attribuer</Button></td></tr>)}
        </Table>
      </StateBlock>
    </>
  );
}
