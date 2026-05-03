import type * as Leaflet from "leaflet";

declare global {
  interface Window {
    L?: typeof Leaflet;
  }
}

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;

export async function ensureLeaflet(): Promise<typeof window.L | undefined> {
  if (window.L) return window.L;

  if (!document.querySelector('link[data-leaflet-css="1"]')) {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = LEAFLET_CSS_URL;
    css.crossOrigin = "";
    css.setAttribute("data-leaflet-css", "1");
    document.head.appendChild(css);
  }

  const existing = document.querySelector('script[data-leaflet-js="1"]');
  if (existing) {
    await new Promise((resolve) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", resolve, { once: true });
    });
  } else {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = LEAFLET_JS_URL;
      script.crossOrigin = "";
      script.setAttribute("data-leaflet-js", "1");
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return window.L;
}
