"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/providers/language-provider";
import { HELP_TYPES } from "@/lib/constants";
import { fetchPublicHelpRequests, saveHelpRequest, type HelpRequest } from "@/lib/supabase";
import { buildWhatsappUrl, openWhatsapp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HELP_SUBMIT_COOLDOWN_MS = 60 * 1000;
const LAST_HELP_SUBMIT_KEY = "shekinah-last-help-submit";

export function AyudaDonaciones() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [helpType, setHelpType] = useState("General");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "info" | "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);

  useEffect(() => {
    fetchPublicHelpRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setBoardLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setStatus({ type: "error", text: t("ayuda.nameRequired") });
      return;
    }

    if (message.trim().length < 10 || message.trim().length > 500) {
      setStatus({ type: "error", text: t("ayuda.messageLengthError") });
      return;
    }

    const lastSubmit = Number(localStorage.getItem(LAST_HELP_SUBMIT_KEY) || 0);
    if (Date.now() - lastSubmit < HELP_SUBMIT_COOLDOWN_MS) {
      setStatus({ type: "error", text: t("ayuda.rateLimit") });
      return;
    }

    setLoading(true);
    setStatus(null);

    const contact = phone.trim() || t("ayuda.noContact");
    const whatsappMessage = `Hola, soy ${name.trim()}. Mi contacto es ${contact}. Solicito ayuda de tipo ${helpType}: ${message.trim()}`;

    openWhatsapp(whatsappMessage);

    const saved = await saveHelpRequest({
      name: name.trim(),
      phone: phone.trim() || null,
      help_type: helpType,
      message_private: message.trim(),
    });

    localStorage.setItem(LAST_HELP_SUBMIT_KEY, String(Date.now()));
    setStatus({
      type: saved ? "success" : "info",
      text: saved ? t("ayuda.submitted") : t("ayuda.submittedWhatsappOnly"),
    });
    setName("");
    setPhone("");
    setHelpType("General");
    setMessage("");
    setLoading(false);
  };

  return (
    <section id="ayuda" className="section-padding section-surface-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("ayuda.eyebrow")}</p>
          <h2 className="section-title">{t("ayuda.title")}</h2>
          <p className="section-desc">{t("ayuda.description")}</p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {boardLoading ? (
                <>
                  {[0, 1].map((key) => (
                    <Card key={key} className="shadow-card" aria-busy="true" aria-label={t("ayuda.loadingRequests")}>
                      <CardContent className="space-y-3 p-6">
                        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-16 w-full animate-pulse rounded bg-muted" />
                        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <Card key={request.id} className="shadow-card transition-all hover:shadow-card-hover">
                    <CardHeader className="pb-2">
                      <Badge
                        variant="secondary"
                        className="w-fit bg-shekinah/10 text-shekinah  "
                      >
                        {request.help_type}
                      </Badge>
                      <CardTitle className="text-lg">
                        {request.display_name || t("ayuda.anonymousName")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{request.public_message}</p>
                      <a
                        href={buildWhatsappUrl(
                          `Hola, quiero ayudar o consultar sobre esta solicitud: ${request.help_type} - ${request.public_message}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ size: "sm", variant: "outline" }),
                          "gap-2 border-black/30 text-foreground hover:bg-muted"
                        )}
                      >
                        <MessageCircle className="h-4 w-4" />
                        {t("ayuda.coordinateBtn")}
                      </a>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full shadow-card">
                  <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
                    <p className="font-heading text-lg font-semibold text-foreground">
                      {t("ayuda.emptyRequestsTitle")}
                    </p>
                    <p className="max-w-md text-sm text-muted-foreground">{t("ayuda.emptyRequestsDesc")}</p>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>

          <Reveal delay={0.1}>
            <Card id="help-form" className="surface-porcelain ring-0">
              <CardContent className="p-6">
                <form aria-label={t("ayuda.formAria")} className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("form.name")}</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("form.namePlaceholder")}
                      required
                      className="control-inset h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("ayuda.phoneLabel")}</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("ayuda.phonePlaceholder")}
                      autoComplete="tel"
                      className="control-inset h-10 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("ayuda.typeLabel")}</label>
                    <Select value={helpType} onValueChange={(value) => setHelpType(value ?? "General")}>
                      <SelectTrigger className="control-inset h-10 w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HELP_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {t(type.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("form.message")}</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("ayuda.messagePlaceholder")}
                      rows={4}
                      minLength={10}
                      maxLength={500}
                      required
                      className="control-inset bg-white"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{t("ayuda.privacyNote")}</p>
                  {status && (
                    <p
                      role="status"
                      className={`text-sm ${status.type === "error" ? "text-destructive" : status.type === "success" ? "text-green-600 " : "text-muted-foreground"}`}
                    >
                      {status.text}
                    </p>
                  )}
                  <Button type="submit" disabled={loading} className="btn-skeuo h-11 w-full">
                    {loading ? t("ayuda.saving") : t("ayuda.submitBtn")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
