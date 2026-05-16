import { PublicContractCard } from "../../components/contracts/PublicContractCard";
import { publicContractService } from "../../services/publicContractService";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function PublicContractsPage() {
  const { data, loading, error } = useAsyncData(() => publicContractService.getAll(), []);
  return (
    <>
      <PageTitle title="Marches publics" />
      <StateBlock loading={loading} error={error}>
        <div className="grid gap-4">{(data || []).map((contract) => <PublicContractCard key={contract.id} contract={contract} />)}</div>
      </StateBlock>
    </>
  );
}
