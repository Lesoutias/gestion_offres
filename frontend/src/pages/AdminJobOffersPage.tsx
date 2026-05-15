import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchAdminJobOffers,
  publishJobOffer,
} from "../features/jobOffers/jobOfferSlice";
import { Button, Card, Layout } from "../components";

function AdminJobOffersPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { adminItems, status, error } = useAppSelector(
    (state) => state.jobOffers,
  );

  useEffect(() => {
    if (auth.user?.role_name === "admin") {
      dispatch(fetchAdminJobOffers());
    }
  }, [auth.user?.role_name, dispatch]);

  const handlePublish = (offerId: number) => {
    dispatch(publishJobOffer(offerId));
  };

  if (auth.user?.role_name !== "admin") {
    return (
      <Layout title="Accès refusé">
        <Card>
          <p className="text-slate-700 dark:text-slate-200">
            Vous n'avez pas les droits pour accéder à cette page.
          </p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="Gestion des offres">
      <Card>
        <div className="space-y-3 text-slate-700 dark:text-slate-200">
          <p className="text-lg font-medium">Toutes les offres</p>
          <p>
            Les offres non publiées sont soumises par des recruteurs et doivent
            être validées par l'administrateur.
          </p>
        </div>
      </Card>

      {status === "loading" && (
        <div className="mt-6 text-slate-700 dark:text-slate-200">
          Chargement...
        </div>
      )}
      {status === "failed" && (
        <div className="mt-6 text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="mt-6 space-y-6">
        {adminItems.map((offer) => (
          <Card key={offer.id}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {offer.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {offer.location || "Localisation non précisée"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      offer.is_published
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                    }`}
                  >
                    {offer.is_published ? "Publié" : "En attente"}
                  </span>
                  {!offer.is_published && (
                    <Button
                      onClick={() => handlePublish(offer.id)}
                      className="rounded-md px-3 py-2"
                    >
                      Publier
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-200">
                {offer.description}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Recruteur
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {offer.recruiter_full_name ||
                      offer.recruiter_email ||
                      offer.recruiter_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Entreprise
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {offer.company_id}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Candidatures
                </h3>
                {offer.applications && offer.applications.length > 0 ? (
                  <ul className="space-y-3">
                    {offer.applications.map((application) => (
                      <li
                        key={application.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {application.candidate_full_name ||
                                application.candidate_email}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Statut : {application.status}
                            </p>
                          </div>
                          {application.resume_url && (
                            <a
                              href={application.resume_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200"
                            >
                              Voir CV
                            </a>
                          )}
                        </div>
                        {application.cover_letter && (
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {application.cover_letter}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Aucune candidature pour cette offre.
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export default AdminJobOffersPage;
