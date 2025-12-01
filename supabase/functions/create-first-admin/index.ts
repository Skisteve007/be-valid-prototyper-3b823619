import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "administrator")
      .limit(1);

    if (checkError) {
      console.error("Error checking for existing admins:", checkError);
      throw new Error("Failed to check admin status");
    }

    if (existingAdmins && existingAdmins.length > 0) {
      throw new Error("An administrator already exists. Please use the login page.");
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    let userId: string;

    if (userExists) {
      console.log("User already exists:", userExists.id);
      userId = userExists.id;

      // Update their password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password }
      );

      if (updateError) {
        console.error("Error updating user password:", updateError);
        throw new Error("User exists but failed to update password");
      }

      console.log("Password updated for existing user");
    } else {
      // Create the user account
      const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email for admin
        user_metadata: {
          full_name: "Administrator",
        },
      });

      if (signUpError) {
        console.error("Error creating user:", signUpError);
        throw new Error(signUpError.message || "Failed to create user account");
      }

      if (!userData.user) {
        throw new Error("User creation returned no user data");
      }

      console.log("User created:", userData.user.id);
      userId = userData.user.id;
    }

    // Add administrator role using service role (bypasses RLS)
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "administrator",
      });

    if (roleError) {
      console.error("Error adding admin role:", roleError);
      throw new Error("Failed to assign administrator role");
    }

    console.log("Admin role assigned successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin account created successfully",
        userId: userId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-first-admin:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
