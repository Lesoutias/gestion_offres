import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchRecruiterApplications,
  reviewApplication,
  type Application,
} from "../features/applications/applicationSlice";
import type { ApplicationStatus } from "../types";
import { Card, Layout } from "../components";

function RecruiterApplicationsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(
    (state) => state.applications,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchRecruiterApplications());
  }, [dispatch]);

  const handleReview = async (
    applicationId: number,
    status: ApplicationStatus,
  ) => {
    setMessage(null);
    setActionError(null);

    try {
      await dispatch(reviewApplication({ applicationId, status })).unwrap();
      setMessage(`Candidature ${status} avec succès.`);
    } catch (err: any) {
      setActionError(err || "Impossible de mettre à jour la candidature.");
    }
  };

  return (
    <Layout title="Candidatures recruteur">
      {status === "loading" && <p>Chargement des candidatures...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {message ? <p className="text-sm text-green-600">{message}</p> : null}
        {actionError ? (
          <p className="text-sm text-red-600">{actionError}</p>
        ) : null}

        {items.map((application: Application) => (
          <Card key={application.id}>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Demande #{application.id}
                </p>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Statut : {application.status}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Offre :{" "}
                  {application.job_offer_title ||
                    `#${application.job_offer_id}`}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  Candidat :{" "}
                  {application.candidate_full_name ||
                    application.candidate_email ||
                    application.candidate_id}
                </p>
              </div>

              <div className="space-y-2 text-slate-700 dark:text-slate-200">
                <p>Lettre : {application.cover_letter || "Aucune"}</p>
                <p>CV : {application.resume_url || "Non fourni"}</p>
              </div>

              {application.status === "pending" ? (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                    onClick={() => handleReview(application.id, "accepted")}
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500"
                    onClick={() => handleReview(application.id, "rejected")}
                  >
                    Refuser
                  </button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export default RecruiterApplicationsPage;
