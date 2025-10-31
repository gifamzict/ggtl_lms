// Supabase has been removed - this project now uses Laravel API
// This file is kept for backwards compatibility but does nothing

// Dummy supabase object to prevent errors in files that haven't been migrated yet
export const supabase = {
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: new Error('Supabase removed') }),
    update: () => ({ data: null, error: new Error('Supabase removed') }),
    delete: () => ({ data: null, error: new Error('Supabase removed') }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    signIn: () => Promise.resolve({ data: null, error: new Error('Supabase removed') }),
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase removed') }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Supabase removed') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};
