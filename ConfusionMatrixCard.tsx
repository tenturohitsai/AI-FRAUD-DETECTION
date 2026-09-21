import { useAnalytics } from "@/contexts/AnalyticsContext";

export function ConfusionMatrixCard({ model }: { model: "xgboost" | "ann" }) {
  const { confusionMatrix, totalTransactions } = useAnalytics();
  const cm = confusionMatrix[model];
  const total = cm.tp + cm.fp + cm.fn + cm.tn;
  const title = model === "xgboost" ? "XGBoost" : "ANN";

  const cells = [
    { label: "TP", value: cm.tp, colorClass: "bg-accent/20 text-accent" },
    { label: "FP", value: cm.fp, colorClass: "bg-destructive/20 text-destructive" },
    { label: "FN", value: cm.fn, colorClass: "bg-warning/20 text-warning" },
    { label: "TN", value: cm.tn, colorClass: "bg-primary/20 text-primary" },
  ];

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Confusion Matrix — {title}
      </h3>
      {totalTransactions === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 font-mono">
          No analyzed data yet
        </p>
      ) : (
        <div className="flex justify-center">
          <div>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="text-center text-[10px] font-mono text-muted-foreground col-span-2">
                Predicted
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center">
                <span className="text-[10px] font-mono text-muted-foreground -rotate-90 whitespace-nowrap">
                  Actual
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {cells.map((cell) => (
                  <div
                    key={cell.label}
                    className={`${cell.colorClass} rounded-md p-3 text-center min-w-[80px]`}
                  >
                    <div className="text-[10px] font-mono opacity-70">{cell.label}</div>
                    <div className="text-lg font-bold font-mono">{cell.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-2 text-[10px] font-mono text-muted-foreground">
              Total: {total.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
