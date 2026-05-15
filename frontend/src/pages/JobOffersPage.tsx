import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchJobOffers,
  type JobOffer,
} from "../features/jobOffers/jobOfferSlice";
import { Button, Card, Layout } from "../components";

function JobOffersPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { items, status, error } = useAppSelector((state) => state.jobOffers);

  useEffect(() => {
    dispatch(fetchJobOffers());
  }, [dispatch]);

  return (
    <Layout title="Offres d'emploi">
      <div className="space-y-4">
        {status === "loading" && <p>Chargement des offres...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {(auth.user?.role_name === "admin" ||
          auth.user?.role_name === "recruiter") && (
          <div className="flex justify-end">
            <Link to="/job-offers/new">
              <Button>Nouvelle offre</Button>
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {items.map((offer: JobOffer) => (
            <Card key={offer.id}>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {offer.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {offer.location || "Lieu non précisé"}
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-3">
                  {offer.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to={`/job-offers/${offer.id}`}>
                    <Button>Voir l'offre</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default JobOffersPage;
