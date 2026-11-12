import { MEALS } from "./meals.mjs";

export const QUOTES = [
  "Si tengo hambre de ansiedad, es porque voy por el camino.",
  "No hace falta tener ganas. Hace falta tener un plan.",
  "Un mal día no arruina nada. Dos seguidos empiezan un hábito.",
  "Doce semanas al 80 % le ganan a una semana perfecta.",
  "La motivación aparece después de empezar, no antes.",
  "Lo que hacés la mayoría de los días es lo que te cambia.",
  "Tu yo de dentro de 90 días te está mirando.",
  "Hoy no hace falta ser perfecto. Hace falta no abandonar.",
  "Cada serie que anotás es una promesa cumplida.",
];
const GYM = [
  "La sesión que no tenés ganas de hacer es la que más cuenta.",
  "Nadie se arrepiente de haber entrenado. Bolso y salís.",
  "No hace falta que sea tu mejor sesión. Hace falta que la hagas.",
  "El que entrena cansado vuelve. El que espera tener ganas, no.",
];
const NIGHT = {
  2: "Armá la avena overnight para mañana.",
  3: "Pasá el medallón, el pollo y la nalga del freezer a la heladera.",
  4: "Mini-batch de 25 min y pasá la salsa de carne a la heladera.",
  5: "Las tiras para las fajitas de mañana ya están listas.",
  6: "Pasá la milanesa de carne a la heladera. Mañana son las compras.",
  0: "Mañana es el batch cooking. Revisá que tengas todo.",
  1: "Los tuppers del lunes están listos. Arranca la semana.",
};
const pick = (a, n) => a[n % a.length];
const short = (s, n = 110) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const fmtL = (g) => (g * 0.5).toFixed(1).replace(".", ",");

export function build({ hour: h, wd, date }, sum, steps) {
  const start = sum?.start || "2026-11-16";
  const dn = Math.round((parse(date) - parse(start)) / 864e5) + 1;
  const week = dn < 1 ? 0 : Math.floor((dn - 1) / 7) + 1;
  const active = dn >= 1 && dn <= 84;
  const pre = dn < 1 && dn >= -2;
  const fresh = sum && sum.date === date;
  const s = fresh ? sum : { water: 0, crea: false, meals: 0, weighed: false, waist: false, trained: false, stepsDone: false, pct: 0, minOk: false, streak: sum?.streak || 0, missing: [] };
  const prefs = sum?.prefs || {};
  const on = (c) => prefs[c] !== false;
  const train = [1, 3, 5].includes(wd) && active;
  const goal = train ? 9 : 8;
  const stepsGoal = Math.min(10000, 6000 + 1000 * Math.max(0, week - 1));
  const st = steps && steps.date === date ? steps.steps : null;
  const plan = MEALS[wd];
  const out = [];
  const add = (cat, title, body, tag) => { if (on(cat)) out.push({ title, body, tag: tag || cat, url: "/" }); };

  if ((pre || active) && on("cocina")) {
    if (wd === 6 && h === 10) add("cocina", "🛒 Hoy son las compras", "La lista con cantidades está en la app, en Cocina > Compras.");
    if (wd === 0 && h === 10) add("cocina", "🍳 Batch cooking (1 a 1,5 h)", "Poné música y seguí el paso a paso en Cocina. Si la comida está hecha, no hay delivery.");
  }
  if (!active) return out;

  if (h === 8 && !s.weighed) add("peso", "⚖️ Buen día, Nacho", wd === 1 ? "Pesate en ayunas y medí la cintura. Anotalo en la app." : "Pesate en ayunas y anotalo. Desayuno: " + short(plan.meals[0].d, 80));
  if ((h === 9 || h === 13) && !s.crea) add("creatina", "💊 Creatina", h === 9 ? "5 g con el desayuno. Marcala en la app." : "Todavía no la marcaste: 5 g con el almuerzo.");
  if (h === 13) add("comidas", "🍽️ Almuerzo · " + plan.tema, short(plan.meals[1].d));
  if (h === 16) add("comidas", "🥤 Snack de la tarde", short(plan.meals[2].d) + " Si te agarra el antojo, abrí el SOS.");
  if (h === 21) add("comidas", "🌙 Cena y postre", short(plan.meals[3].d, 80) + " · Previa: " + NIGHT[(wd + 1) % 7]);

  if (h >= 10 && h <= 20) {
    const exp = Math.floor((goal * (h - 8)) / 13);
    if (s.water < exp - 1) add("agua", `💧 Vas ${fmtL(s.water)} L de ${fmtL(goal)} L`, `Tomá un vaso de 500 ml ahora. A esta hora deberías ir por ${fmtL(exp)} L.`, "agua");
  }

  if (train && !s.trained) {
    if (h === 17) add("entreno", `🏋️ Hoy toca gimnasio · Sesión ${sum?.next || "A"}`, pick(GYM, dn));
    if (h === 20) add("entreno", "⏰ Todavía estás a tiempo", "Regla de los 5 minutos: andá y hacé solo el calentamiento y un ejercicio. Si querés irte, te vas.");
  }
  if (train && s.trained && h === 20) add("entreno", "💪 Sesión hecha", "Proteína en la cena y 7 horas de sueño: ahí crece el músculo.");

  if ((h === 12 || h === 18) && !s.stepsDone) {
    if (st !== null) {
      if (st >= stepsGoal) add("pasos", `👟 ¡${st.toLocaleString("es-AR")} pasos!`, "Objetivo de hoy cumplido. Marcalo en la app.");
      else { const f = stepsGoal - st; add("pasos", `👟 Vas ${st.toLocaleString("es-AR")} de ${stepsGoal.toLocaleString("es-AR")} pasos`, `Te faltan ${f.toLocaleString("es-AR")}: unos ${Math.ceil(f / 100)} minutos caminando.`); }
    } else if (h === 18) add("pasos", "👟 ¿Cómo venís con los pasos?", `Objetivo de hoy: ${stepsGoal.toLocaleString("es-AR")}. Mirá el Apple Watch y marcalo en la app.`);
  }

  if (wd === 0 && h === 19 && !(fresh && sum.revDone)) add("resumen", "📝 Revisión semanal (5 min)", "Qué salió bien, qué costó y qué ajustás. Está en Coach mental.");

  if (h === 22) {
    if (s.pct >= 0.7 || s.minOk) add("resumen", `🔥 Día ganado · racha de ${s.streak} días`, pick(QUOTES, dn));
    else add("resumen", "Te falta poco para ganar el día", (s.missing?.length ? "Te falta: " + s.missing.slice(0, 3).join(", ") + ". " : "") + "Si no llegás, cumplí el plan mínimo: también cuenta.");
  }
  const PRI = { entreno: 0, creatina: 1, peso: 2, resumen: 3, comidas: 4, pasos: 5, cocina: 6, agua: 7 };
  return out.sort((a, b) => (PRI[a.tag] ?? 9) - (PRI[b.tag] ?? 9)).slice(0, 2);
}
