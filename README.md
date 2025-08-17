# Prywatny Asystent AI – monorepo

## Wymagania
- Python 3.11, Node 20, npm, (opcjonalnie) Expo CLI

## Backend – lokalnie
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend web – lokalnie
```bash
cd web
cp .env.local.example .env.local
npm i
npm run dev
```

## Mobile – lokalnie (Android)
```bash
cd mobile
export EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
npm i
npm run start
```

## Deploy
- **Web (Vercel):** Podłącz repo do Vercel → ustaw `NEXT_PUBLIC_API_URL` na publiczny URL backendu.
- **Backend (Railway/Render/Docker):** Zbuduj obraz lub wybierz Python → ustaw `OPENAI_API_KEY`, `ALLOWED_ORIGINS`, `DATABASE_URL`.
