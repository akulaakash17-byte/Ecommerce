

# Siddipet Real Estate Web


A full-stack real estate listing and inquiry platform for Siddipet district, Telangana. The app helps visitors browse land and property listings, save properties locally, contact the office through inquiry forms or WhatsApp, and lets admins manage listings, inquiries, follow-ups, users, audit logs, and dashboard metrics.

This project does not include checkout, online booking, online payments, or in-app property purchases.

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, PostgreSQL, JWT auth, HTTP-only auth cookie
- Uploads: Cloudinary in production when configured, local `backend/uploads` fallback in development
- Notifications: Optional WhatsApp Cloud API, Telegram Bot API, and SMTP email
- AI chatbot: Optional Groq-backed chatbot with frontend FAQ fallback


<h1>Preview</h1>

<div style="display-flex">
  <img width="2916" height="1684" alt="image" src="https://github.com/user-attachments/assets/56271c79-8e5e-4992-84c5-35b73d103b80" />
</div>

## Features

- Public property discovery pages with search and filters
- Property details pages with image/video support
- Saved properties stored in the browser
- Inquiry form and contact/WhatsApp actions
- Location data for mandals and villages
- Admin login and protected dashboard
- Listing create, update, publish/status, and delete workflows
- Inquiry management and follow-up tracking
- Admin user management
- Audit logs and notification logs
- Database setup, backup, restore, and admin seed scripts

## Project Structure

```text
.
├── frontend/src
│   ├── components
│   ├── context
│   ├── data
│   ├── hooks
│   ├── layouts
│   ├── pages
│   ├── routes
│   ├── services
│   └── utils
├── backend
│   ├── config
│   ├── controllers
│   ├── data
│   ├── middleware
│   ├── migrations
│   ├── models
│   ├── routes
│   ├── scripts
│   ├── services
│   ├── uploads
│   ├── schema.sql
│   └── server.js
├── public
├── scripts
├── index.html
├── package.json
└── vite.config.js
```

## Prerequisites

- Node.js 20 or newer recommended
- npm
- PostgreSQL database
- Optional Cloudinary account for production media storage
- Optional Groq, WhatsApp Cloud API, Telegram, or SMTP credentials for chatbot and notifications

## Setup

Install dependencies for the frontend and backend:

```bash
npm install
npm --prefix backend install
```

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set at least:

```env
PORT=5050
CLIENT_URL=http://127.0.0.1:5173
CLIENT_URLS=http://127.0.0.1:5173

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_SSL=false

JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars

ADMIN_NAME=Admin
ADMIN_PHONE=9999999999
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

If using a hosted PostgreSQL database, set `DATABASE_URL`; it takes priority over the individual `DB_HOST`, `DB_NAME`, `DB_USER`, and password fields.

Create database tables and run migrations:

```bash
npm --prefix backend run db:setup
```

Create the first admin user from the `ADMIN_*` values in `backend/.env`:

```bash
npm --prefix backend run seed:admin
```

Start the frontend and backend together:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5050`
- Health check: `http://127.0.0.1:5050/api/health`

## Available Scripts

Root project:

```bash
npm run dev       # start backend and Vite frontend together
npm run dev:ui    # start only the Vite frontend
npm run dev:api   # start only the backend
npm run build     # build frontend for production
npm run preview   # preview production frontend build
npm run lint      # run ESLint
npm test          # run backend tests
```

Backend:

```bash
npm --prefix backend start          # start backend
npm --prefix backend run dev        # start backend with node --watch
npm --prefix backend run db:setup   # create schema and apply migrations
npm --prefix backend run db:backup  # create PostgreSQL backup
npm --prefix backend run db:restore # restore PostgreSQL backup
npm --prefix backend run seed:admin # create/update initial admin
npm --prefix backend test           # run node:test tests
```

## Environment Variables

The backend environment example is in `backend/.env.example`.

Important groups:

- App and CORS: `NODE_ENV`, `PORT`, `CLIENT_URL`, `CLIENT_URLS`
- Database: `DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`
- Auth: `JWT_SECRET`, `JWT_EXPIRES_IN`, `AUTH_COOKIE_NAME`, `AUTH_COOKIE_SAME_SITE`
- Upload limits: `UPLOAD_MAX_FILE_SIZE_MB`, `UPLOAD_MAX_VIDEO_FILE_SIZE_MB`, `UPLOAD_MAX_FILES`
- Admin seed: `ADMIN_NAME`, `ADMIN_PHONE`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`
- Chatbot: `GROQ_CHATBOT_ENABLED`, `GROQ_API_KEY`, `GROQ_MODEL`
- Notifications: `WHATSAPP_*`, `TELEGRAM_*`, `SMTP_*`, `EMAIL_*`

The frontend uses `VITE_API_URL` when provided. If it is not set, API calls default to `/api`, which works with the Vite proxy in local development.

Example frontend production variable:

```env
VITE_API_URL=https://your-api-domain.com/api
```

## API Overview

Base API path: `/api`

- Auth: `/api/auth`
- Properties: `/api/properties`
- Locations: `/api/locations`
- Inquiries: `/api/inquiries`
- Dashboard: `/api/dashboard`
- Follow-ups: `/api/follow-ups`
- Notifications: `/api/notifications`
- Audit logs: `/api/audit-logs`
- Chatbot: `/api/chatbot`

Common public endpoints:

```text
GET  /api/health
GET  /api/properties
GET  /api/properties/:idOrSlug
GET  /api/locations/mandals
GET  /api/locations/villages/:mandal
POST /api/inquiries
POST /api/chatbot
```

Admin endpoints require authentication.

## Uploads

In development, uploaded files are stored under `backend/uploads`.

For production, configure Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=siddipet-real-estate
```

Do not commit uploaded files or real media secrets. The repository keeps only `backend/uploads/.gitkeep`.

## Notifications

Inquiry notifications are optional. Enable only the channels you have configured.

WhatsApp Cloud API:

```env
WHATSAPP_NOTIFICATION_ENABLED=true
WHATSAPP_API_VERSION=v25.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
INQUIRY_NOTIFICATION_PHONES=919999999999
```

Telegram:

```env
TELEGRAM_NOTIFICATION_ENABLED=true
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

Email:

```env
EMAIL_NOTIFICATION_ENABLED=true
INQUIRY_NOTIFICATION_EMAIL=admin@example.com
EMAIL_FROM=admin@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@example.com
SMTP_PASSWORD=your_app_password
```

## Deployment Notes

- Set `NODE_ENV=production`.
- Use a strong `JWT_SECRET` with at least 32 characters.
- Set `CLIENT_URLS` to the exact deployed frontend domains.
- Use HTTPS in production.
- Use Cloudinary or another persistent storage provider for uploaded files.
- Keep `backend/.env`, secrets, database dumps, and uploaded files out of Git.
- Run `npm run build` before deploying the frontend.
- Run database migrations with `npm --prefix backend run db:setup` on the target database.

## Tests

Run the current test suite:

```bash
npm test
```

The existing backend tests use Node's built-in test runner.

## Git Safety

Before pushing, confirm ignored files and secrets are not staged:

```bash
git status
git diff --cached
```

Files that should not be committed include:

- `backend/.env`
- Any `.env` file except `.env.example`
- `node_modules`
- `dist`
- `backend/uploads/*`
- `backend/backups/*`
- Database dumps or backup files
