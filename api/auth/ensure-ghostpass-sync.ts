import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * API endpoint to ensure user is synced to ghost-pass database
 * This uses service role keys to create users in both auth and public tables
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, role = 'USER' } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    // Initialize ghost-pass Supabase client with service role
    const ghostPassUrl = process.env.VITE_GHOSTPASS_SUPABASE_URL || 'https://szjuufogsbpeaqnamuyo.supabase.co';
    const ghostPassServiceKey = process.env.GHOSTPASS_SERVICE_ROLE_KEY;

    if (!ghostPassServiceKey) {
      console.error('GHOSTPASS_SERVICE_ROLE_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const ghostPassAdmin = createClient(ghostPassUrl, ghostPassServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if user already exists in ghost-pass public.users
    const { data: existingUser, error: checkError } = await ghostPassAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      throw checkError;
    }

    if (existingUser) {
      console.log('User already exists in ghost-pass:', userId);
      return res.status(200).json({ 
        success: true, 
        message: 'User already synced',
        userId 
      });
    }

    // Check if user exists in auth.users
    const { data: authUser, error: authError } = await ghostPassAdmin.auth.admin.getUserById(userId);

    if (authError || !authUser.user) {
      // User doesn't exist in auth.users, create them
      console.log('Creating user in ghost-pass auth.users:', userId);
      
      const { data: newAuthUser, error: createAuthError } = await ghostPassAdmin.auth.admin.createUser({
        id: userId,
        email: email,
        email_confirm: true,
        user_metadata: {
          synced_from: 'be-valid',
          synced_at: new Date().toISOString()
        }
      });

      if (createAuthError) {
        console.error('Error creating auth user:', createAuthError);
        throw createAuthError;
      }

      console.log('Auth user created successfully:', newAuthUser.user.id);
    } else {
      console.log('User already exists in ghost-pass auth.users:', userId);
    }

    // Now create user in public.users table
    console.log('Creating user in ghost-pass public.users:', userId);
    
    const { error: insertError } = await ghostPassAdmin
      .from('users')
      .insert({
        id: userId,
        email: email,
        role: role,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error creating public user:', insertError);
      throw insertError;
    }

    console.log('User successfully synced to ghost-pass:', userId);

    return res.status(200).json({
      success: true,
      message: 'User synced successfully',
      userId
    });

  } catch (error: any) {
    console.error('Error in ensure-ghostpass-sync:', error);
    return res.status(500).json({
      error: 'Failed to sync user',
      details: error.message
    });
  }
}
