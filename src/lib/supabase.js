import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yjhnqxubicaglqfroiqk.supabase.co";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Ab-n3U4ens-djPBRbrIyhQ_geFdri1b";

const isConfigured =
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("YOUR_PROJECT_ID") &&
  !supabasePublishableKey.includes("YOUR_SUPABASE");

export const supabaseClient = isConfigured ? createClient(supabaseUrl, supabasePublishableKey) : null;

export const isSupabaseConfigured = isConfigured;
