import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CSVUploadProps {
  onSuccess: () => void;
}

export function CSVUpload({ onSuccess }: CSVUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: number; errors: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      rows.push(row);
    }
    return rows;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setFileName(file.name);
    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length === 0) {
        toast.error("CSV file is empty or invalid");
        return;
      }

      let success = 0;
      let errors = 0;

      // Batch insert in chunks of 50
      const chunkSize = 50;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize).map((row) => ({
          user_id: user.id,
          transaction_id: row.transaction_id || row.id || `CSV-${Date.now()}-${i}`,
          amount: parseFloat(row.amount) || 0,
          time: row.time || row.timestamp || new Date().toTimeString().split(" ")[0],
          merchant: row.merchant || row.merchant_name || "",
          category: row.category || "",
          status: "pending",
          features: row,
        }));

        const { error } = await supabase.from("transactions").insert(chunk);
        if (error) {
          errors += chunk.length;
        } else {
          success += chunk.length;
        }
      }

      setResult({ success, errors });
      if (success > 0) {
        toast.success(`Uploaded ${success} transactions for analysis!`);
        onSuccess();
      }
    } catch (error: any) {
      toast.error("Failed to parse CSV: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground font-mono">Processing {fileName}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-mono">
              Click to upload a CSV file
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono">
              Expected columns: amount, merchant, category, time
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className="flex items-center gap-4 text-sm font-mono">
          {result.success > 0 && (
            <div className="flex items-center gap-1 text-accent">
              <CheckCircle className="h-4 w-4" />
              <span>{result.success} imported</span>
            </div>
          )}
          {result.errors > 0 && (
            <div className="flex items-center gap-1 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{result.errors} failed</span>
            </div>
          )}
        </div>
      )}

      {fileName && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <FileText className="h-3.5 w-3.5" />
          <span>{fileName}</span>
        </div>
      )}
    </div>
  );
}
