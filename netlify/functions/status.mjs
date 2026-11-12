import { store, okUid, publicKey } from "../lib/store.mjs";
// Diagnóstico: claves cargadas, dispositivos suscritos y última corrida del programador.
export default async (req) => {
  const uid = new URL(req.url).searchParams.get("uid");
  const st = store();
  const subs = okUid(uid) ? (await st.get("subs/" + uid, { type: "json" })) || [] : [];
  const sum = okUid(uid) ? await st.get("sum/" + uid, { type: "json" }) : null;
  const last = await st.get("meta/lastrun", { type: "json" });
  return Response.json({ vapid: !!publicKey(), devices: subs.length, lastRun: last || null, summaryAt: sum?.at || null });
};
export const config = { path: "/api/status" };
