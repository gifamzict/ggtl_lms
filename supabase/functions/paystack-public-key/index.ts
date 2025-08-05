import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    if (req.method === "GET") {
      // Fetch public key (no authentication required)
      const { data: settings, error } = await supabaseClient
        .from('payment_gateway_settings')
        .select('public_key, is_active')
        .eq('name', 'paystack')
        .single();

      if (error || !settings?.is_active) {
        return new Response(
          JSON.stringify({ error: "Payment gateway not configured or inactive" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          public_key: settings.public_key,
          is_active: settings.is_active 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    throw new Error("Method not allowed");
  } catch (error) {
    console.error("Paystack public key error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});