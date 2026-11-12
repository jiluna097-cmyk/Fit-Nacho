import { store, okUid } from "../lib/store.mjs";
export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const { uid, sub, remove } = await req.json().catch(() => ({}));
  if (!okUid(uid) || !sub?.endpoint) return new Response("Bad request", { status: 400 });
  const st = store();
  const key = "subs/" + uid;
  let list = (await st.get(key, { type: "json" })) || [];
  list = list.filter((s) => s.endpoint !== sub.endpoint);
  if (!remove) list.push(sub);
  await st.setJSON(key, list);
  return Response.json({ ok: true, devices: list.length });
};
export const config = { path: "/api/subscribe" };
