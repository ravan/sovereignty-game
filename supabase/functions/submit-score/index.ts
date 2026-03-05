import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { player_name, score, correct_answers, max_streak } = await req.json();

    // --- Validation ---
    if (typeof player_name !== "string" || player_name.trim().length === 0 || player_name.length > 50) {
      return new Response(
        JSON.stringify({ error: "Invalid player_name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!Number.isInteger(score) || score < 0 || score > 10000) {
      return new Response(
        JSON.stringify({ error: "Invalid score" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!Number.isInteger(correct_answers) || correct_answers < 0 || correct_answers > 10) {
      return new Response(
        JSON.stringify({ error: "Invalid correct_answers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (score > correct_answers * 1000) {
      return new Response(
        JSON.stringify({ error: "Score exceeds maximum for correct answers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!Number.isInteger(max_streak) || max_streak < 0 || max_streak > 10 || max_streak > correct_answers) {
      return new Response(
        JSON.stringify({ error: "Invalid max_streak" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- Service-role client (bypasses RLS) ---
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Rate limit: 1 submission per player_name per 30s ---
    const thirtySecondsAgo = new Date(Date.now() - 30_000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("leaderboard")
      .select("id")
      .eq("player_name", player_name.trim())
      .gte("played_at", thirtySecondsAgo)
      .limit(1);

    if (recent && recent.length > 0) {
      return new Response(
        JSON.stringify({ error: "Please wait before submitting again" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // --- Insert ---
    const { error } = await supabaseAdmin.from("leaderboard").insert({
      player_name: player_name.trim(),
      score,
      correct_answers,
      max_streak,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
