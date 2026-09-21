import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export function TransactionChart() {
  const { transactionTimeline } = useAnalytics();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Transaction Volume by Hour
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transactionTimeline}>
            <defs>
              <linearGradient id="gradLegit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="hour" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 92%)",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone" dataKey="legitimate" name="Legitimate"
              stroke="hsl(145, 60%, 45%)" fill="url(#gradLegit)" strokeWidth={2}
            />
            <Area
              type="monotone" dataKey="fraud" name="Fraud"
              stroke="hsl(0, 72%, 55%)" fill="url(#gradFraud)" strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
