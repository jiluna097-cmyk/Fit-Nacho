# Plan 12 Semanas: app + notificaciones push en Netlify

Esta app es una PWA: se instala en el iPhone como una app y recibe notificaciones (también en el Apple Watch).
Las notificaciones las programa una función de Netlify que corre **cada hora** y mira qué te falta hacer en el día.

## Qué hay en la carpeta
- `index.html`: la app.
- `sw.js` y `manifest.webmanifest`: permiten instalarla y recibir notificaciones.
- `netlify/functions/`: el servidor (guardar datos, suscribirse, pasos, notificaciones cada hora).
- `netlify/lib/`: textos de las notificaciones y el menú.

## 1. Subir el código a GitHub
Las funciones no se pueden subir arrastrando la carpeta a Netlify: necesitan que Netlify instale dependencias.
1. Creá un repositorio **privado** en github.com (por ejemplo `plan-12-semanas`).
2. Tocá **uploading an existing file** y arrastrá **todo el contenido** de esta carpeta (no la carpeta en sí).
3. Commit.

## 2. Crear el sitio en Netlify
1. app.netlify.com → **Add new site** → **Import an existing project** → GitHub → elegí el repo.
2. No cambies nada (la configuración la toma de `netlify.toml`) → **Deploy**.

## 3. Cargar las claves de notificaciones (obligatorio)
En Netlify: **Site configuration → Environment variables → Add a variable**. Creá estas 3:

| Variable | Valor |
|---|---|
| `VAPID_PUBLIC_KEY` | la clave pública del archivo `CLAVES-VAPID.txt` |
| `VAPID_PRIVATE_KEY` | la clave privada del archivo `CLAVES-VAPID.txt` |
| `VAPID_SUBJECT` | `mailto:tu-mail@gmail.com` |

Después: **Deploys → Trigger deploy → Deploy site** para que tome las claves.
**No subas `CLAVES-VAPID.txt` a GitHub.**

## 4. Instalar en el iPhone
1. Abrí la URL de Netlify en **Safari**.
2. **Compartir → Agregar a inicio**.
3. Abrí la app **desde el ícono** → **Activar notificaciones** → **Permitir**.
4. En **Progreso → Notificaciones** tocá **Probar**: tiene que llegarte una notificación (y al reloj).

Si la notificación llega al iPhone y no al reloj: app Watch del iPhone → Notificaciones → buscá "Plan 12" y activá "Duplicar alertas del iPhone".

## 5. Pasar tus datos de la app anterior
En la app anterior: **Progreso → Ajustes y respaldo → Copiar mis datos**.
En la nueva: **Progreso → Ajustes y respaldo → Restaurar** → pegá → Restaurar.

## 6. Pasos automáticos del Apple Watch (opcional, 3 minutos)
En la app: **Progreso → Notificaciones → Sincronizar pasos del Apple Watch**. Te da tu link personal y los pasos para crear la automatización en **Atajos**.

## Horario de las notificaciones (hora de Argentina)
| Hora | Qué | Cuándo |
|---|---|---|
| 8 | Pesarte (+ cintura los lunes) | si no lo cargaste |
| 9 y 13 | Creatina | si no la marcaste |
| 10 a 20, cada hora | Agua | solo si venís atrasado |
| 12 y 18 | Pasos ("vas X de Y") | con el Atajo; sin el Atajo, solo a las 18 |
| 13 / 16 / 21 | Almuerzo / snack / cena + postre + previa | todos los días |
| 17 y 20 | Gimnasio con motivación | lunes, miércoles y viernes, si no fuiste |
| 22 | Resumen: racha o lo que falta | todos los días |
| Domingo 19 | Revisión semanal | si no la hiciste |
| Sábado y domingo 10 | Compras / batch cooking | |

Como máximo 2 notificaciones por hora. Cada categoría se apaga en **Progreso → Notificaciones**.

## Notas
- Tus datos quedan en el teléfono y en Netlify Blobs (privado, asociado a tu código de sincronización).
- La función programada corre solo en el sitio publicado (no en vista previa).
- Todo entra en el plan gratuito de Netlify.
