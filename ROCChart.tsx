import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export function ROCChart() {
  const { rocCurveData } = useAnalytics();

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
        ROC Curve
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rocCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis
              dataKey="fpr" label={{ value: "False Positive Rate", position: "bottom", fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
            />
            <YAxis
              label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: "hsl(215, 15%, 55%)", fontSize: 11 }}
              tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
            />
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
            <Line type="monotone" dataKey="xgboost" name="XGBoost" stroke="hsl(175, 80%, 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ann" name="ANN" stroke="hsl(265, 70%, 60%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="random" name="Random" stroke="hsl(215, 15%, 35%)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
