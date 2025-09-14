# IronMatrix100 Web

Next.js 14, TypeScript, App Router, mobile-first. Inhalte aus Markdown (`/content`).

## Entwickeln
```
npm run dev
```

Seiten:
- `/` Übersicht
- `/wochenstruktur`
- `/trainingsplan`
- `/essensplan`
- `/api/ironmatrix.ics` Download ICS

## Deploy (Vercel)
- Importiere das Repo in Vercel
- Projektverzeichnis: `web`
- Build Command: `npm run build`
- Output: `.next`
- Node 18+

## Struktur
- `src/app/*` Routen
- `content/*` Markdown-Quellen (aus Repo/docs kopiert)
