import { registerSW } from "virtual:pwa-register";

export function initializePwa() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  registerSW({
    immediate: true,
    onOfflineReady() {
      document.documentElement.dataset.offlineReady = "true";
    },
  });
}
