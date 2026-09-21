import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface TransactionFormProps {
  onSuccess: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = ["Shopping", "Food & Dining", "Travel", "Entertainment", "Gas", "Healthcare", "Online", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        transaction_id: `TXN-${Date.now()}`,
        amount: parseFloat(amount),
        time: now.toTimeString().split(" ")[0],
        merchant,
        category,
        status: "pending",
      });

      if (error) throw error;
      toast.success("Transaction added! Analyzing for fraud...");
      setAmount("");
      setMerchant("");
      setCategory("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Amount ($)</Label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="bg-secondary/50 border-border/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Merchant</Label>
          <Input
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Amazon"
            className="bg-secondary/50 border-border/50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="bg-secondary/50 border-border/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={loading || !category} className="font-mono">
        <Plus className="h-4 w-4 mr-2" />
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}
