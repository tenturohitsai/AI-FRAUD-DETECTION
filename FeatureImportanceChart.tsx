import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export function FeatureImportanceChart() {
  const { featureImportance, totalTransactions } = useAnalytics();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        Feature Importance
      </h3>
      {totalTransactions === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 font-mono">
          No analyzed data yet
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
              <YAxis dataKey="feature" type="category" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 15%, 18%)",
                  borderRadius: "8px",
                  color: "hsl(210, 20%, 92%)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [(value * 100).toFixed(1) + "%", "Importance"]}
              />
              <Bar dataKey="importance" fill="hsl(175, 80%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
