import { useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Table } from "../../components/ui/Table";
import { offerService } from "../../services/offerService";
import { formatAmount } from "../../utils/formatCurrency";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function AwardMarketPage() {
  const tenderCallId = Number(useParams().id);
  const { data, loading, error } = useAsyncData(() => offerService.getByTender(tenderCallId), [tenderCallId]);
  return (
    <>
      <PageTitle title="Attribuer le marche" description="Classement pondere : technique 40 %, financier 40 %, commission 20 %." />
      <StateBlock loading={loading} error={error}>
        <Table headers={["Offre", "Montant", "Score tech.", "Score fin.", "Commission", "Total", "Statut", "Action"]}>
          {(data || []).map((offer) => (
            <tr key={offer.id}>
              <td className="px-4 py-3">#{offer.id}</td>
              <td className="px-4 py-3">{formatAmount(offer.montant, offer.devise)}</td>
              <td className="px-4 py-3">{offer.score_technique ?? "-"}</td>
              <td className="px-4 py-3">{offer.score_financier ?? "-"}</td>
              <td className="px-4 py-3">{offer.score_commission ?? "En attente"}</td>
              <td className="px-4 py-3 font-semibold">{offer.score_total ?? "-"}</td>
              <td className="px-4 py-3">{offer.statut}</td>
              <td className="px-4 py-3">
                <Button onClick={() => offerService.award(offer.id)}>Attribuer</Button>
              </td>
            </tr>
          ))}
        </Table>
      </StateBlock>
    </>
  );
}
