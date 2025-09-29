/// <reference types="https://deno.land/x/deno/cli/types/v1.42.1/deno.d.ts" />

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple decryption function matching the encryption in admin-payment-settings
async function decryptText(encryptedText: string, key: string): Promise<string> {
  const data = new Uint8Array(atob(encryptedText).split('').map(c => c.charCodeAt(0)));
  const keyData = new TextEncoder().encode(key.padEnd(32, '0').slice(0, 32));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify user authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user) {
      throw new Error("Invalid authentication");
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { courseId } = body;

      if (!courseId) {
        throw new Error("Course ID is required");
      }

      // Fetch course details
      const { data: course, error: courseError } = await supabaseClient
        .from('courses')
        .select('id, title, price, instructor_id')
        .eq('id', courseId)
        .single();

      if (courseError || !course) {
        throw new Error("Course not found");
      }

      // Check if user is already enrolled
      const { data: enrollment } = await supabaseClient
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', userData.user.id)
        .single();

      if (enrollment) {
        throw new Error("Already enrolled in this course");
      }

      // Fetch payment gateway settings
      const { data: settings, error: settingsError } = await supabaseClient
        .from('payment_gateway_settings')
        .select('secret_key, is_active')
        .eq('name', 'paystack')
        .single();

      if (settingsError || !settings?.is_active || !settings?.secret_key) {
        throw new Error("Payment gateway not configured");
      }

      // Decrypt secret key
      const encryptionKey = Deno.env.get("PAYMENT_ENCRYPTION_KEY") || "default-key-change-in-production";
      const secretKey = await decryptText(settings.secret_key, encryptionKey);

      // Initialize Paystack transaction
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.user.email,
          amount: Math.round(Number(course.price) * 100), // Convert to kobo (Nigerian currency)
          currency: 'NGN',
          reference: `course_${courseId}_${userData.user.id}_${Date.now()}`,
          metadata: {
            course_id: courseId,
            user_id: userData.user.id,
            course_title: course.title,
          },
          callback_url: `${req.headers.get("origin")}/payment/success?course_id=${courseId}`,
          cancel_url: `${req.headers.get("origin")}/courses/${course.id}`,
        }),
      });

      const paystackData = await paystackResponse.json();

      if (!paystackResponse.ok || !paystackData.status) {
        throw new Error(paystackData.message || "Failed to initialize payment");
      }

      return new Response(
        JSON.stringify({
          authorization_url: paystackData.data.authorization_url,
          access_code: paystackData.data.access_code,
          reference: paystackData.data.reference,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    throw new Error("Method not allowed");
  } catch (error) {
    console.error("Paystack initialize error:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message?: string }).message ?? String(error)
      : String(error);

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});