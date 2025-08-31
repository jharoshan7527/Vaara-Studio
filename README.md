
# Vaara Studio — Freelancing Service Website

Dynamic website for **Vaara Studio** to showcase services in **3D Modeling, Animation, and Web Development**, accept client inquiries, and manage content with a simple admin workflow.

## Features
- Static, responsive front-end (HTML, CSS, JavaScript)
- MongoDB + Express REST API
- Auth (JWT): register/login for clients/providers; admin endpoints
- Services list, detail, create/update/delete (provider/admin)
- Inquiry form that saves to database (public)
- Seed script with demo data

## Quick Start
1. Install Node.js 18+ and MongoDB (local or Atlas).
2. Extract this project and open a terminal in the folder.
3. Run:
   ```bash
   npm install
   cp .env.example .env
   # Update .env if needed
   npm run seed
   npm run dev
   ```
4. Visit `http://localhost:4000`

### Demo Accounts
- Admin: `admin@vaara.studio` / `Admin@123`
- Provider: `provider@vaara.studio` / `Provider@123`

## API Overview
- `POST /api/auth/register` — {name,email,password,role?}
- `POST /api/auth/login` — {email,password} → {token}
- `GET /api/services` — list services
- `GET /api/services/:id` — get service
- `POST /api/services` — (Bearer token) create
- `PUT /api/services/:id` — (Bearer token) update
- `DELETE /api/services/:id` — (Bearer token) delete
- `POST /api/inquiries` — create inquiry
- `GET /api/admin/inquiries` — (admin) list inquiries
- `GET /api/admin/services` — (admin) list services

## Folder Structure
```text
public/           # Front-end (HTML/CSS/JS)
models/           # Mongoose models
routes/           # Express routes
middleware/       # Auth middleware
seed.js           # Seed demo data
server.js         # App entrypoint
```

---

© 2025 Vaara Studio (demo). Generated for educational and project purposes.
