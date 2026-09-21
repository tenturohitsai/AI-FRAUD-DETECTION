import { useAnalytics } from "@/contexts/AnalyticsContext";

const metrics = ["accuracy", "precision", "recall", "f1Score", "auc"] as const;
const metricLabels: Record<string, string> = {
  accuracy: "Accuracy",
  precision: "Precision",
  recall: "Recall",
  f1Score: "F1 Score",
  auc: "AUC-ROC",
};

export function ModelComparison() {
  const { modelMetrics, totalTransactions } = useAnalytics();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Model Comparison
      </h3>
      {totalTransactions === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 font-mono">
          Add and analyze transactions to see model comparison
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 pr-4 text-muted-foreground font-mono text-xs">Metric</th>
                <th className="text-right py-2 px-4 text-primary font-mono text-xs">XGBoost</th>
                <th className="text-right py-2 pl-4 font-mono text-xs text-chart-secondary">ANN</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => {
                const xgVal = modelMetrics.xgboost[metric];
                const annVal = modelMetrics.ann[metric];
                const xgBetter = xgVal >= annVal;
                return (
                  <tr key={metric} className="border-b border-border/20">
                    <td className="py-3 pr-4 text-muted-foreground">{metricLabels[metric]}</td>
                    <td className={`text-right py-3 px-4 font-mono ${xgBetter ? "text-primary font-semibold" : ""}`}>
                      {(xgVal * 100).toFixed(2)}%
                    </td>
                    <td className={`text-right py-3 pl-4 font-mono ${!xgBetter ? "font-semibold" : ""}`}
                      style={{ color: !xgBetter ? "hsl(var(--chart-secondary))" : undefined }}>
                      {(annVal * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Train Time</td>
                <td className="text-right py-3 px-4 font-mono">{modelMetrics.xgboost.trainTime}</td>
                <td className="text-right py-3 pl-4 font-mono">{modelMetrics.ann.trainTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
