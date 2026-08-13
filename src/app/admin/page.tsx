"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { BibleIcon } from "@/components/icons/bible-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PastorMediaKind } from "@/lib/pastor-media";
import { isLikelyImageUrl, toVideoEmbedUrl } from "@/lib/pastor-media";
import {
  createPastorPost,
  deleteGalleryImageFromStorage,
  deletePastorPost,
  deleteSiteGalleryItem,
  deleteSiteCalendarEvent,
  deleteSiteSchedule,
  listPastorPostsAdmin,
  listSiteGalleryItemsAdmin,
  listSiteCalendarEventsAdmin,
  listSiteSchedulesAdmin,
  updatePastorPost,
  uploadGalleryImage,
  upsertSiteCalendarEvent,
  upsertSiteGalleryItem,
  upsertSiteSchedule,
  uploadPastorImage,
  verifyPastorAdmin,
  type PastorPost,
  type PastorPostType,
  type SiteCalendarEvent,
  type SiteCalendarEventPayload,
  type SiteGalleryItem,
  type SiteGalleryItemPayload,
  type SiteSchedule,
  type SiteSchedulePayload,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

const ADMIN_TOKEN_KEY = "shekinah-pastor-admin";

type AdminTab = "palabra" | "horarios" | "calendario" | "galeria";

const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: "palabra", label: "Palabra del Día" },
  { id: "horarios", label: "Horarios" },
  { id: "calendario", label: "Calendario" },
  { id: "galeria", label: "Galería" },
];

const DAY_OPTIONS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

const TYPE_OPTIONS: { value: PastorPostType; label: string }[] = [
  { value: "versiculo", label: "Versículo" },
  { value: "anuncio", label: "Anuncio" },
  { value: "mensaje", label: "Mensaje" },
  { value: "oracion", label: "Oración" },
  { value: "foto", label: "Foto" },
  { value: "video", label: "Video" },
];

function emptyForm() {
  return {
    content: "",
    post_type: "mensaje" as PastorPostType,
    reference: "",
    is_active: true,
    media_kind: "none" as PastorMediaKind,
    media_url: "",
  };
}

function emptyScheduleForm(): SiteSchedulePayload {
  return {
    id: null,
    day_of_week: 2,
    day_label: "Martes",
    title: "",
    start_time: "19:00",
    end_time: "20:30",
    is_active: true,
    sort_order: 0,
  };
}

function emptyCalendarForm(): SiteCalendarEventPayload {
  return {
    id: null,
    event_date: new Date().toISOString().slice(0, 10),
    title: "",
    event_time: "",
    description: "",
    is_active: true,
    sort_order: 0,
  };
}

