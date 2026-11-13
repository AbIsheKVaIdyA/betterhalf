# Abhishek & Kusa

Private shared diary — write whenever a moment feels worth keeping.

## Stack

- Next.js 15
- Neon Postgres
- Vercel Blob (private photo storage)
- Tailwind CSS v4 · Framer Motion

## Setup

```bash
cp .env.example .env.local
# add DATABASE_URL + BLOB_READ_WRITE_TOKEN

npm install
npm run db:setup
npm run dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run db:push` | Sync schema to Neon |
| `npm run db:seed` | Seed site + chapters from `content/diary.json` |
| `npm run db:clear` | Delete all diary entries |

## Env

```bash
DATABASE_URL=           # Neon pooled connection string
BLOB_READ_WRITE_TOKEN=  # Vercel Blob token
```

## Notes

- Gate password lives in `content/diary.json` → `site.gate.password` (synced on seed)
- Photos upload to Vercel Blob and are served via `/api/media/...`
- Entries live in Neon — nothing important is stored only on disk
