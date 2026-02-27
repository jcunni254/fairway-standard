/**
 * Clerk-aware Supabase client for The Fairway Standard.
 *
 * Use this client when you have access to a Clerk session (client or server).
 * It passes Clerk's JWT to Supabase so RLS policies can restrict access by user_id.
 *
 * Setup: Clerk Dashboard → Supabase integration, then Supabase Auth → Add Clerk provider.
 * See: https://clerk.com/docs/guides/development/integrations/databases/supabase
 */

import { createClient } from "@supabase/supabase-js";

type GetToken = () => Promise<string | null>;

export function createClerkSupabaseClient(getToken: GetToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => await getToken(),
    }
  );
}
