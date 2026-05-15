import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { applyToOffer } from "../features/applications/applicationSlice";
import { fetchJobOffer } from "../features/jobOffers/jobOfferSlice";
import { Button, Card, Layout } from "../components";

function JobOfferDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOffer, status, error } = useAppSelector(
    (state) => state.jobOffers,
  );
  const auth = useAppSelector((state) => state.auth);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobOffer(Number(id)));
    }
  }, [dispatch, id]);

  const handleApply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApplyMessage(null);
    setApplyError(null);

    if (!currentOffer) {
      setApplyError("Offre introuvable.");
      return;
    }

    try {
      await dispatch(
        applyToOffer({
          job_offer_id: currentOffer.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
        }),
      ).unwrap();
      setApplyMessage("Candidature envoyée avec succès.");
      setCoverLetter("");
      setResumeUrl("");
    } catch (err: any) {
      setApplyError(err || "Impossible d'envoyer la candidature.");
    }
  };

  return (
    <Layout title="Détails de l'offre">
      {status === "loading" && <p>Chargement de l'offre...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {currentOffer ? (
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {currentOffer.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentOffer.location || "Lieu non précisé"}
                </p>
              </div>
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line">
                {currentOffer.description}
              </p>
            </div>
          </Card>

          {auth.user?.role_name === "candidate" ? (
            <Card>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Postuler à cette offre
              </h3>
              <form className="space-y-4" onSubmit={handleApply}>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="coverLetter"
                  >
                    Lettre de motivation
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(event) => setCoverLetter(event.target.value)}
                    className="mt-2 min-h-[120px] w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                    htmlFor="resumeUrl"
                  >
                    URL du CV
                  </label>
                  <input
                    id="resumeUrl"
                    type="url"
                    value={resumeUrl}
                    onChange={(event) => setResumeUrl(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                {applyError ? (
                  <p className="text-sm text-red-600">{applyError}</p>
                ) : null}
                {applyMessage ? (
                  <p className="text-sm text-green-600">{applyMessage}</p>
                ) : null}
                <Button type="submit">Postuler</Button>
              </form>
            </Card>
          ) : (
            <Card>
              <p className="text-slate-700 dark:text-slate-200">
                Vous devez être candidat pour postuler à cette offre.
              </p>
            </Card>
          )}
        </div>
      ) : null}
    </Layout>
  );
}

export default JobOfferDetailPage;
