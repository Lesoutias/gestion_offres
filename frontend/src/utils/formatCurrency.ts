export type Currency = "CDF" | "USD";

export const CURRENCY_OPTIONS: Array<{ label: string; value: Currency }> = [
  { label: "USD - Dollar americain", value: "USD" },
  { label: "CDF - Franc congolais", value: "CDF" },
];

export function formatAmount(amount: number, currency: Currency = "USD"): string {
  const formatted = amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  return `${formatted} ${currency}`;
}
