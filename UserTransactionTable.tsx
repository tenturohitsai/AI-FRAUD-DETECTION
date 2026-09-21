import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  transaction_id: string | null;
  amount: number;
  time: string | null;
  merchant: string | null;
  category: string | null;
  risk_score: number | null;
  status: string;
  created_at: string;
}

interface UserTransactionTableProps {
  refreshKey: number;
}

export function UserTransactionTable({ refreshKey }: UserTransactionTableProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, refreshKey]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-transactions")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) {
    return (
      <div className="glass-card rounded-lg p-5">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-secondary/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const statusBadge = (status: string, risk: number | null) => {
    if (status === "fraud") return <Badge variant="destructive" className="font-mono text-xs">⚠ Fraud</Badge>;
    if (status === "legitimate") return <Badge className="bg-accent/15 text-accent border-0 font-mono text-xs">✓ Safe</Badge>;
    return <Badge variant="secondary" className="font-mono text-xs">⏳ Pending</Badge>;
  };

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Your Transactions ({transactions.length})
      </h3>
      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 font-mono">
          No transactions yet. Add one manually or upload a CSV.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["ID", "Amount", "Merchant", "Category", "Risk", "Status"].map((h) => (
                  <th key={h} className="text-left py-2 text-muted-foreground font-mono text-xs pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 pr-4 font-mono text-xs">{txn.transaction_id || txn.id.slice(0, 8)}</td>
                  <td className="py-2.5 pr-4 font-mono">${Number(txn.amount).toFixed(2)}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs">{txn.merchant || "—"}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground text-xs">{txn.category || "—"}</td>
                  <td className="py-2.5 pr-4">
                    {txn.risk_score !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full"
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
                  <td className="py-2.5">{statusBadge(txn.status, txn.risk_score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
