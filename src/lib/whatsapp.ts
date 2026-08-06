import { COORDINATOR_PHONE } from "./constants";

function normalizeWhatsappPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 8 ? `503${digits}` : digits;
}

export function buildWhatsappUrl(message = ""): string {
  const baseUrl = `https://wa.me/${COORDINATOR_PHONE}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export function buildWhatsappUrlForPhone(phone: string, message = ""): string {
  const baseUrl = `https://wa.me/${normalizeWhatsappPhone(phone)}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
}

export function buildTelUrl(phone = COORDINATOR_PHONE): string {
  return `tel:+${phone.replace(/\D/g, "")}`;
}

export function openWhatsapp(message = ""): void {
  if (typeof window === "undefined") return;
  window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
}

export function formatPhone(phone: string): string {
  if (phone.length === 11 && phone.startsWith("503")) {
    return `+${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
  }
  return phone ? `+${phone}` : "";
}
