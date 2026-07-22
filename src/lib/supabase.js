const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yjhnqxubicaglqfroiqk.supabase.co";
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Ab-n3U4ens-djPBRbrIyhQ_geFdri1b";

const isConfigured =
  supabaseUrl.startsWith("https://") &&
  !supabaseUrl.includes("YOUR_PROJECT_ID") &&
  !supabasePublishableKey.includes("YOUR_SUPABASE");

let clientPromise;

export function getSupabaseClient() {
  if (!isConfigured) {
    return Promise.resolve(null);
  }

  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(supabaseUrl, supabasePublishableKey)
  );

  return clientPromise;
}
