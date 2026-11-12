import { publicKey } from "../lib/store.mjs";
export default async () => Response.json({ key: publicKey() });
export const config = { path: "/api/vapid" };
