import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";

export type HelpRequest = {
  id: string;
  display_name: string | null;
  help_type: string;
  public_message: string | null;
  status: string;
  published_at: string;
};

const isConfigured = SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 20;

async function supabaseFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.method === "POST" ? "return=minimal" : "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchPublicHelpRequests(): Promise<HelpRequest[]> {
  if (!isConfigured || (typeof navigator !== "undefined" && !navigator.onLine)) {
    return [];
  }

  return supabaseFetch<HelpRequest[]>(
    "public_help_requests?select=id,display_name,help_type,public_message,status,published_at&order=published_at.desc"
  );
}

export async function saveHelpRequest(payload: {
  name: string;
  phone: string | null;
  help_type: string;
  message_private: string;
}): Promise<boolean> {
  if (!isConfigured || (typeof navigator !== "undefined" && !navigator.onLine)) {
    return false;
  }

  try {
    await supabaseFetch("help_requests", {
      method: "POST",
      body: JSON.stringify([
        {
          name: payload.name,
          phone: payload.phone,
          email: null,
          help_type: payload.help_type,
          message_private: payload.message_private,
        },
      ]),
    });
    return true;
  } catch {
    return false;
  }
}
