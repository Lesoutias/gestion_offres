import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchMyApplications,
  type Application,
} from "../features/applications/applicationSlice";
import { Card, Layout } from "../components";

function MyApplicationsPage() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <Layout title="Mes candidatures">
      {status === "loading" && <p>Chargement de vos candidatures...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {items.map((application: Application) => (
          <Card key={application.id}>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Demande #{application.id}
              </p>
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Statut : {application.status}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Lettre : {application.cover_letter || "Aucune"}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                CV : {application.resume_url || "Non fourni"}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
}

export default MyApplicationsPage;
