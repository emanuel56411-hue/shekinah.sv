"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { BibleIcon } from "@/components/icons/bible-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createPastorPost,
  deletePastorPost,
  listPastorPostsAdmin,
  updatePastorPost,
  verifyPastorAdmin,
  type PastorPost,
  type PastorPostType,
} from "@/lib/supabase";

const ADMIN_TOKEN_KEY = "shekinah-pastor-admin";

const TYPE_OPTIONS: { value: PastorPostType; label: string }[] = [
  { value: "versiculo", label: "Versículo" },
  { value: "anuncio", label: "Anuncio" },
  { value: "mensaje", label: "Mensaje" },
];

function emptyForm() {
  return {
    content: "",
    post_type: "mensaje" as PastorPostType,
    reference: "",
    is_active: true,
  };
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("es-SV", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value.slice(0, 16);
  }
}

export default function AdminPastorPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<PastorPost[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const loadPosts = async (adminToken: string) => {
    setLoadingList(true);
    try {
      const rows = await listPastorPostsAdmin(adminToken);
      setPosts(rows);
    } catch {
      setStatus({ type: "error", text: "No se pudieron cargar las publicaciones." });
      setPosts([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
    if (!saved) {
      setChecking(false);
      return;
    }

    verifyPastorAdmin(saved)
      .then(async (ok) => {
        if (!ok) {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          setChecking(false);
          return;
        }
        setToken(saved);
        setAuthed(true);
        await loadPosts(saved);
        setChecking(false);
      })
      .catch(() => {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setChecking(false);
      });
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    const ok = await verifyPastorAdmin(password.trim());
    if (!ok) {
      setStatus({ type: "error", text: "Contraseña incorrecta." });
      return;
    }
    const next = password.trim();
    sessionStorage.setItem(ADMIN_TOKEN_KEY, next);
    setToken(next);
    setAuthed(true);
    setPassword("");
    await loadPosts(next);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setPosts([]);
    setEditingId(null);
    setForm(emptyForm());
  };

  const startEdit = (post: PastorPost) => {
    setEditingId(post.id);
    setForm({
      content: post.content,
      post_type: post.post_type,
      reference: post.reference || "",
      is_active: post.is_active,
    });
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const content = form.content.trim();
    if (content.length < 1) {
      setStatus({ type: "error", text: "Escribe el contenido de la publicación." });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        content,
        post_type: form.post_type,
        reference: form.reference.trim() || null,
        is_active: form.is_active,
      };

      if (editingId) {
        await updatePastorPost(token, editingId, payload);
        setStatus({ type: "success", text: "Publicación actualizada." });
      } else {
        await createPastorPost(token, payload);
        setStatus({ type: "success", text: "Publicación creada." });
      }

      resetForm();
      await loadPosts(token);
    } catch (error) {
      const message = error instanceof Error && error.message === "unauthorized"
        ? "Sesión no válida. Vuelve a iniciar sesión."
        : "No se pudo guardar. Revisa la conexión o el esquema de Supabase.";
      setStatus({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    setStatus(null);
    try {
      await deletePastorPost(token, id);
      if (editingId === id) resetForm();
      await loadPosts(token);
      setStatus({ type: "success", text: "Publicación eliminada." });
    } catch {
      setStatus({ type: "error", text: "No se pudo eliminar la publicación." });
    }
  };

  const typeLabel = (type: PastorPostType) =>
    TYPE_OPTIONS.find((item) => item.value === type)?.label || type;

  return (
    <main className="min-h-[70vh] pt-[5.5rem] pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Panel pastoral</p>
            <h1 className="section-title">Publicaciones</h1>
            <p className="section-desc">
              Publica versículos, anuncios o mensajes. Solo aparecen en el sitio si están activos.
            </p>
          </div>
          <BibleIcon className="mt-2 h-10 w-10 text-shekinah" strokeWidth={1.5} />
        </div>

        {checking ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Verificando acceso...
            </CardContent>
          </Card>
        ) : !authed ? (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Acceso del pastor</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="admin-password">
                    Contraseña
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="control-inset h-10 bg-white"
                  />
                </div>
                {status && (
                  <p className={`text-sm ${status.type === "error" ? "text-destructive" : "text-green-700"}`}>
                    {status.text}
                  </p>
                )}
                <Button type="submit" className="btn-skeuo h-11 w-full">
                  Entrar
                </Button>
                <p className="text-xs text-muted-foreground">
                  Contraseña inicial tras configurar Supabase: <code>shekinah-pastor</code>
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/#palabra" className="text-sm font-medium text-shekinah underline-offset-4 hover:underline">
                Ver sección en el sitio
              </Link>
              <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editingId ? "Editar publicación" : "Nueva publicación"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSave}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select
                      value={form.post_type}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, post_type: (value as PastorPostType) || "mensaje" }))
                      }
                    >
                      <SelectTrigger className="control-inset h-10 w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="post-content">
                      Contenido
                    </label>
                    <Textarea
                      id="post-content"
                      value={form.content}
                      onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                      rows={5}
                      maxLength={4000}
                      required
                      placeholder="Escribe o pega el versículo, anuncio o mensaje..."
                      className="control-inset bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="post-reference">
                      Cita / referencia (opcional)
                    </label>
                    <Input
                      id="post-reference"
                      value={form.reference}
                      onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))}
                      placeholder="Ej: Juan 3:16"
                      maxLength={120}
                      className="control-inset h-10 bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="h-4 w-4 accent-[#65101a]"
                    />
                    Activo (visible en el sitio)
                  </label>

                  {status && (
                    <p className={`text-sm ${status.type === "error" ? "text-destructive" : "text-green-700"}`}>
                      {status.text}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={saving} className="btn-skeuo h-11 min-w-36">
                      {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar"}
                    </Button>
                    {editingId ? (
                      <Button type="button" variant="outline" className="h-11" onClick={resetForm}>
                        Cancelar edición
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            <section className="space-y-3">
              <h2 className="font-heading text-xl font-semibold">Publicaciones guardadas</h2>
              {loadingList ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : posts.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    Aún no hay publicaciones. Crea la primera con el formulario de arriba.
                  </CardContent>
                </Card>
              ) : (
                <ul className="space-y-3">
                  {posts.map((post) => (
                    <li key={post.id}>
                      <Card className="shadow-card">
                        <CardContent className="space-y-3 p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-shekinah/10 text-shekinah">
                              {typeLabel(post.post_type)}
                            </Badge>
                            <Badge variant="secondary" className={post.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                              {post.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
                          </div>
                          <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
                          {post.reference ? (
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-shekinah">
                              {post.reference}
                            </p>
                          ) : null}
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => startEdit(post)}>
                              <Pencil className="h-3.5 w-3.5" />
                              Editar
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="gap-1.5"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Eliminar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
