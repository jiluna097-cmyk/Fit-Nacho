import { store, okUid, arNow } from "../lib/store.mjs";
// Lo llama el Atajo de iOS: /api/steps?uid=TU_CODIGO&steps=1234
export default async (req) => {
  const u = new URL(req.url);
  let uid = u.searchParams.get("uid"), steps = u.searchParams.get("steps");
  if (req.method === "POST" && (!uid || !steps)) {
    const b = await req.json().catch(() => ({}));
    uid = uid || b.uid; steps = steps ?? b.steps;
  }
  const n = Math.round(parseFloat(String(steps).replace(",", ".")));
  if (!okUid(uid) || !Number.isFinite(n) || n < 0) return new Response("Faltan uid o steps", { status: 400 });
  await store().setJSON("steps/" + uid, { date: arNow().date, steps: n, at: Date.now() });
  return new Response(`OK: ${n} pasos guardados`);
};
export const config = { path: "/api/steps" };
