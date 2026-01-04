'use client';

import { createContext, useMemo, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '../client/supabase.client';
import type { Database } from '../types/database.types';

/**
 * Supabase context value
 */
interface SupabaseContextValue {
  client: SupabaseClient<Database>;
}

/**
 * Supabase context
 */
export const SupabaseContext = createContext<SupabaseContextValue | null>(null);

/**
 * Supabase provider props
 */
interface SupabaseProviderProps {
  children: ReactNode;
}

/**
 * Supabase provider component
 * Provides Supabase client to the React component tree
 *
 * @example
 * // In your app layout
 * import { SupabaseProvider } from '@nx-web/supabase';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <SupabaseProvider>
 *       {children}
 *     </SupabaseProvider>
 *   );
 * }
 */
export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const value = useMemo<SupabaseContextValue>(() => {
    return {
      client: getSupabaseBrowserClient(),
    };
  }, []);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

