import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchAdminJobOffers } from "../features/jobOffers/jobOfferSlice";
import AdminLayout from "../components/AdminLayout";
import { Card } from "../components";

function AdminCandidatesPage() {
  const dispatch = useAppDispatch();
  const { adminItems, status, error } = useAppSelector((state) => state.jobOffers);

  useEffect(() => {
    dispatch(fetchAdminJobOffers());
  }, [dispatch]);

  return (
    <AdminLayout title="Candidats" active="candidates">
      <div className="space-y-6">
        <Card>
          <div className="space-y-2 text-slate-700 dark:text-slate-200">
            <p className="text-lg font-semibold">Candidats postulent par offre</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Retrouvez tous les candidats, leurs dossiers et le détail par offre.
            </p>
          </div>
        </Card>

        {status === "loading" && <p>Chargement des candidats...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-6">
          {adminItems.map((offer) => (
            <Card key={offer.id}>
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Offre #{offer.id}</p>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {offer.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Recruteur : {offer.recruiter_full_name || offer.recruiter_email || "N/A"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {offer.is_rejected
                      ? "Refusée"
                      : offer.is_published
                      ? "Publié"
                      : "En attente"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <p className="text-sm font-semibold">Description</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {offer.description}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <p className="text-sm font-semibold">Localisation</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {offer.location || "Non précisée"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Candidats</h3>
                  {offer.applications && offer.applications.length > 0 ? (
                    <div className="space-y-3">
                      {offer.applications.map((application) => (
                        <div
                          key={application.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {application.candidate_full_name || application.candidate_email}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Statut : {application.status}
                              </p>
                            </div>
                            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                              <p>Demande #{application.id}</p>
                              <p>{new Date(application.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2 text-slate-700 dark:text-slate-200">
                            <p className="text-sm">
                              <span className="font-semibold">Lettre :</span> {application.cover_letter || "Aucune lettre"}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">CV :</span> {application.resume_url ? (
                                <a href={application.resume_url} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-800 dark:text-sky-400">
                                  Voir dossier
                                </a>
                              ) : (
                                "Non fourni"
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300">Aucun candidat pour cette offre.</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCandidatesPage;
