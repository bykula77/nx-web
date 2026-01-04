import { useContext } from 'react';
import { SupabaseContext } from '../context/SupabaseProvider';

/**
 * Hook to access Supabase client from context
 * Must be used within SupabaseProvider
 */
export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return context.client;
}