function emptyGalleryForm(): SiteGalleryItemPayload {
  return {
    id: null,
    image_url: "",
    title: "",
    tag: "",
    alt: "",
    width: null,
    height: null,
    is_active: true,
    sort_order: 0,
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
  const [activeTab, setActiveTab] = useState<AdminTab>("palabra");
  const [checking, setChecking] = useState(true);
  const [posts, setPosts] = useState<PastorPost[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [schedules, setSchedules] = useState<SiteSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<SiteCalendarEvent[]>([]);
  const [loadingCalendarEvents, setLoadingCalendarEvents] = useState(false);
  const [galleryItems, setGalleryItems] = useState<SiteGalleryItem[]>([]);
  const [loadingGalleryItems, setLoadingGalleryItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scheduleEditingId, setScheduleEditingId] = useState<string | null>(null);
  const [calendarEditingId, setCalendarEditingId] = useState<string | null>(null);
  const [galleryEditingId, setGalleryEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [scheduleForm, setScheduleForm] = useState(emptyScheduleForm());
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm());
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm());

  const loadPosts = useCallback(async (adminToken: string) => {
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
  }, []);

  const loadSchedules = useCallback(async (adminToken: string) => {
    setLoadingSchedules(true);
    try {
      setSchedules(await listSiteSchedulesAdmin(adminToken));
    } catch {
      setSchedules([]);
      setStatus({ type: "error", text: "No se pudieron cargar horarios. Ejecuta supabase-site-content.sql." });
    } finally {
      setLoadingSchedules(false);
    }
  }, []);

  const loadCalendarEvents = useCallback(async (adminToken: string) => {
    setLoadingCalendarEvents(true);
    try {
      setCalendarEvents(await listSiteCalendarEventsAdmin(adminToken));
    } catch {
      setCalendarEvents([]);
      setStatus({ type: "error", text: "No se pudieron cargar eventos. Ejecuta supabase-site-content.sql." });
    } finally {
      setLoadingCalendarEvents(false);
    }
  }, []);

  const loadGalleryItems = useCallback(async (adminToken: string) => {
    setLoadingGalleryItems(true);
    try {
      setGalleryItems(await listSiteGalleryItemsAdmin(adminToken));
    } catch {
      setGalleryItems([]);
      setStatus({ type: "error", text: "No se pudieron cargar fotos. Ejecuta supabase-gallery.sql." });
    } finally {
      setLoadingGalleryItems(false);
    }
  }, []);

  const loadAdminData = useCallback(async (adminToken: string) => {
    await Promise.all([
      loadPosts(adminToken),
      loadSchedules(adminToken),
      loadCalendarEvents(adminToken),
      loadGalleryItems(adminToken),
    ]);
  }, [loadCalendarEvents, loadGalleryItems, loadPosts, loadSchedules]);

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
        await loadAdminData(saved);
        setChecking(false);
      })
      .catch(() => {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setChecking(false);
      });
  }, [loadAdminData]);

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
    await loadAdminData(next);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setPosts([]);
    setSchedules([]);
    setCalendarEvents([]);
    setGalleryItems([]);
    setEditingId(null);
    setScheduleEditingId(null);
    setCalendarEditingId(null);
    setGalleryEditingId(null);
    setForm(emptyForm());
    setScheduleForm(emptyScheduleForm());
    setCalendarForm(emptyCalendarForm());
    setGalleryForm(emptyGalleryForm());
  };

  const startEdit = (post: PastorPost) => {
    setEditingId(post.id);
    setForm({
      content: post.content,
      post_type: post.post_type,
      reference: post.reference || "",
      is_active: post.is_active,
      media_kind: post.media_kind || "none",
      media_url: post.media_url || "",
    });
    setStatus(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleImageFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const url = await uploadPastorImage(token, file);
      setForm((prev) => ({
        ...prev,
        media_kind: "image",
        media_url: url,
        post_type: prev.post_type === "mensaje" ? "foto" : prev.post_type,
      }));
      setStatus({ type: "success", text: "Foto subida. Ya puedes publicar." });
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      const text =
        code === "too_large"
          ? "La imagen supera 5 MB."
          : code === "invalid_type"
            ? "Solo se permiten JPG, PNG, WEBP o GIF."
            : code === "unauthorized"
              ? "Sesión no válida. Vuelve a iniciar sesión."
              : "No se pudo subir la imagen. Ejecuta supabase-pastor-media-upgrade.sql en Supabase.";
      setStatus({ type: "error", text });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    const content = form.content.trim();
    let mediaKind = form.media_kind;
    let mediaUrl = form.media_url.trim();

    if (form.post_type === "video" || mediaKind === "video") {
      const embed = toVideoEmbedUrl(mediaUrl);
      if (!embed && mediaUrl) {
        setStatus({
          type: "error",
          text: "Pega un enlace válido de YouTube, Vimeo o Facebook.",
        });
        return;
      }
      if (embed) {
        mediaKind = "video";
        mediaUrl = embed;
      }
    } else if (mediaUrl && mediaKind !== "image") {
      if (isLikelyImageUrl(mediaUrl) || mediaUrl.includes("/pastor-media/")) {
        mediaKind = "image";
      }
    }

    if (mediaKind === "none") mediaUrl = "";

    if (!content && !mediaUrl) {
      setStatus({ type: "error", text: "Escribe un texto o agrega una foto/video." });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const payload = {
        content: content || (mediaKind === "image" ? "Foto" : mediaKind === "video" ? "Video" : ""),
        post_type: form.post_type,
        reference: form.reference.trim() || null,
        is_active: form.is_active,
        media_url: mediaUrl || null,
        media_kind: mediaUrl ? mediaKind : ("none" as PastorMediaKind),
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
      const message =
        error instanceof Error && error.message === "unauthorized"
          ? "Sesión no válida. Vuelve a iniciar sesión."
          : "No se pudo guardar. Ejecuta supabase-pastor-media-upgrade.sql si aún no lo hiciste.";
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

  const startScheduleEdit = (schedule: SiteSchedule) => {
    setScheduleEditingId(schedule.id);
    setScheduleForm({
      id: schedule.id,
      day_of_week: schedule.day_of_week,
      day_label: schedule.day_label,
      title: schedule.title,
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
      is_active: schedule.is_active,
      sort_order: schedule.sort_order,
    });
    setStatus(null);
  };

  const resetScheduleForm = () => {
    setScheduleEditingId(null);
    setScheduleForm(emptyScheduleForm());
  };

  const handleScheduleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!scheduleForm.title.trim() || !scheduleForm.day_label.trim()) {
      setStatus({ type: "error", text: "Completa el día y nombre de la actividad." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await upsertSiteSchedule(token, {
        ...scheduleForm,
        id: scheduleEditingId,
        title: scheduleForm.title.trim(),
        day_label: scheduleForm.day_label.trim(),
      });
      setStatus({ type: "success", text: scheduleEditingId ? "Horario actualizado." : "Horario creado." });
      resetScheduleForm();
      await loadSchedules(token);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error instanceof Error && error.message === "unauthorized"
            ? "Sesión no válida. Vuelve a iniciar sesión."
            : "No se pudo guardar el horario. Ejecuta supabase-site-content.sql.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este horario?")) return;
    setStatus(null);
    try {
      await deleteSiteSchedule(token, id);
      if (scheduleEditingId === id) resetScheduleForm();
      await loadSchedules(token);
      setStatus({ type: "success", text: "Horario eliminado." });
    } catch {
      setStatus({ type: "error", text: "No se pudo eliminar el horario." });
    }
  };

  const startCalendarEdit = (event: SiteCalendarEvent) => {
    setCalendarEditingId(event.id);
    setCalendarForm({
      id: event.id,
      event_date: event.event_date,
      title: event.title,
      event_time: event.event_time,
      description: event.description,
      is_active: event.is_active,
      sort_order: event.sort_order,
    });
    setStatus(null);
  };

  const resetCalendarForm = () => {
    setCalendarEditingId(null);
    setCalendarForm(emptyCalendarForm());
  };

  const handleCalendarSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!calendarForm.event_date || !calendarForm.title.trim()) {
      setStatus({ type: "error", text: "Completa la fecha y el nombre del evento." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await upsertSiteCalendarEvent(token, {
        ...calendarForm,
        id: calendarEditingId,
        title: calendarForm.title.trim(),
        event_time: calendarForm.event_time.trim(),
        description: calendarForm.description.trim(),
      });
      setStatus({ type: "success", text: calendarEditingId ? "Evento actualizado." : "Evento creado." });
      resetCalendarForm();
      await loadCalendarEvents(token);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error instanceof Error && error.message === "unauthorized"
            ? "Sesión no válida. Vuelve a iniciar sesión."
            : "No se pudo guardar el evento. Ejecuta supabase-site-content.sql.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCalendarDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este evento del calendario?")) return;
    setStatus(null);
    try {
      await deleteSiteCalendarEvent(token, id);
      if (calendarEditingId === id) resetCalendarForm();
      await loadCalendarEvents(token);
      setStatus({ type: "success", text: "Evento eliminado." });
    } catch {
      setStatus({ type: "error", text: "No se pudo eliminar el evento." });
    }
  };

  const handleGalleryFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const url = await uploadGalleryImage(token, file);
      setGalleryForm((prev) => ({
        ...prev,
        image_url: url,
        alt: prev.alt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
      }));
      setStatus({ type: "success", text: "Foto subida. Guarda la galería para publicarla." });
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      const text =
        code === "invalid_type"
          ? "Solo puedes subir imágenes."
          : code === "too_large"
            ? "La imagen pesa más de 5 MB."
            : code === "unauthorized"
              ? "Sesión no válida. Vuelve a iniciar sesión."
              : "No se pudo subir la foto. Verifica supabase-pastor-media-upgrade.sql.";
      setStatus({ type: "error", text });
    } finally {
      setUploading(false);
    }
  };

  const startGalleryEdit = (item: SiteGalleryItem) => {
    setGalleryEditingId(item.id);
    setGalleryForm({
      id: item.id,
      image_url: item.image_url,
      title: item.title,
      tag: item.tag,
      alt: item.alt,
      width: item.width,
      height: item.height,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setStatus(null);
  };

  const resetGalleryForm = () => {
    setGalleryEditingId(null);
    setGalleryForm(emptyGalleryForm());
  };

  const handleGallerySave = async (event: FormEvent) => {
    event.preventDefault();
    if (!galleryForm.image_url.trim() || !galleryForm.title.trim()) {
      setStatus({ type: "error", text: "Completa la foto y el título." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await upsertSiteGalleryItem(token, {
        ...galleryForm,
        id: galleryEditingId,
        image_url: galleryForm.image_url.trim(),
        title: galleryForm.title.trim(),
        tag: galleryForm.tag?.trim() || "",
        alt: galleryForm.alt?.trim() || galleryForm.title.trim(),
      });
      setStatus({ type: "success", text: galleryEditingId ? "Foto actualizada." : "Foto agregada." });
      resetGalleryForm();
      await loadGalleryItems(token);
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error instanceof Error && error.message === "unauthorized"
            ? "Sesión no válida. Vuelve a iniciar sesión."
            : "No se pudo guardar la foto. Ejecuta supabase-gallery.sql.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar esta foto de la galería?")) return;
    setStatus(null);
    try {
      const deletedUrl = await deleteSiteGalleryItem(token, id);
      if (deletedUrl) {
        await deleteGalleryImageFromStorage(token, deletedUrl).catch(() => false);
      }
      if (galleryEditingId === id) resetGalleryForm();
      await loadGalleryItems(token);
      setStatus({ type: "success", text: "Foto eliminada." });
    } catch {
      setStatus({ type: "error", text: "No se pudo eliminar la foto." });
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
              Publica versículos, oraciones, fotos, videos o anuncios. Solo aparecen en el sitio si están activos.
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

            <div className="flex flex-wrap gap-2 rounded-[14px] bg-black/[0.03] p-1">
              {ADMIN_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "rounded-[12px] px-3 py-2 text-sm font-semibold transition-colors",
                    activeTab === tab.id
                      ? "bg-[#65101a] text-white"
                      : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "palabra" ? (
              <>
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
                      onValueChange={(value) => {
                        const next = (value as PastorPostType) || "mensaje";
                        setForm((prev) => {
                          let mediaKind = prev.media_kind;
                          let mediaUrl = prev.media_url;

                          if (next === "video") {
                            mediaKind = "video";
                            if (prev.media_kind !== "video") mediaUrl = "";
                          } else if (next === "foto") {
                            mediaKind = "image";
                          } else if (prev.media_kind === "video") {
                            mediaKind = "none";
                            mediaUrl = "";
                          }

                          return {
                            ...prev,
                            post_type: next,
                            media_kind: mediaKind,
                            media_url: mediaUrl,
                          };
                        });
                      }}
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
                      Texto / descripción
                    </label>
                    <Textarea
                      id="post-content"
                      value={form.content}
                      onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                      rows={5}
                      maxLength={4000}
                      placeholder="Escribe el mensaje, oración, pie de foto o descripción del video..."
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

                  <div className="space-y-3 rounded-[14px] border border-black/10 bg-black/[0.02] p-4">
                    <p className="text-sm font-medium">Foto o video</p>

                    {form.post_type === "video" || form.media_kind === "video" ? (
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground" htmlFor="video-url">
                          Enlace de YouTube, Vimeo o Facebook
                        </label>
                        <Input
                          id="video-url"
                          value={form.media_url}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              media_kind: "video",
                              media_url: e.target.value,
                            }))
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="control-inset h-10 bg-white"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground" htmlFor="image-file">
                            Subir foto (máx. 5 MB)
                          </label>
                          <Input
                            id="image-file"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            disabled={uploading}
                            onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
                            className="control-inset h-10 bg-white file:mr-3 file:border-0 file:bg-transparent file:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground" htmlFor="image-url">
                            O pega la URL de una imagen
                          </label>
                          <Input
                            id="image-url"
                            value={form.media_kind === "image" ? form.media_url : ""}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                media_kind: e.target.value.trim() ? "image" : "none",
                                media_url: e.target.value,
                              }))
                            }
                            placeholder="https://..."
                            className="control-inset h-10 bg-white"
                          />
                        </div>
                      </>
                    )}

                    {form.media_kind === "image" && form.media_url ? (
                      <div className="relative mt-2 rounded-xl border border-black/10 bg-black/5 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.media_url}
                          alt="Vista previa"
                          className="mx-auto h-auto max-h-72 w-auto max-w-full rounded-lg object-contain"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="absolute right-2 top-2"
                          onClick={() => setForm((prev) => ({ ...prev, media_kind: "none", media_url: "" }))}
                        >
                          Quitar foto
                        </Button>
                      </div>
                    ) : null}

                    {form.post_type !== "video" && form.media_kind !== "video" ? (
                      <button
                        type="button"
                        className="text-sm font-medium text-shekinah underline-offset-4 hover:underline"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            post_type: "video",
                            media_kind: "video",
                            media_url: "",
                          }))
                        }
                      >
                        Prefiero agregar un video por enlace
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-shekinah underline-offset-4 hover:underline"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            post_type: prev.post_type === "video" ? "foto" : prev.post_type,
                            media_kind: "none",
                            media_url: "",
                          }))
                        }
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        Prefiero agregar una foto
                      </button>
                    )}
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
                    <Button type="submit" disabled={saving || uploading} className="btn-skeuo h-11 min-w-36">
                      {uploading ? "Subiendo foto..." : saving ? "Guardando..." : editingId ? "Guardar cambios" : "Publicar"}
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
                            {post.media_kind !== "none" ? (
                              <Badge variant="secondary" className="bg-black/5">
                                {post.media_kind === "image" ? "Con foto" : "Con video"}
                              </Badge>
                            ) : null}
                            <Badge
                              variant="secondary"
                              className={post.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}
                            >
                              {post.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
                          </div>
                          {post.media_kind === "image" && post.media_url ? (
                            <div className="rounded-xl bg-black/5 p-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={post.media_url}
                                alt=""
                                className="mx-auto h-auto max-h-56 w-auto max-w-full rounded-lg object-contain"
                              />
                            </div>
                          ) : null}
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
              </>
            ) : activeTab === "horarios" ? (
              <section className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {scheduleEditingId ? <Pencil className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      {scheduleEditingId ? "Editar horario" : "Nuevo horario"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleScheduleSave}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Día</label>
                        <Select
                          value={String(scheduleForm.day_of_week)}
                          onValueChange={(value) => {
                            const day = Number(value);
                            const label = DAY_OPTIONS.find((item) => item.value === day)?.label || "Martes";
                            setScheduleForm((prev) => ({ ...prev, day_of_week: day, day_label: label }));
                          }}
                        >
                          <SelectTrigger className="control-inset h-10 w-full bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAY_OPTIONS.map((day) => (
                              <SelectItem key={day.value} value={String(day.value)}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="schedule-title">
                          Actividad
                        </label>
                        <Input
                          id="schedule-title"
                          value={scheduleForm.title}
                          onChange={(e) => setScheduleForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Estudio bíblico"
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="schedule-start">
                          Inicio
                        </label>
                        <Input
                          id="schedule-start"
                          type="time"
                          value={scheduleForm.start_time}
                          onChange={(e) => setScheduleForm((prev) => ({ ...prev, start_time: e.target.value }))}
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="schedule-end">
                          Fin
                        </label>
                        <Input
                          id="schedule-end"
                          type="time"
                          value={scheduleForm.end_time}
                          onChange={(e) => setScheduleForm((prev) => ({ ...prev, end_time: e.target.value }))}
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="schedule-order">
                          Orden
                        </label>
                        <Input
                          id="schedule-order"
                          type="number"
                          value={scheduleForm.sort_order ?? 0}
                          onChange={(e) =>
                            setScheduleForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))
                          }
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-medium sm:pt-8">
                        <input
                          type="checkbox"
                          checked={scheduleForm.is_active ?? true}
                          onChange={(e) => setScheduleForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                          className="h-4 w-4 accent-[#65101a]"
                        />
                        Activo en el sitio
                      </label>

                      {status && (
                        <p className={`text-sm sm:col-span-2 ${status.type === "error" ? "text-destructive" : "text-green-700"}`}>
                          {status.text}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 sm:col-span-2">
                        <Button type="submit" disabled={saving} className="btn-skeuo h-11 min-w-36">
                          {saving ? "Guardando..." : scheduleEditingId ? "Guardar horario" : "Crear horario"}
                        </Button>
                        {scheduleEditingId ? (
                          <Button type="button" variant="outline" className="h-11" onClick={resetScheduleForm}>
                            Cancelar edición
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <section className="space-y-3">
                  <h2 className="font-heading text-xl font-semibold">Horarios guardados</h2>
                  {loadingSchedules ? (
                    <p className="text-sm text-muted-foreground">Cargando horarios...</p>
                  ) : schedules.length === 0 ? (
                    <Card className="shadow-card">
                      <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        Aún no hay horarios. Ejecuta el SQL o crea el primero.
                      </CardContent>
                    </Card>
                  ) : (
                    <ul className="space-y-3">
                      {schedules.map((schedule) => (
                        <li key={schedule.id}>
                          <Card className="shadow-card">
                            <CardContent className="space-y-3 p-5">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-shekinah/10 text-shekinah">
                                  {schedule.day_label}
                                </Badge>
                                <Badge variant="secondary" className={schedule.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                                  {schedule.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                              </div>
                              <div>
                                <p className="font-heading text-lg font-semibold">{schedule.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => startScheduleEdit(schedule)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                  Editar
                                </Button>
                                <Button type="button" size="sm" variant="destructive" className="gap-1.5" onClick={() => handleScheduleDelete(schedule.id)}>
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
              </section>
            ) : activeTab === "calendario" ? (
              <section className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {calendarEditingId ? <Pencil className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                      {calendarEditingId ? "Editar evento" : "Nuevo evento"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCalendarSave}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="event-date">
                          Fecha
                        </label>
                        <Input
                          id="event-date"
                          type="date"
                          value={calendarForm.event_date}
                          onChange={(e) => setCalendarForm((prev) => ({ ...prev, event_date: e.target.value }))}
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="event-time">
                          Hora
                        </label>
                        <Input
                          id="event-time"
                          value={calendarForm.event_time}
                          onChange={(e) => setCalendarForm((prev) => ({ ...prev, event_time: e.target.value }))}
                          placeholder="7:00 p.m."
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="event-title">
                          Nombre del evento
                        </label>
                        <Input
                          id="event-title"
                          value={calendarForm.title}
                          onChange={(e) => setCalendarForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Noche de oración"
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="event-description">
                          Descripción breve
                        </label>
                        <Textarea
                          id="event-description"
                          value={calendarForm.description}
                          onChange={(e) => setCalendarForm((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="control-inset bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="event-order">
                          Orden
                        </label>
                        <Input
                          id="event-order"
                          type="number"
                          value={calendarForm.sort_order ?? 0}
                          onChange={(e) =>
                            setCalendarForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))
                          }
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-medium sm:pt-8">
                        <input
                          type="checkbox"
                          checked={calendarForm.is_active ?? true}
                          onChange={(e) => setCalendarForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                          className="h-4 w-4 accent-[#65101a]"
                        />
                        Activo en el sitio
                      </label>

                      {status && (
                        <p className={`text-sm sm:col-span-2 ${status.type === "error" ? "text-destructive" : "text-green-700"}`}>
                          {status.text}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 sm:col-span-2">
                        <Button type="submit" disabled={saving} className="btn-skeuo h-11 min-w-36">
                          {saving ? "Guardando..." : calendarEditingId ? "Guardar evento" : "Crear evento"}
                        </Button>
                        {calendarEditingId ? (
                          <Button type="button" variant="outline" className="h-11" onClick={resetCalendarForm}>
                            Cancelar edición
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <section className="space-y-3">
                  <h2 className="font-heading text-xl font-semibold">Eventos guardados</h2>
                  {loadingCalendarEvents ? (
                    <p className="text-sm text-muted-foreground">Cargando eventos...</p>
                  ) : calendarEvents.length === 0 ? (
                    <Card className="shadow-card">
                      <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        Aún no hay eventos. Ejecuta el SQL o crea el primero.
                      </CardContent>
                    </Card>
                  ) : (
                    <ul className="space-y-3">
                      {calendarEvents.map((event) => (
                        <li key={event.id}>
                          <Card className="shadow-card">
                            <CardContent className="space-y-3 p-5">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="bg-shekinah/10 text-shekinah">
                                  {event.event_date}
                                </Badge>
                                <Badge variant="secondary" className={event.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                                  {event.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                              </div>
                              <div>
                                <p className="font-heading text-lg font-semibold">{event.title}</p>
                                <p className="text-sm font-medium text-shekinah">{event.event_time}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => startCalendarEdit(event)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                  Editar
                                </Button>
                                <Button type="button" size="sm" variant="destructive" className="gap-1.5" onClick={() => handleCalendarDelete(event.id)}>
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
              </section>
            ) : (
              <section className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {galleryEditingId ? <Pencil className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
                      {galleryEditingId ? "Editar foto" : "Nueva foto de galería"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleGallerySave}>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="gallery-file">
                          Subir foto
                        </label>
                        <Input
                          id="gallery-file"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          disabled={uploading}
                          onChange={(e) => handleGalleryFile(e.target.files?.[0] || null)}
                          className="control-inset h-10 bg-white file:mr-3 file:border-0 file:bg-transparent file:text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Máximo 5 MB por imagen.</p>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="gallery-url">
                          URL de la foto
                        </label>
                        <Input
                          id="gallery-url"
                          value={galleryForm.image_url}
                          onChange={(e) => setGalleryForm((prev) => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://... o /assets/fotos/..."
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      {galleryForm.image_url ? (
                        <div className="rounded-xl border border-black/10 bg-black/5 p-2 sm:col-span-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={galleryForm.image_url}
                            alt="Vista previa"
                            className="mx-auto h-auto max-h-72 w-auto max-w-full rounded-lg object-contain"
                          />
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="gallery-title">
                          Título
                        </label>
                        <Input
                          id="gallery-title"
                          value={galleryForm.title}
                          onChange={(e) => setGalleryForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Culto dominical"
                          required
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="gallery-tag">
                          Etiqueta
                        </label>
                        <Input
                          id="gallery-tag"
                          value={galleryForm.tag ?? ""}
                          onChange={(e) => setGalleryForm((prev) => ({ ...prev, tag: e.target.value }))}
                          placeholder="Culto"
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium" htmlFor="gallery-alt">
                          Texto alternativo
                        </label>
                        <Input
                          id="gallery-alt"
                          value={galleryForm.alt ?? ""}
                          onChange={(e) => setGalleryForm((prev) => ({ ...prev, alt: e.target.value }))}
                          placeholder="Describe brevemente la foto"
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="gallery-order">
                          Orden
                        </label>
                        <Input
                          id="gallery-order"
                          type="number"
                          value={galleryForm.sort_order ?? 0}
                          onChange={(e) =>
                            setGalleryForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))
                          }
                          className="control-inset h-10 bg-white"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-medium sm:pt-8">
                        <input
                          type="checkbox"
                          checked={galleryForm.is_active ?? true}
                          onChange={(e) => setGalleryForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                          className="h-4 w-4 accent-[#65101a]"
                        />
                        Activa en el sitio
                      </label>

                      {status && (
                        <p className={`text-sm sm:col-span-2 ${status.type === "error" ? "text-destructive" : "text-green-700"}`}>
                          {status.text}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 sm:col-span-2">
                        <Button type="submit" disabled={saving || uploading} className="btn-skeuo h-11 min-w-36">
                          {uploading ? "Subiendo..." : saving ? "Guardando..." : galleryEditingId ? "Guardar foto" : "Agregar foto"}
                        </Button>
                        {galleryEditingId ? (
                          <Button type="button" variant="outline" className="h-11" onClick={resetGalleryForm}>
                            Cancelar edición
                          </Button>
                        ) : null}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <section className="space-y-3">
                  <h2 className="font-heading text-xl font-semibold">Fotos guardadas</h2>
                  {loadingGalleryItems ? (
                    <p className="text-sm text-muted-foreground">Cargando fotos...</p>
                  ) : galleryItems.length === 0 ? (
                    <Card className="shadow-card">
                      <CardContent className="p-8 text-center text-sm text-muted-foreground">
                        Aún no hay fotos dinámicas. Ejecuta el SQL o agrega la primera.
                      </CardContent>
                    </Card>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {galleryItems.map((item) => (
                        <li key={item.id}>
                          <Card className="h-full shadow-card">
                            <CardContent className="space-y-3 p-4">
                              <div className="overflow-hidden rounded-xl bg-black/5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.image_url}
                                  alt={item.alt || item.title}
                                  className="h-44 w-full object-cover"
                                />
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {item.tag ? (
                                  <Badge variant="secondary" className="bg-shekinah/10 text-shekinah">
                                    {item.tag}
                                  </Badge>
                                ) : null}
                                <Badge variant="secondary" className={item.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                                  {item.is_active ? "Activa" : "Inactiva"}
                                </Badge>
                              </div>
                              <div>
                                <p className="font-heading text-lg font-semibold">{item.title}</p>
                                {item.alt ? <p className="mt-1 text-sm text-muted-foreground">{item.alt}</p> : null}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => startGalleryEdit(item)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                  Editar
                                </Button>
                                <Button type="button" size="sm" variant="destructive" className="gap-1.5" onClick={() => handleGalleryDelete(item.id)}>
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
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
