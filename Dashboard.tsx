import { useState } from "react";
import { Shield, LogOut, Cpu, Upload, PenLine } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "@/components/TransactionForm";
import { CSVUpload } from "@/components/CSVUpload";
import { UserTransactionTable } from "@/components/UserTransactionTable";
import { FraudAlerts } from "@/components/FraudAlerts";
import { AnalyzeButton } from "@/components/AnalyzeButton";
import { StatsOverview } from "@/components/StatsOverview";
import { ModelComparison } from "@/components/ModelComparison";
import { TransactionChart } from "@/components/TransactionChart";
import { ROCChart } from "@/components/ROCChart";
import { FeatureImportanceChart } from "@/components/FeatureImportanceChart";
import { TransactionTable } from "@/components/TransactionTable";
import { ConfusionMatrixCard } from "@/components/ConfusionMatrixCard";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <AnalyticsProvider refreshKey={refreshKey}>
      <div className="min-h-screen grid-pattern">
        <header className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-10">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 glow-primary">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">FraudShield AI</h1>
                <p className="text-xs text-muted-foreground font-mono">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AnalyzeButton onComplete={refresh} />
              <Button variant="ghost" size="sm" onClick={signOut} className="font-mono text-xs">
                <LogOut className="h-4 w-4 mr-1" /> Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Add Transaction Section */}
          <div className="glass-card rounded-lg p-5">
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
              Add Transactions
            </h3>
            <Tabs defaultValue="manual">
              <TabsList className="mb-4">
                <TabsTrigger value="manual" className="font-mono text-xs">
                  <PenLine className="h-3.5 w-3.5 mr-1" /> Manual Entry
                </TabsTrigger>
                <TabsTrigger value="csv" className="font-mono text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1" /> CSV Upload
                </TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <TransactionForm onSuccess={refresh} />
              </TabsContent>
              <TabsContent value="csv">
                <CSVUpload onSuccess={refresh} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UserTransactionTable refreshKey={refreshKey} />
            </div>
            <FraudAlerts />
          </div>

          {/* Analytics Section */}
          <StatsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionChart />
            <ROCChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ModelComparison />
            <ConfusionMatrixCard model="xgboost" />
            <ConfusionMatrixCard model="ann" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionTable />
            </div>
            <FeatureImportanceChart />
          </div>
        </main>
      </div>
    </AnalyticsProvider>
  );
};

export default Dashboard;
