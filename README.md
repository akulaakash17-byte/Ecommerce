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

## Inquiry Notifications

Inquiry submission can automatically notify `+91 8897422872`.

For WhatsApp Cloud API, set these in `backend/.env`:

- `INQUIRY_NOTIFICATION_PHONE=918897422872`
- `WHATSAPP_NOTIFICATION_ENABLED=true`
- `WHATSAPP_API_VERSION=v25.0`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`

For an SMS gateway, set `SMS_NOTIFICATION_WEBHOOK_URL`. The backend sends:

```json
{
  "to": "918897422872",
  "message": "New property inquiry..."
}
```

## API Summary

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`
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

Agent follow-ups:

- `GET /api/follow-ups`
- `POST /api/follow-ups`
- `PATCH /api/follow-ups/:id/status`

Dashboard:

- `GET /api/dashboard/overview`

## Business Rules

- No payments.
- No checkout.
- No online booking.
- Buyers contact the office through WhatsApp, phone calls, or inquiry forms.
- Agents/admins manage listings and mark properties as available or sold.
