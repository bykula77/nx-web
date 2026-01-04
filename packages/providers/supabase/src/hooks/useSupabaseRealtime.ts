import { useEffect, useState, useCallback } from 'react';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useSupabase } from './useSupabase';
import type { Database } from '../types/database.types';

type TableName = keyof Database['public']['Tables'];

export interface UseSupabaseRealtimeOptions<T> {
  /**
   * Table name to subscribe to
   */
  table: TableName;

  /**
   * Event types to listen for
   */
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';

  /**
   * Filter (e.g., "user_id=eq.123")
   */
  filter?: string;

  /**
   * Callback when data changes
   */
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: { old: T; new: T }) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;

  /**
   * Enable/disable subscription
   */
  enabled?: boolean;
}

/**
 * Supabase realtime subscription hook
 */
export function useSupabaseRealtime<T = unknown>({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: UseSupabaseRealtimeOptions<T>) {
  const supabase = useSupabase();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = useCallback(() => {
    if (!enabled) return;

    const channelName = `${table}-${event}-${filter || 'all'}`;

    const newChannel = supabase
      .channel(channelName)
      .on<T>(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table: table as string,
          filter,
        },
        (payload) => {
          // Call general onChange handler
          onChange?.(payload as RealtimePostgresChangesPayload<T>);

          // Call specific handlers
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new as T);
              break;
            case 'UPDATE':
              onUpdate?.({
                old: payload.old as T,
                new: payload.new as T,
              });
              break;
            case 'DELETE':
              onDelete?.(payload.old as T);
              break;
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    setChannel(newChannel);
  }, [supabase, table, event, filter, enabled, onChange, onInsert, onUpdate, onDelete]);

  const unsubscribe = useCallback(() => {
    if (channel) {
      supabase.removeChannel(channel);
      setChannel(null);
      setIsSubscribed(false);
    }
  }, [supabase, channel]);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return {
    isSubscribed,
    channel,
    unsubscribe,
    resubscribe: subscribe,
  };
}

