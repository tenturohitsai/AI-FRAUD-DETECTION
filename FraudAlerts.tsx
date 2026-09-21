import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bell, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  message: string;
  severity: string;
  read: boolean;
  created_at: string;
}

export function FraudAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  const fetchAlerts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("fraud_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  // Realtime alerts
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("fraud-alerts")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "fraud_alerts",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setAlerts((prev) => [payload.new as Alert, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("fraud_alerts").update({ read: true }).eq("id", id);
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;
  const displayAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
            Fraud Alerts
          </h3>
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-mono px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
          <CheckCircle className="h-8 w-8 text-accent" />
          <p className="text-sm font-mono">No fraud alerts</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                alert.read ? "bg-secondary/20" : "bg-destructive/10 border border-destructive/20"
              }`}
            >
              <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                alert.severity === "high" ? "text-destructive" : "text-warning"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{alert.message}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              {!alert.read && (
                <Button variant="ghost" size="sm" onClick={() => markRead(alert.id)} className="flex-shrink-0">
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
          {alerts.length > 5 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="w-full font-mono text-xs">
              {showAll ? "Show less" : `Show all (${alerts.length})`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
