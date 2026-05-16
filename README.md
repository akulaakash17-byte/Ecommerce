# Siddipet Real Estate Web

A full-stack real estate discovery and listing-management app for Siddipet district, Telangana. It is designed for a real office workflow in Pragnapur: buyers discover properties online, then communication and deals happen offline through WhatsApp, phone calls, and inquiry forms.

There is no checkout, booking engine, online buying/selling, or payment gateway.

## Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router DOM, Axios
- Backend: Node.js, Express.js, JWT auth, Multer uploads
- Database: PostgreSQL
- Image storage: Cloudinary when configured, local `/uploads` fallback in development

## Project Structure

```text
frontend/src/
├── assets/
├── components/
├── context/
├── data/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
└── utils/

backend/
├── config/
├── controllers/
├── data/
├── middleware/
├── models/
├── routes/
├── scripts/
├── uploads/
├── utils/
├── schema.sql
└── server.js
```

## Setup

Install frontend and backend dependencies:

```bash
npm install
npm --prefix backend install
```

Create backend environment:

```bash
cp backend/.env.example backend/.env
```

Update `backend/.env` with PostgreSQL and Cloudinary credentials. Cloudinary fields can stay empty for local development; uploads will be saved under `backend/uploads`.

Prepare database tables:

```bash
npm --prefix backend run db:setup
```

`db:setup` creates the base schema and applies SQL migrations from `backend/migrations`.

Create the first admin user:

```bash
npm --prefix backend run seed:admin
```

Run frontend and backend together:

```bash
npm run dev
```

Frontend: `http://127.0.0.1:5173`

Backend: `http://127.0.0.1:5050`

## Default Local Admin

The local `.env` can define:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Use those values to log in at `/login`.

Current office admin defaults:

- Name: `Srinivas`
- Phone: `9849972116`
- Email: `akulasrinu62@gmail.com`

Additional public contact details:

- Phone: `8897422872`
- Email: `akulaakash17@gmail.com`

## AI Chatbot

The public chatbot can use Groq through the backend API. Keep Groq credentials only in `backend/.env`; do not put them in frontend code.

- `GROQ_CHATBOT_ENABLED=true`
- `GROQ_API_KEY`
- `GROQ_MODEL=llama-3.1-8b-instant`

The backend calls Groq's OpenAI-compatible chat completions endpoint and the frontend falls back to local FAQ matching if the AI service is unavailable.

## Inquiry Notifications

Inquiry submission can automatically notify the office through WhatsApp, Telegram, and email.

For WhatsApp Cloud API, set these in `backend/.env`:

- `INQUIRY_NOTIFICATION_PHONES=918897422872,919347332792`
- `WHATSAPP_NOTIFICATION_ENABLED=true`
- `WHATSAPP_API_VERSION=v25.0`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

For Telegram Bot API notifications, create a bot through BotFather, start the bot from the destination account, then set:

- `TELEGRAM_NOTIFICATION_ENABLED=true`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

For email notifications, set these in `backend/.env`:

- `EMAIL_NOTIFICATION_ENABLED=true`
- `INQUIRY_NOTIFICATION_EMAIL=akulaakash17@gmail.com`
- `EMAIL_FROM`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASSWORD`

For Gmail SMTP, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`, and a Gmail App Password for `SMTP_PASSWORD`.

## API Summary

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/auth/users`
- `POST /api/auth/users`

Locations:

- `GET /api/locations/mandals`
- `GET /api/locations/villages/:mandal`

Properties:

- `GET /api/properties`
- `GET /api/properties/:idOrSlug`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`

Property filters:

- `q`
- `mandal`
- `village`
- `property_type`
- `minPrice`
- `maxPrice`
- `status`
- `page`
- `limit`

Inquiries:

- `POST /api/inquiries`
- `GET /api/inquiries`
- `PATCH /api/inquiries/:id/status`

Agent follow-ups:

- `GET /api/follow-ups`
- `POST /api/follow-ups`
- `PATCH /api/follow-ups/:id/status`

Dashboard:

- `GET /api/dashboard/overview`

Notifications:

- `GET /api/notifications`

## Business Rules

- No payments.
- No checkout.
- No online booking.
- Buyers contact the office through WhatsApp, phone calls, or inquiry forms.
- Agents/admins manage listings and mark properties as available or sold.


<!-- next steps -->

It is good for a demo / early live version, but I would not call it fully production-level yet.

Main improvements I’d recommend beyond data:

Translation
Google Translate widget is okay for quick use, but for production it can be inconsistent and depends on Google script loading. Better production option: use app-controlled translations with i18next for Telugu/Hindi labels, buttons, forms, and main content.

Inquiry Notification
Code is ready, but real production needs configured WhatsApp Cloud API or Telegram bot credentials. Notification logs and inquiry status tracking are available in the admin dashboard.

Security
Add stronger production checks:

Strong JWT_SECRET
HTTPS-only deployment
Secure CORS domain instead of broad localhost defaults
Rate limits per sensitive route
File upload size/type validation is especially important

Production security settings now supported in `backend/.env`:

- `NODE_ENV=production`
- `JWT_SECRET` must be unique and at least 32 characters
- `CLIENT_URLS=https://yourdomain.com,https://www.yourdomain.com`
- `MAX_JSON_BODY_SIZE=100kb`
- `UPLOAD_MAX_FILE_SIZE_MB=5`
- `UPLOAD_MAX_VIDEO_FILE_SIZE_MB=50`
- `UPLOAD_MAX_FILES=10`

The API will reject unknown CORS origins, disable `x-powered-by`, apply stricter login rate limits, use HTTP-only session cookies, and allow only JPG, PNG, WebP property image uploads plus MP4, WebM, and MOV property video uploads.
Database
Schema now includes migrations, foreign-key constraints for new data, inquiry status fields, and notification logs. Production should still add:

More NOT NULL constraints for required fields
Backups
Database backups can be created and restored with:

```bash
npm --prefix backend run db:backup
npm --prefix backend run db:restore -- backend/backups/your-backup.dump
```

Backups are saved in `backend/backups` and ignored by Git. For production, schedule daily backups and copy them to private cloud storage.
Admin Features
Inquiry status workflow and admin user creation are now in the dashboard. A remaining improvement is assigning inquiries to specific agents.

Testing
Current lint/build passes and backend unit tests are available with:

```bash
npm test
```

Production should still add broader:

Backend API tests for inquiry/property creation
Frontend smoke tests for contact form/listings/login
SEO and Performance
Basic meta tags, sitemap, robots file, canonical URLs, and property structured data are in place. Remaining improvements are dynamic sitemap generation, image optimization, and production analytics.

So: yes, enough to show clients and use carefully, but for serious production I’d next improve translation, notification reliability, database constraints, and admin inquiry workflow.
