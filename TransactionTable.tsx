import { useAnalytics } from "@/contexts/AnalyticsContext";

export function TransactionTable() {
  const { transactions, totalTransactions } = useAnalytics();
  const analyzed = transactions.filter(t => t.status !== "pending");

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Analyzed Transactions
      </h3>
      {analyzed.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 font-mono">
          No analyzed transactions yet. Add transactions and run fraud analysis.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["ID", "Amount", "Time", "Risk Score", "Status"].map((h) => (
                  <th key={h} className="text-left py-2 text-muted-foreground font-mono text-xs pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analyzed.map((txn) => (
                <tr key={txn.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs">{txn.transaction_id || txn.id.slice(0, 8)}</td>
                  <td className="py-2.5 pr-4 font-mono">${Number(txn.amount).toFixed(2)}</td>
                  <td className="py-2.5 pr-4 font-mono text-muted-foreground text-xs">{txn.time || "—"}</td>
                  <td className="py-2.5 pr-4">
                    {txn.risk_score !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(txn.risk_score as number) * 100}%`,
                              backgroundColor: (txn.risk_score as number) > 0.7
                                ? "hsl(var(--destructive))"
                                : (txn.risk_score as number) > 0.3
                                ? "hsl(var(--warning))"
                                : "hsl(var(--accent))",
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs">{((txn.risk_score as number) * 100).toFixed(0)}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs font-mono">—</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono ${
                        txn.status === "fraud"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-accent/15 text-accent"
                      }`}
                    >
                      {txn.status === "fraud" ? "⚠ Fraud" : "✓ Safe"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
