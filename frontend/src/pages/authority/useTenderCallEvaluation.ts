import { useCallback } from "react";
import { tenderCallService } from "../../services/tenderCallService";
import type { TenderCall } from "../../types";

export function useTenderCallEvaluation(
  setData: React.Dispatch<React.SetStateAction<TenderCall[] | null>>,
  setError: (message: string | null) => void,
) {
  return useCallback(
    async (tenderId: number) => {
      const confirmed = window.confirm(
        "Mettre cet appel d'offres en phase d'evaluation ? La commission pourra alors evaluer les offres recues.",
      );
      if (!confirmed) return;

      try {
        setError(null);
        const updated = await tenderCallService.startEvaluation(tenderId);
        setData((current) => current?.map((item) => (item.id === tenderId ? updated : item)) ?? null);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
          "Impossible de mettre l'appel en evaluation";
        setError(message);
      }
    },
    [setData, setError],
  );
}
