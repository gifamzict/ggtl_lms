import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple decryption function
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

// Verify Paystack signature
async function verifyPaystackSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(body);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSignature === signature;
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

    if (req.method === "POST") {
      const body = await req.text();
      const signature = req.headers.get('x-paystack-signature');
      
      if (!signature) {
        throw new Error("No signature provided");
      }

      // Fetch secret key for signature verification
      const { data: settings, error: settingsError } = await supabaseClient
        .from('payment_gateway_settings')
        .select('secret_key')
        .eq('name', 'paystack')
        .single();

      if (settingsError || !settings?.secret_key) {
        throw new Error("Payment gateway not configured");
      }

      // Decrypt secret key
      const encryptionKey = Deno.env.get("PAYMENT_ENCRYPTION_KEY") || "default-key-change-in-production";
      const secretKey = await decryptText(settings.secret_key, encryptionKey);

      // Verify signature
      const isValid = await verifyPaystackSignature(body, signature, secretKey);
      if (!isValid) {
        console.error("Invalid signature");
        return new Response("Invalid signature", { status: 400 });
      }

      const event = JSON.parse(body);
      console.log("Paystack webhook event:", event.event);

      // Handle successful charge
      if (event.event === 'charge.success') {
        const { data } = event;
        const metadata = data.metadata;
        
        if (!metadata?.course_id || !metadata?.user_id) {
          console.error("Missing metadata in webhook");
          return new Response("Missing metadata", { status: 400 });
        }

        // Verify transaction with Paystack
        const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${data.reference}`, {
          headers: {
            'Authorization': `Bearer ${secretKey}`,
          },
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyResponse.ok || !verifyData.status || verifyData.data.status !== 'success') {
          console.error("Transaction verification failed");
          return new Response("Transaction verification failed", { status: 400 });
        }

        // Check if enrollment already exists
        const { data: existingEnrollment } = await supabaseClient
          .from('enrollments')
          .select('id')
          .eq('course_id', metadata.course_id)
          .eq('user_id', metadata.user_id)
          .single();

        if (existingEnrollment) {
          console.log("Enrollment already exists");
          return new Response("OK", { status: 200 });
        }

        // Create enrollment
        const { error: enrollmentError } = await supabaseClient
          .from('enrollments')
          .insert({
            course_id: metadata.course_id,
            user_id: metadata.user_id,
            enrolled_at: new Date().toISOString(),
            progress_percentage: 0
          });

        if (enrollmentError) {
          console.error("Failed to create enrollment:", enrollmentError);
          throw enrollmentError;
        }

        console.log(`Successfully enrolled user ${metadata.user_id} in course ${metadata.course_id}`);
      }

      return new Response("OK", { status: 200 });
    }

    throw new Error("Method not allowed");
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});