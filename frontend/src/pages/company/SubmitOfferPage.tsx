import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyRequiredBlock } from "../../components/companies/CompanyRequiredBlock";
import { DaoDocumentViewer } from "../../components/dao/DaoDocumentViewer";
import { OfferForm } from "../../components/offers/OfferForm";
import { hasAllRequiredFiles, RequiredDocumentsUpload } from "../../components/offers/RequiredDocumentsUpload";
import { Card } from "../../components/ui/Card";
import { daoDocumentService } from "../../services/daoDocumentService";
import { offerDocumentService } from "../../services/offerDocumentService";
import { offerService } from "../../services/offerService";
import type { OfferCreate, OfferDocumentType } from "../../types";
import { PageTitle, StateBlock, useAsyncData } from "../PageHelpers";

export default function SubmitOfferPage() {
  const tenderCallId = Number(useParams().id);
  const navigate = useNavigate();
  const dao = useAsyncData(
    () => daoDocumentService.getByTender(tenderCallId).catch(() => null),
    [tenderCallId],
  );
  const [files, setFiles] = useState<Partial<Record<OfferDocumentType, File>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const requiredTypes = useMemo(
    () => dao.data?.required_document_types ?? [],
    [dao.data],
  );

  const handleSubmit = async (payload: OfferCreate) => {
    if (!dao.data || requiredTypes.length === 0) {
      setError("Cet appel d'offres ne dispose pas d'un DAO avec des documents obligatoires.");
      return;
    }
    if (!hasAllRequiredFiles(requiredTypes, files)) {
      setError("Veuillez fournir tous les documents obligatoires du DAO.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      setProgress("Creation de l'offre...");
      const offer = await offerService.submit(payload);
      for (const [index, type] of requiredTypes.entries()) {
        const file = files[type];
        if (file) {
          setProgress(`Envoi du document ${index + 1}/${requiredTypes.length}...`);
          await offerDocumentService.upload(offer.id, type, file);
        }
      }
      setProgress("Verification finale des documents...");
      await offerService.validateDocuments(offer.id);
      navigate("/company/offers");
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Soumission impossible");
    } finally {
      setSubmitting(false);
      setProgress(null);
    }
  };

  return (
    <>
      <PageTitle title="Soumettre une offre" />
      <StateBlock loading={dao.loading} error={dao.error}>
        <div className="grid gap-6">
          <DaoDocumentViewer dao={dao.data} />
          <CompanyRequiredBlock>
            {(company) => (
              <Card title="Votre offre">
                <div className="grid gap-6">
                  <OfferForm
                    tenderCallId={tenderCallId}
                    companyId={company.id}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                  >
                    <RequiredDocumentsUpload
                      requiredTypes={requiredTypes}
                      files={files}
                      onChange={setFiles}
                    />
                    {progress && <p className="text-sm font-medium text-emerald-700">{progress}</p>}
                  </OfferForm>
                  {error && <p className="text-sm text-red-700">{error}</p>}
                </div>
              </Card>
            )}
          </CompanyRequiredBlock>
        </div>
      </StateBlock>
    </>
  );
}
