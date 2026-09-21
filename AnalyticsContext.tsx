import { createContext, useContext } from "react";
import { AnalyticsData, useTransactionAnalytics } from "@/hooks/useTransactionAnalytics";

const AnalyticsContext = createContext<AnalyticsData | null>(null);

export function AnalyticsProvider({ refreshKey, children }: { refreshKey: number; children: React.ReactNode }) {
  const analytics = useTransactionAnalytics(refreshKey);
  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used within AnalyticsProvider");
  return ctx;
}
