// User Sync Hook
// Handles user synchronization between be-valid and ghost-pass databases

import { useCallback } from 'react';
import { syncUserToGhostPass, verifyUserSync } from '../../api/auth/user-sync-service';

export const useUserSync = () => {
  /**
   * Sync a newly created be-valid user to ghost-pass
   */
  const syncNewUserToGhostPass = useCallback(
    async (userId: string, userData: any) => {
      try {
        const result = await syncUserToGhostPass(userId, userData);
        console.log('User synced to ghost-pass:', result);
        return result;
      } catch (error) {
        console.error('Failed to sync user to ghost-pass:', error);
        throw error;
      }
    },
    []
  );

  /**
   * Verify user is synced across both databases
   */
  const checkUserSync = useCallback(async (userId: string) => {
    try {
      const syncStatus = await verifyUserSync(userId);
      return syncStatus;
    } catch (error) {
      console.error('Failed to verify user sync:', error);
      throw error;
    }
  }, []);

  return {
    syncNewUserToGhostPass,
    checkUserSync,
  };
};
