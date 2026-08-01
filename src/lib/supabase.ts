import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./constants";

export type HelpRequest = {
  id: string;
  display_name: string | null;
  help_type: string;
  public_message: string | null;
  status: string;
  published_at: string;
};

export type PastorPostType = "versiculo" | "anuncio" | "mensaje";

export type PublicPastorPost = {
  id: string;
  content: string;
  post_type: PastorPostType;
  reference: string | null;
  published_at: string;
};

export type PastorPost = PublicPastorPost & {
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

async function supabaseRpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    if (response.status === 401 || detail.includes("unauthorized")) {
      throw new Error("unauthorized");
    }
    throw new Error(`Supabase RPC error: ${response.status}`);
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

export async function fetchPublicPastorPosts(): Promise<PublicPastorPost[]> {
  if (!isConfigured || (typeof navigator !== "undefined" && !navigator.onLine)) {
    return [];
  }

  try {
    return await supabaseFetch<PublicPastorPost[]>(
      "public_pastor_posts?select=id,content,post_type,reference,published_at&order=published_at.desc"
    );
  } catch {
    return [];
  }
}

export async function verifyPastorAdmin(token: string): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    return Boolean(await supabaseRpc<boolean>("verify_pastor_admin", { p_token: token }));
  } catch {
    return false;
  }
}

export async function listPastorPostsAdmin(token: string): Promise<PastorPost[]> {
  return supabaseRpc<PastorPost[]>("list_pastor_posts_admin", { p_token: token });
}

export async function createPastorPost(
  token: string,
  payload: {
    content: string;
    post_type: PastorPostType;
    reference?: string | null;
    is_active?: boolean;
    published_at?: string | null;
  }
): Promise<PastorPost> {
  return supabaseRpc<PastorPost>("create_pastor_post", {
    p_token: token,
    p_content: payload.content,
    p_post_type: payload.post_type,
    p_reference: payload.reference ?? null,
    p_is_active: payload.is_active ?? true,
    p_published_at: payload.published_at ?? new Date().toISOString(),
  });
}

export async function updatePastorPost(
  token: string,
  id: string,
  payload: {
    content: string;
    post_type: PastorPostType;
    reference?: string | null;
    is_active?: boolean;
    published_at?: string | null;
  }
): Promise<PastorPost> {
  return supabaseRpc<PastorPost>("update_pastor_post", {
    p_token: token,
    p_id: id,
    p_content: payload.content,
    p_post_type: payload.post_type,
    p_reference: payload.reference ?? null,
    p_is_active: payload.is_active ?? true,
    p_published_at: payload.published_at ?? null,
  });
}

export async function deletePastorPost(token: string, id: string): Promise<boolean> {
  return Boolean(await supabaseRpc<boolean>("delete_pastor_post", { p_token: token, p_id: id }));
}
