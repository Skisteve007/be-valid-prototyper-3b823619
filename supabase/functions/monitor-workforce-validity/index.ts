import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting workforce validity monitor...')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find all users with expired validity
    const now = new Date().toISOString()
    
    const { data: expiredUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, email, full_name, validity_expires_at')
      .eq('is_valid', true)
      .lt('validity_expires_at', now)

    if (fetchError) {
      console.error('Error fetching expired users:', fetchError)
      throw fetchError
    }

    console.log(`Found ${expiredUsers?.length || 0} users with expired validity`)

    if (!expiredUsers || expiredUsers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No expired users found',
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update all expired users to is_valid = false
    const userIds = expiredUsers.map(u => u.user_id)
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        is_valid: false,
        status_color: 'red' // Also update status color to indicate suspended
      })
      .in('user_id', userIds)

    if (updateError) {
      console.error('Error updating expired users:', updateError)
      throw updateError
    }

    console.log(`Successfully suspended ${userIds.length} users`)

    // Log notifications for each suspended user
    for (const user of expiredUsers) {
      console.log(`NOTIFICATION: User ${user.email || user.user_id} - Your VALID status has expired. Access Suspended.`)
      
      // Here you could integrate with an email service to send actual notifications
      // Example: await sendEmail(user.email, 'VALID Status Expired', 'Your VALID status has expired. Access Suspended.')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${userIds.length} expired users`,
        processed: userIds.length,
        suspendedUsers: expiredUsers.map(u => ({
          userId: u.user_id,
          email: u.email,
          expiredAt: u.validity_expires_at
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in workforce validity monitor:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})