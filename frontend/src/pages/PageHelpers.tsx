import { ReactNode, useEffect, useState } from "react";
import { Card } from "../components/ui/Card";

export function PageTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
    </div>
  );
}

export function StatGrid({ items }: { items: Array<{ label: string; value: string | number }> }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loader()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err?.response?.data?.detail || err?.message || "Erreur de chargement"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
}

export function StateBlock({ loading, error, children }: { loading: boolean; error?: string | null; children: ReactNode }) {
  if (loading) return <Card>Chargement...</Card>;
  if (error) return <Card><p className="text-sm text-red-700">{error}</p></Card>;
  return <>{children}</>;
}
