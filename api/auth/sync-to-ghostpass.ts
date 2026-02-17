// Sync to Ghost Pass API Endpoint
// Syncs newly created be-valid users to ghost-pass database

import { syncUserToGhostPass } from './user-sync-service';

export default async (req: any, res: any) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, fullName, role, venueId, eventId } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }

    // Sync user to ghost-pass
    const syncResult = await syncUserToGhostPass(userId, {
      email,
      full_name: fullName,
      role: role || 'USER',
      venue_id: venueId,
      event_id: eventId,
      created_at: new Date().toISOString(),
    });

    if (!syncResult) {
      return res.status(500).json({ 
        error: 'Failed to sync user to ghost-pass',
        synced: false 
      });
    }

    return res.status(200).json({
      success: true,
      synced: true,
      user: syncResult,
    });
  } catch (error: any) {
    console.error('Sync to ghost-pass error:', error);
    return res.status(500).json({ 
      error: error.message || 'Sync failed',
      synced: false 
    });
  }
};
