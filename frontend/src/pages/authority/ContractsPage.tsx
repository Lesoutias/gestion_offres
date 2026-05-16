import { useEffect, useMemo, useState } from "react";
import { ContractCard } from "../../components/contracts/ContractCard";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { companyService } from "../../services/companyService";
import { contractService } from "../../services/contractService";
import { offerService } from "../../services/offerService";
import { publicContractService } from "../../services/publicContractService";
import type { Company, Contract, Offer, PublicContract } from "../../types";
import { PageTitle, StateBlock } from "../PageHelpers";

function contractStatusLabel(status: Contract["statut"]) {
  switch (status) {
    case "draft":
      return "Brouillon";
    case "pending":
      return "Envoye a l'entreprise";
    case "signed":
      return "Signe par l'entreprise";
    case "rejected":
      return "Refuse par l'entreprise";
    case "cancelled":
      return "Annule";
    default:
      return status;
  }
}

function offerStatusLabel(status: Offer["statut"]) {
  switch (status) {
    case "submitted":
      return "Soumise";
    case "under_review":
      return "En analyse";
    case "accepted":
      return "Acceptee";
    case "awarded":
      return "Retenue";
    case "rejected":
      return "Rejetee";
    default:
      return status;
  }
}

export default function ContractsPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [publicContracts, setPublicContracts] = useState<PublicContract[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [busyOfferId, setBusyOfferId] = useState<number | null>(null);

  const companyById = useMemo(
    () => new Map(companies.map((company) => [company.id, company])),
    [companies],
  );
  const publicContractByOfferId = useMemo(
    () => new Map(publicContracts.map((publicContract) => [publicContract.offer_id, publicContract])),
    [publicContracts],
  );
  const publicContractByTenderCallId = useMemo(
    () => new Map(publicContracts.map((publicContract) => [publicContract.tender_call_id, publicContract])),
    [publicContracts],
  );
  const contractByPublicContractId = useMemo(
    () => new Map(contracts.map((contract) => [contract.public_contract_id, contract])),
    [contracts],
  );

  const loadData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const [loadedOffers, loadedCompanies, loadedPublicContracts] = await Promise.all([
        offerService.getAll(),
        companyService.getAll(),
        publicContractService.getAll(),
      ]);
      const loadedContracts = await Promise.all(
        loadedPublicContracts
          .filter((publicContract) => publicContract.statut !== "cancelled")
          .map((publicContract) =>
            contractService.getByPublicContract(publicContract.id).catch(() => null),
          ),
      );
      setOffers(loadedOffers);
      setCompanies(loadedCompanies);
      setPublicContracts(loadedPublicContracts);
      setContracts(loadedContracts.filter((contract): contract is Contract => contract !== null));
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleOffers = offers.filter((offer) => offer.statut !== "rejected");

  const createAndSendContract = async (offer: Offer) => {
    setBusyOfferId(offer.id);
    setActionError(null);
    setActionSuccess(null);
    try {
      let publicContract = publicContractByOfferId.get(offer.id);
      if (!publicContract) {
        publicContract = await offerService.award(offer.id);
        setPublicContracts((current) => [publicContract as PublicContract, ...current]);
      }

      let contract = contractByPublicContractId.get(publicContract.id);
      if (!contract) {
        const reference = `CONT-${publicContract.id}-${Date.now()}`;
        contract = await contractService.create({
          public_contract_id: publicContract.id,
          reference,
          garanties: "Garanties contractuelles a completer par l'autorite contractante.",
          obligations: "Executer le marche conformement aux clauses techniques et au calendrier valide.",
        });
        setContracts((current) => [contract as Contract, ...current]);
      }

      if (contract.statut === "draft") {
        const sent = await contractService.send(contract.id);
        setContracts((current) => current.map((item) => (item.id === sent.id ? sent : item)));
      }
      setActionSuccess("Contrat envoye a l'entreprise retenue.");
      await loadData();
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Envoi du contrat impossible");
    } finally {
      setBusyOfferId(null);
    }
  };

  const handleUpdateContract = async (contract: Contract) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const updated = await contractService.update(contract.id, {
        garanties: contract.garanties || undefined,
        obligations: contract.obligations || undefined,
      });
      setContracts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setActionSuccess("Contrat mis a jour.");
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Mise a jour impossible");
      throw err;
    }
  };

  const handleSendContract = async (contract: Contract) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      const sent = await contractService.send(contract.id);
      setContracts((current) => current.map((item) => (item.id === sent.id ? sent : item)));
      setActionSuccess("Contrat envoye a l'entreprise. En attente de reponse.");
    } catch (err: any) {
      setActionError(err?.response?.data?.detail || err?.message || "Envoi impossible");
      throw err;
    }
  };

  return (
    <>
      <PageTitle
        title="Gestion des contrats"
        description="Selectionner l'entreprise retenue, envoyer le contrat et suivre sa reponse."
      />
      <StateBlock loading={loading} error={actionError && contracts.length === 0 && offers.length === 0 ? actionError : null}>
        <div className="space-y-6">
          {actionError && (contracts.length > 0 || offers.length > 0) && (
            <Card>
              <p className="text-sm text-red-700">{actionError}</p>
            </Card>
          )}
          {actionSuccess && (
            <Card>
              <p className="text-sm text-emerald-700">{actionSuccess}</p>
            </Card>
          )}

          <Card title="Offres eligibles au contrat">
            <Table headers={["Offre", "Entreprise", "Montant", "Statut offre", "Contrat", "Action"]}>
              {visibleOffers.map((offer) => {
                const company = companyById.get(offer.company_id);
                const publicContract = publicContractByOfferId.get(offer.id);
                const tenderPublicContract = publicContractByTenderCallId.get(offer.tender_call_id);
                const tenderAlreadyAwardedToAnotherOffer = tenderPublicContract && tenderPublicContract.offer_id !== offer.id;
                const contract = publicContract ? contractByPublicContractId.get(publicContract.id) : null;
                return (
                  <tr key={offer.id}>
                    <td className="px-4 py-3">#{offer.id}</td>
                    <td className="px-4 py-3">{company?.name || `Entreprise #${offer.company_id}`}</td>
                    <td className="px-4 py-3">{offer.montant.toLocaleString()} USD</td>
                    <td className="px-4 py-3">{offerStatusLabel(offer.statut)}</td>
                    <td className="px-4 py-3">
                      {tenderAlreadyAwardedToAnotherOffer
                        ? `Marche deja attribue a l'offre #${tenderPublicContract.offer_id}`
                        : contract
                          ? contractStatusLabel(contract.statut)
                          : "Aucun contrat envoye"}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        onClick={() => createAndSendContract(offer)}
                        disabled={
                          busyOfferId === offer.id ||
                          Boolean(tenderAlreadyAwardedToAnotherOffer) ||
                          contract?.statut === "pending" ||
                          contract?.statut === "signed" ||
                          contract?.statut === "rejected"
                        }
                      >
                        {busyOfferId === offer.id
                          ? "Envoi..."
                          : contract?.statut === "draft"
                            ? "Envoyer le brouillon"
                            : contract
                              ? "Contrat deja traite"
                              : "Retenir et envoyer"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </Table>
            {visibleOffers.length === 0 && (
              <p className="mt-4 text-sm text-slate-600">Aucune offre recue pour le moment.</p>
            )}
          </Card>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-950">Contrats envoyes ({contracts.length})</h2>
            {contracts.length === 0 ? (
              <Card>
                <p className="text-sm text-slate-600">Aucun contrat cree pour le moment.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {contracts
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .map((contract) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      onUpdate={handleUpdateContract}
                      onSign={handleSendContract}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </StateBlock>
    </>
  );
}
