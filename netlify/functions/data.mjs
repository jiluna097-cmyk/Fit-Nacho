import { store, okUid } from "../lib/store.mjs";
// GET: devuelve tus datos guardados + pasos. POST: guarda datos y el resumen del día (para las notificaciones).
export default async (req) => {
  const st = store();
  if (req.method === "GET") {
    const uid = new URL(req.url).searchParams.get("uid");
    if (!okUid(uid)) return new Response("Bad request", { status: 400 });
    const d = (await st.get("data/" + uid, { type: "json" })) || {};
    const steps = await st.get("steps/" + uid, { type: "json" });
    return Response.json({ data: d.data || null, updatedAt: d.updatedAt || 0, steps: steps || null });
  }
  if (req.method === "POST") {
    const { uid, data, updatedAt, summary } = await req.json().catch(() => ({}));
    if (!okUid(uid)) return new Response("Bad request", { status: 400 });
    if (data && typeof updatedAt === "number") {
      const cur = (await st.get("data/" + uid, { type: "json" })) || {};
      if (!cur.updatedAt || updatedAt >= cur.updatedAt) await st.setJSON("data/" + uid, { data, updatedAt });
    }
    if (summary) await st.setJSON("sum/" + uid, { ...summary, at: Date.now() });
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};
export const config = { path: "/api/data" };
