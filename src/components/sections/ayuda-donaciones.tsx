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

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) setRequests([]);
    }, 4000);

    fetchPublicHelpRequests()
      .then((rows) => {
        if (!cancelled) setRequests(rows);
      })
      .catch(() => {
        if (!cancelled) setRequests([]);
      })
      .finally(() => {
        window.clearTimeout(timer);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
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

    try {
      openWhatsapp(whatsappMessage);
    } catch {
      setStatus({ type: "error", text: t("ayuda.whatsappError") });
      setLoading(false);
      return;
    }

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

  const showBoard = requests.length > 0;

  const form = (
    <Card id="help-form" className="border-0 bg-transparent shadow-none ring-0">
      <CardContent className="p-0">
        <form aria-label={t("ayuda.formAria")} className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t("form.name")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("form.namePlaceholder")}
              required
              className="control-inset h-10 rounded-[12px] border-black/15 bg-white text-[#1a1214] placeholder:text-black/45"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">{t("ayuda.typeLabel")}</label>
            <Select value={helpType} onValueChange={(value) => setHelpType(value ?? "General")}>
              <SelectTrigger className="control-inset h-10 w-full rounded-[12px] border-black/15 bg-white text-[#1a1214]">
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
            <label className="text-sm font-medium text-white">{t("form.message")}</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("ayuda.messagePlaceholder")}
              rows={4}
              minLength={10}
              maxLength={500}
              required
              className="control-inset rounded-[12px] border-black/15 bg-white text-[#1a1214] placeholder:text-black/45"
            />
          </div>
          <details className="rounded-[12px] bg-white/5 px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-white/85">
              {t("ayuda.optionalFields")}
            </summary>
            <div className="mt-3 space-y-2 pb-1">
              <label className="text-sm font-medium text-white">{t("ayuda.phoneLabel")}</label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("ayuda.phonePlaceholder")}
                autoComplete="tel"
                className="control-inset h-10 rounded-[12px] border-black/15 bg-white text-[#1a1214] placeholder:text-black/45"
              />
            </div>
          </details>
          <p className="text-xs text-white/65">{t("ayuda.privacyNote")}</p>
          {status && (
            <p
              role="status"
              className={`rounded-[12px] px-3 py-2 text-sm ${
                status.type === "error"
                  ? "bg-red-500/15 text-red-200"
                  : status.type === "success"
                    ? "bg-emerald-500/15 text-emerald-200"
                    : "bg-white/10 text-white/85"
              }`}
            >
              {status.text}
            </p>
          )}
          <Button type="submit" disabled={loading} className="btn-skeuo h-11 w-full rounded-[12px]">
            {loading ? t("ayuda.saving") : t("ayuda.submitBtn")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <section id="ayuda" className="section-padding">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{t("ayuda.eyebrow")}</p>
          <h2 className="section-title">{t("ayuda.title")}</h2>
          <p className="section-desc">{t("ayuda.description")}</p>
        </Reveal>

        {showBoard ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {requests.map((request) => (
                <Card key={request.id} className="border-0 bg-transparent shadow-none ring-0">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit border-0 bg-white/10 text-[#f3c4cb]">
                      {request.help_type}
                    </Badge>
                    <CardTitle className="text-lg text-white">
                      {request.display_name || t("ayuda.anonymousName")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-white/75">{request.public_message}</p>
                    <a
                      href={buildWhatsappUrl(
                        `Hola, quiero ayudar o consultar sobre esta solicitud: ${request.help_type} - ${request.public_message}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ size: "sm", variant: "outline" }),
                        "gap-2 border-0 bg-white/10 text-white hover:bg-white/16"
                      )}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t("ayuda.coordinateBtn")}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Reveal delay={0.1} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg">
              {form}
            </Reveal>
          </div>
        ) : (
          <Reveal delay={0.1} className="mt-10 w-full max-w-md">
            {form}
          </Reveal>
        )}
      </div>
    </section>
  );
}
