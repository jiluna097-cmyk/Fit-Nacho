import { store, pushTo, arNow } from "../lib/store.mjs";
import { build } from "../lib/content.mjs";
// Corre cada hora (en punto). Arma los recordatorios según la hora de Argentina y lo que ya hiciste hoy.
export default async () => {
  const now = arNow();
  const st = store();
  if (now.hour < 8 || now.hour > 22) { await st.setJSON("meta/lastrun", { at: Date.now(), ...now, skipped: true }); return new Response("fuera de horario"); }
  const { blobs } = await st.list({ prefix: "subs/" });
  let total = 0;
  for (const b of blobs) {
    const uid = b.key.slice(5);
    const [sum, steps] = await Promise.all([st.get("sum/" + uid, { type: "json" }), st.get("steps/" + uid, { type: "json" })]);
    const msgs = build(now, sum, steps);
    if (msgs.length) total += await pushTo(uid, msgs);
  }
  await st.setJSON("meta/lastrun", { at: Date.now(), ...now, users: blobs.length, sent: total });
  console.log(`notify ${now.date} ${now.hour}h → ${total} enviadas`);
  return new Response("ok");
};
export const config = { schedule: "@hourly" };
