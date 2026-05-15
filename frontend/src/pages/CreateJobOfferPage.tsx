import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { createJobOffer } from "../features/jobOffers/jobOfferSlice";
import { Button, Card, Layout } from "../components";

function CreateJobOfferPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await dispatch(
        createJobOffer({
          title,
          description,
          location: location || undefined,
          company_id: companyId,
          is_published: true,
        }),
      ).unwrap();
      setSuccess("Offre créée avec succès.");
      navigate("/job-offers");
    } catch (err: any) {
      setError(err || "Impossible de créer l'offre");
    }
  };

  return (
    <Layout title="Créer une nouvelle offre">
      <Card className="max-w-2xl mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Les offres créées par un recruteur seront envoyées à validation par
            l'administrateur.
          </div>
          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              htmlFor="title"
            >
              Titre de l'offre
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                htmlFor="location"
              >
                Localisation
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                htmlFor="companyId"
              >
                ID de la société
              </label>
              <input
                id="companyId"
                type="number"
                min={1}
                value={companyId}
                onChange={(event) => setCompanyId(Number(event.target.value))}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <Button type="submit" className="w-full">
            Créer l'offre
          </Button>
        </form>
      </Card>
    </Layout>
  );
}

export default CreateJobOfferPage;
