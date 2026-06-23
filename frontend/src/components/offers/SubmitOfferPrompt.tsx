import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import type { TenderCall } from "../../types";
import { isSubmissionOpen } from "../../utils/tenderCallUtils";
import { Button } from "../ui/Button";

export function SubmitOfferPrompt({ tender }: { tender: TenderCall }) {
  const user = useAppSelector((state) => state.auth.user);
  const open = isSubmissionOpen(tender);

  if (!open) {
    return (
      <p className="text-sm text-slate-600">
        Les soumissions ne sont plus acceptees pour cet appel d'offres.
      </p>
    );
  }

  if (!user) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Consultation publique</p>
        <p className="mt-1">
          Vous pouvez consulter cet appel sans compte. Pour soumettre une offre, connectez-vous ou inscrivez votre entreprise.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/login" state={{ from: `/company/tender-calls/${tender.id}/submit-offer` }}>
            <Button>Se connecter</Button>
          </Link>
          <Link to="/register-company">
            <Button variant="secondary">Inscrire mon entreprise</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (user.role?.name !== "entreprise") {
    return (
      <p className="text-sm text-slate-600">
        Seules les entreprises inscrites peuvent soumettre une offre.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link to={`/company/tender-calls/${tender.id}/submit-offer`}>
        <Button>Soumettre une offre</Button>
      </Link>
      <Link to={`/company/tender-calls/${tender.id}`}>
        <Button variant="secondary">Voir dans mon espace</Button>
      </Link>
    </div>
  );
}
