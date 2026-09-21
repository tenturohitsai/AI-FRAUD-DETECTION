import { Shield, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export function StatsOverview() {
  const { totalTransactions, fraudulentCount, legitimateCount, fraudPercentage, modelMetrics } = useAnalytics();

  const bestAuc = Math.max(modelMetrics.xgboost.auc, modelMetrics.ann.auc);
  const bestModel = modelMetrics.xgboost.auc >= modelMetrics.ann.auc ? modelMetrics.xgboost.name : modelMetrics.ann.name;

  const stats = [
    {
      label: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      icon: Activity,
      cardClass: "stat-card-primary",
      iconClass: "text-primary",
    },
    {
      label: "Fraudulent",
      value: fraudulentCount.toLocaleString(),
      subtitle: `${fraudPercentage}%`,
      icon: AlertTriangle,
      cardClass: "stat-card-fraud",
      iconClass: "text-destructive",
    },
    {
      label: "Legitimate",
      value: legitimateCount.toLocaleString(),
      icon: Shield,
      cardClass: "stat-card-safe",
      iconClass: "text-accent",
    },
    {
      label: "Best AUC Score",
      value: totalTransactions > 0 ? bestAuc.toFixed(4) : "—",
      subtitle: totalTransactions > 0 ? bestModel : "No data yet",
      icon: TrendingUp,
      cardClass: "stat-card-primary",
      iconClass: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.cardClass} rounded-lg p-5 animate-slide-up`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <stat.icon className={`h-4 w-4 ${stat.iconClass}`} />
          </div>
          <div className="text-2xl font-bold font-mono">{stat.value}</div>
          {stat.subtitle && (
            <div className="text-xs text-muted-foreground mt-1">{stat.subtitle}</div>
          )}
        </div>
      ))}
    </div>
  );
}
