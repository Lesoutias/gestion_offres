import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { fetchAdminJobOffers } from "../features/jobOffers/jobOfferSlice";
import { Button, Card } from "../components";
import AdminLayout from "../components/AdminLayout";
import Layout from "../components/Layout";

function DashboardPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { adminItems, status } = useAppSelector((state) => state.jobOffers);

  useEffect(() => {
    if (!auth.user && auth.token) {
      dispatch(fetchCurrentUser());
    }
  }, [auth.user, auth.token, dispatch]);

  useEffect(() => {
    if (auth.user?.role_name === "admin") {
      dispatch(fetchAdminJobOffers());
    }
  }, [auth.user?.role_name, dispatch]);

  const totalOffers = adminItems.length;
  const publishedOffers = adminItems.filter((offer) => offer.is_published).length;
  const rejectedOffers = adminItems.filter((offer) => offer.is_rejected).length;
  const pendingOffers = adminItems.filter(
    (offer) => !offer.is_published && !offer.is_rejected,
  ).length;
  const totalCandidates = adminItems.reduce(
    (sum, offer) => sum + (offer.applications?.length || 0),
    0,
  );

  const showCreateOfferButton = ["admin", "recruiter"].includes(
    auth.user?.role_name ?? "",
  );

  if (auth.user?.role_name === "admin") {
    return (
      <AdminLayout title="Tableau de bord" active="dashboard">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Offres totales
              </p>
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                {totalOffers}
              </p>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Publiées
              </p>
              <p className="mt-4 text-4xl font-semibold text-emerald-600 dark:text-emerald-400">
                {publishedOffers}
              </p>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                En attente
              </p>
              <p className="mt-4 text-4xl font-semibold text-amber-600 dark:text-amber-400">
                {pendingOffers}
              </p>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Candidats
              </p>
              <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-slate-100">
                {totalCandidates}
              </p>
            </Card>
          </div>

          <Card>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Aperçu du pipeline des offres
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Voir rapidement la progression des offres publiées, en attente et refusées.
                  </p>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Statut : {status === "loading" ? "Actualisation..." : "À jour"}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Publiées", value: publishedOffers, color: "bg-emerald-500" },
                  { label: "En attente", value: pendingOffers, color: "bg-amber-500" },
                  { label: "Refusées", value: rejectedOffers, color: "bg-rose-500" },
                ].map((item) => {
                  const percent = totalOffers ? Math.round((item.value / totalOffers) * 100) : 0;
                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-slate-700 dark:text-slate-300">
                        <span>{item.label}</span>
                        <span>{item.value} ({percent}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link to="/admin/offres">
              <Button className="w-full">Gérer les offres</Button>
            </Link>
            <Link to="/admin/candidats">
              <Button className="w-full">Voir les candidats</Button>
            </Link>
            <Link to="/job-offers/new">
              <Button className="w-full">Ajouter une offre</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <Layout title="Tableau de bord">
      <Card>
        <div className="space-y-4 text-slate-700 dark:text-slate-200">
          <p className="text-lg font-medium">
            Bonjour {auth.user?.full_name || auth.user?.email || "utilisateur"}.
          </p>
          <p>
            Accédez aux offres, vos candidatures ou aux demandes de recrutement.
          </p>
        </div>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/job-offers">
          <Button className="w-full">Voir les offres</Button>
        </Link>
        <Link to="/applications">
          <Button className="w-full">Mes candidatures</Button>
        </Link>
        <Link to="/recruiter-applications">
          <Button className="w-full">Candidatures recruteur</Button>
        </Link>
        {showCreateOfferButton && (
          <Link to="/job-offers/new">
            <Button className="w-full">Créer une offre</Button>
          </Link>
        )}
      </div>
    </Layout>
  );
}

export default DashboardPage;
