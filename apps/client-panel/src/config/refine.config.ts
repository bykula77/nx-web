import { dataProvider as supabaseDataProvider, liveProvider } from '@refinedev/supabase';
import type { AuthProvider, DataProvider } from '@refinedev/core';
import { createClient } from '@supabase/supabase-js';

// Supabase client for Refine
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Refine data provider using Supabase
 */
export const dataProvider: DataProvider = supabaseDataProvider(supabaseClient);

/**
 * Refine live provider for realtime updates
 */
export const liveDataProvider = liveProvider(supabaseClient);

/**
 * Refine auth provider using Supabase Auth
 */
export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.message,
        },
      };
    }

    if (data?.user) {
      return {
        success: true,
        redirectTo: '/dashboard',
      };
    }

    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'Giriş başarısız',
      },
    };
  },

  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error: {
          name: 'LogoutError',
          message: error.message,
        },
      };
    }

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    const { data } = await supabaseClient.auth.getSession();

    if (data?.session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },

  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || data.user.email,
        email: data.user.email,
        avatar: data.user.user_metadata?.avatar_url,
      };
    }

    return null;
  },

  getPermissions: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return data.user.app_metadata?.role || 'customer';
    }

    return null;
  },

  onError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      return {
        logout: true,
        redirectTo: '/login',
      };
    }

    return { error };
  },
};

/**
 * Refine options
 */
export const refineOptions = {
  syncWithLocation: true,
  warnWhenUnsavedChanges: true,
  useNewQueryKeys: true,
  projectId: 'nx-web-client-panel',
  title: {
    text: 'Müşteri Paneli',
    icon: null,
  },
};

