import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple encryption/decryption using Web Crypto API
async function encryptText(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const keyData = encoder.encode(key.padEnd(32, '0').slice(0, 32));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );
  
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...result));
}

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

interface UpdateData {
    public_key: string;
    is_active: boolean;
    updated_at: string;
    secret_key?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== EDGE FUNCTION START ===");
    console.log("Request method:", req.method);
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("=== CHECKING AUTHORIZATION ===");
    
    // Verify admin authorization
    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header present:", !!authHeader);
    
    if (!authHeader) {
      console.error("No authorization header found");
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token extracted, length:", token.length);
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    console.log("User data:", userData);
    console.log("User error:", userError);
    
    if (userError || !userData.user) {
      console.error("Authentication failed:", userError);
      throw new Error("Invalid authentication");
    }

    console.log("User authenticated:", userData.user.id);

    // Check if user is super admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', userData.user.id)
      .single();

    console.log("Profile data:", profile);
    console.log("Profile error:", profileError);

    if (profileError) {
      console.error("Profile lookup failed:", profileError);
      throw new Error(`Profile lookup failed: ${profileError.message}`);
    }
    
    if (!profile || profile.role !== 'SUPER_ADMIN') {
      console.error("Insufficient permissions. User role:", profile?.role);
      throw new Error("Insufficient permissions - Super Admin access required");
    }
    
    console.log("=== AUTHORIZATION PASSED ===");

    const encryptionKey = Deno.env.get("PAYMENT_ENCRYPTION_KEY") || "default-key-change-in-production";

    // Parse request body for all POST requests (Supabase client uses POST)
    let body = null;
    let httpMethod = "GET"; // Default to GET
    
    if (req.method === "POST") {
      try {
        body = await req.json();
        // Check if _method is provided in body to override HTTP method
        if (body._method) {
          httpMethod = body._method;
          delete body._method; // Remove the _method property
        }
      } catch (e) {
        console.log("No JSON body or invalid JSON");
      }
    }

    console.log("Effective HTTP method:", httpMethod);
    console.log("Request body:", body);

    if (httpMethod === "GET") {
      // Fetch payment settings
      const { data: settings, error } = await supabaseClient
        .from('payment_gateway_settings')
        .select('*')
        .eq('name', 'paystack')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      // Decrypt secret key for display (mask it)
      let maskedSecretKey = '';
      if (settings?.secret_key) {
        try {
          const decrypted = await decryptText(settings.secret_key, encryptionKey);
          maskedSecretKey = decrypted ? '••••••••••••' + decrypted.slice(-4) : '';
        } catch {
          maskedSecretKey = 'Error decrypting key';
        }
      }

      return new Response(
        JSON.stringify({
          public_key: settings?.public_key || '',
          secret_key: maskedSecretKey,
          is_active: settings?.is_active || false
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    if (httpMethod === "PUT") {
      if (!body) {
        throw new Error("Request body is required for PUT requests");
      }

      const { public_key, secret_key, is_active } = body;

      let encryptedSecretKey = null;
      if (secret_key && !secret_key.includes('••••')) {
        // Only encrypt if it's not the masked value
        encryptedSecretKey = await encryptText(secret_key, encryptionKey);
      } else if (secret_key && secret_key.includes('••••')) {
        // Keep existing encrypted value
        const { data: existing } = await supabaseClient
          .from('payment_gateway_settings')
          .select('secret_key')
          .eq('name', 'paystack')
          .single();
        encryptedSecretKey = existing?.secret_key;
      }

      const updateData: UpdateData = {
        public_key,
        is_active,
        updated_at: new Date().toISOString()
      };

      if (encryptedSecretKey) {
        updateData.secret_key = encryptedSecretKey;
      }

      const { error } = await supabaseClient
        .from('payment_gateway_settings')
        .upsert(
          { name: 'paystack', ...updateData },
          { onConflict: 'name' }
        );

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    throw new Error("Method not allowed");
  } catch (error) {
    console.error("Admin payment settings error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});