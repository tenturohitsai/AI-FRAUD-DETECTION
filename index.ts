import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get pending transactions for this user
    const { data: transactions, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "pending");

    if (fetchError) throw fetchError;
    if (!transactions || transactions.length === 0) {
      return new Response(JSON.stringify({ analyzed: 0, fraudDetected: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let fraudDetected = 0;

    for (const txn of transactions) {
      // Fraud scoring heuristics
      let riskScore = 0;
      const amount = Number(txn.amount);

      // High amount transactions are riskier
      if (amount > 5000) riskScore += 0.35;
      else if (amount > 2000) riskScore += 0.25;
      else if (amount > 1000) riskScore += 0.15;

      // Late night transactions (if time is available)
      if (txn.time) {
        const hour = parseInt(txn.time.split(":")[0]);
        if (hour >= 0 && hour < 5) riskScore += 0.2;
        if (hour >= 22) riskScore += 0.1;
      }

      // Certain categories have higher risk
      const highRiskCategories = ["Online", "Travel", "Entertainment"];
      if (txn.category && highRiskCategories.includes(txn.category)) {
        riskScore += 0.1;
      }

      // Add randomness to simulate ML uncertainty
      riskScore += Math.random() * 0.15;

      // Cap at 1
      riskScore = Math.min(riskScore, 0.99);

      const isFraud = riskScore > 0.7;
      const status = isFraud ? "fraud" : "legitimate";

      // Update the transaction
      await supabase
        .from("transactions")
        .update({ risk_score: riskScore, status })
        .eq("id", txn.id);

      if (isFraud) {
        fraudDetected++;

        // Create fraud alert
        await supabase.from("fraud_alerts").insert({
          user_id,
          transaction_id: txn.id,
          message: `⚠ Suspicious transaction detected: $${amount.toFixed(2)} at ${txn.merchant || "Unknown"} (Risk: ${(riskScore * 100).toFixed(0)}%)`,
          severity: riskScore > 0.85 ? "critical" : "high",
        });
      }
    }

    return new Response(
      JSON.stringify({ analyzed: transactions.length, fraudDetected }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
