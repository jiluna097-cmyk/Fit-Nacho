import { okUid, pushTo } from "../lib/store.mjs";
export default async (req) => {
  const { uid } = await req.json().catch(() => ({}));
  if (!okUid(uid)) return new Response("Bad request", { status: 400 });
  const n = await pushTo(uid, [{ title: "🔔 ¡Funciona, Nacho!", body: "Así te van a llegar los recordatorios. También al Apple Watch.", tag: "test", url: "/" }]);
  return Response.json({ ok: true, sent: n });
};
export const config = { path: "/api/test" };
