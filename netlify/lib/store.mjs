import { getStore } from "@netlify/blobs";
import { setVapidDetails, sendNotification } from "web-push";

export const store = () => getStore("plan12");
export const okUid = (u) => typeof u === "string" && /^[A-Za-z0-9-]{8,64}$/.test(u);
const env = (k) => (globalThis.Netlify?.env?.get?.(k)) ?? process.env[k];

let vapidReady = false;
function vapid() {
  if (vapidReady) return;
  setVapidDetails(env("VAPID_SUBJECT") || "mailto:plan12@example.com", env("VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
  vapidReady = true;
}
export const publicKey = () => env("VAPID_PUBLIC_KEY") || "";

// Envía una o varias notificaciones a todos los dispositivos de un usuario.
export async function pushTo(uid, payloads) {
  vapid();
  const st = store();
  const key = "subs/" + uid;
  const subs = (await st.get(key, { type: "json" })) || [];
  const keep = [];
  let sent = 0;
  for (const sub of subs) {
    let dead = false;
    for (const p of payloads) {
      try {
        await sendNotification(sub, JSON.stringify(p), { TTL: 3600, urgency: "normal" });
        sent++;
      } catch (e) {
        if (e && (e.statusCode === 404 || e.statusCode === 410)) { dead = true; break; }
        console.log("push error", e?.statusCode, e?.body || e?.message);
      }
    }
    if (!dead) keep.push(sub);
  }
  if (keep.length !== subs.length) await st.setJSON(key, keep);
  return sent;
}

// Fecha y hora de Argentina (UTC-3, sin horario de verano).
export function arNow() {
  const d = new Date(Date.now() - 3 * 3600e3);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    hour: d.getUTCHours(),
    wd: d.getUTCDay(),
  };
}
