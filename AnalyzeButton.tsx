import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Cpu } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AnalyzeButtonProps {
  onComplete: () => void;
}

export function AnalyzeButton({ onComplete }: AnalyzeButtonProps) {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!user) return;
    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-fraud", {
        body: { user_id: user.id },
      });

      if (error) throw error;

      const result = data as { analyzed: number; fraudDetected: number };
      if (result.fraudDetected > 0) {
        toast.warning(`⚠ ${result.fraudDetected} suspicious transaction(s) detected!`);
      } else {
        toast.success(`✓ ${result.analyzed} transaction(s) analyzed. All clear!`);
      }
      onComplete();
    } catch (error: any) {
      toast.error("Analysis failed: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Button onClick={handleAnalyze} disabled={analyzing} variant="outline" className="font-mono glow-primary">
      <Cpu className={`h-4 w-4 mr-2 ${analyzing ? "animate-spin" : ""}`} />
      {analyzing ? "Analyzing..." : "Run Fraud Analysis"}
    </Button>
  );
}
