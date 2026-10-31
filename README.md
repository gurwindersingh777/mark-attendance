# MarkAttendance – Smart & Secure Attendance Management System

Built to replace paper registers. Teachers create attendance sessions with QR codes that rotate every 30 seconds. Students scan the QR code or enter a manual code to mark attendance. GPS-based location verification adds a second layer of protection against proxy attendance.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://vercel.com)

🚀 **[Live Demo](https://qr-attendance--app.vercel.app/)** &nbsp; · &nbsp; 📡 **[Backend API](https://qr-attendance-app-xj9r.onrender.com/health)**

> ⚠️ The backend is hosted on Render's free tier and may take **10–15 seconds to wake up** on the first request. Subsequent requests are generally faster.

---

## Screenshots

### 🎓 Student

<img src="./docs/screenshots/student-subject-detail.png" width="49%" alt="Student subject details" /> <img src="./docs/screenshots/student-dashboard.png" width="49%" alt="Student dashboard" />

<img src="./docs/screenshots/student-scan.png" width="49%" alt="Student QR scanner" />

### 👨‍🏫 Teacher

<img src="./docs/screenshots/teacher-session.png" width="49%" alt="Teacher attendance session" /> <img src="./docs/screenshots/teacher-report.png" width="49%" alt="Teacher attendance report" />

### 🛡️ Admin

<img src="./docs/screenshots/admin-panel.png" width="49%" alt="Admin panel" />

> 💡 **Tip for reviewers:** Use the demo credentials below to try the full flow — no sign-up needed.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Teacher | teacher@demo.com | Teacher@123 |
| Student | student@demo.com | Student@123 |
| Admin | admin@demo.com | Admin@123 |

---

## What Problem Does This Solve?

Traditional paper attendance has three core problems:

- **Slow** — calling names or signing sheets wastes 5–10 minutes per class.
- **Proxy-prone** — a student may sign or mark attendance on behalf of an absent classmate.
- **Hard to analyse** — manual records make it difficult to calculate attendance percentages and identify students who need alerts.

MarkAttendance addresses these problems with two independent verification layers:

- **Time-based** — the QR code rotates every 30 seconds. Its short validity window limits how long a shared screenshot or code can be reused.
- **Location-based** — GPS-based verification checks whether the student is within 150 metres of the classroom location saved for the session.

Both checks must pass for attendance to be marked.

---

## Features

### 👨‍🏫 Teacher

- Create subjects with a unique enrollment code.
- Start an attendance session with a configurable duration.
- QR code automatically rotates every **30 seconds**.
- Display a **6-character manual code** alongside the QR code as a fallback for students without a camera.
- Capture GPS coordinates when the session starts to define the classroom zone.
- View which students have marked attendance during the session.
- End a session early at any time.
- View attendance reports per subject, including each student's attendance percentage.
- Export attendance reports as **CSV**.

### 👨‍🎓 Student

- Enroll in subjects using a teacher-provided code.
- Mark attendance by scanning a QR code with a phone camera.
- Enter a manual code as a fallback.
- Must be within **150 metres** of the classroom location to mark attendance.
- Receive a clear error message when out of range or when location permission is denied.
- View attendance percentage for each subject on the dashboard.
- View session-by-session attendance history, including present or absent status.
- Receive a **low-attendance alert** when attendance drops below 75%.

### 🛡️ Admin

- View, search, and filter all users by role.
- Edit user profiles, including name, email, role, and roll number.
- Delete users, with associated enrollment and subject cleanup.
- View all subjects across all teachers.

### ⚙️ System

- Automated **email alerts** via Resend when student attendance drops below 75%.
- In-app notifications with an unread-count badge.
- JWT authentication with **refresh token rotation**.
- Role-based route protection for students, teachers, and admins.
- Responsive interface for mobile and desktop.

---

## How It Works

```text
Teacher starts an attendance session
        ↓
Teacher's browser captures GPS coordinates
Server stores the classroom location with the session
        ↓
Server generates a QR token and a 6-character manual code
QR token has a 30-second validity period
        ↓
Teacher screen displays the QR code, manual code, and countdown timer
        ↓
Student scans the QR code or enters the manual code
Student's browser captures GPS coordinates
        ↓
Server validates the token/code and checks subject enrollment
Server calculates the distance using the Haversine formula
        ↓
Distance > 150 metres  → attendance rejected
Distance ≤ 150 metres  → attendance can be marked if all checks pass
        ↓
Every 30 seconds:
  — A new QR token is generated
  — The previous token is accepted only during the 2-second overlap window
  — The previous token is then invalidated
```

### Why two layers?

A rotating QR code limits how long a shared code remains valid, but someone physically nearby could still share a current code. GPS-based verification adds another check by comparing the student's reported location with the classroom location. Both checks must pass independently.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| State management | Zustand (auth), TanStack Query (server state) |
| Forms and validation | React Hook Form, Zod |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT (access and refresh tokens), bcrypt |
| Email | Resend |
| QR code | `qrcode` (generation), `html5-qrcode` (scanning) |
| Geolocation | Browser Geolocation API, Haversine formula |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## Architecture

```text
client/                         # React frontend
├── src/
│   ├── api/                    # Axios API layer per feature
│   ├── components/             # Shared UI components and layouts
│   ├── config/                 # Axios and Query Client configuration
│   ├── hooks/                  # Custom hooks (QR scanner, session timer)
│   ├── pages/                  # Pages per role (student/teacher/admin)
│   ├── store/                  # Zustand auth store
│   ├── types/                  # TypeScript interfaces
│   ├── schemas/                # Zod validation schemas
│   ├── routes/                 # React Router with protected routes
│   └── utils/                  # getLocation and helper utilities

server/                         # Node.js backend
├── src/
│   ├── config/                 # Database connection
│   ├── constants/              # Status codes and paths
│   ├── controllers/            # Request handlers
│   ├── emails/                 # Email templates
│   ├── middleware/             # Auth, roles, error handler, security
│   ├── models/                 # Mongoose models
│   ├── routes/                 # Express routers
│   ├── schemas/                # Zod validation schemas
│   ├── services/               # Business logic layer
│   ├── types/                  # TypeScript types
│   └── utils/                  # JWT, cookies, QR, location, email helpers
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or an [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- [Resend](https://resend.com) account for email (the free tier is sufficient)

### 1. Clone the repository

After renaming the GitHub repository to `mark-attendance`, run:

```bash
git clone https://github.com/gurwindersingh777/mark-attendance.git
cd mark-attendance
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Fill in the required values in .env
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
cp .env.example .env
# Leave VITE_API_URL empty for local development — it defaults to localhost:4000
npm run dev
```

### 4. Open the application

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000/health |

---

## API Overview

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account |
| POST | `/auth/login` | Public | Login |
| POST | `/subject` | Teacher | Create subject |
| POST | `/subject/enroll` | Student | Enroll by code |
| POST | `/session/start` | Teacher | Start session and generate QR |
| GET | `/session/:sessionId/qr` | Teacher | Retrieve/rotate QR token |
| POST | `/session/mark` | Student | Mark attendance |
| GET | `/attendance/summary` | Student | Get own attendance percentage |
| GET | `/attendance/report/subject/:id` | Teacher | Get all students' attendance report |
| GET | `/admin/users` | Admin | Retrieve all users |
| GET | `/notification` | Any authenticated user | Retrieve notifications |

---

## Security

- JWT access tokens expire in **1 day**; refresh tokens expire in **7 days**.
- **Refresh token rotation** invalidates the previously used refresh token on refresh.
- **Rate limiting** allows 10 attempts per 15 minutes on authentication routes.
- **Helmet** sets HTTP security headers.
- Request body size is limited to **10 KB**.
- Passwords are hashed using **bcrypt** with 10 rounds.
- Role-based middleware protects authorized routes.
- **Two-layer attendance verification** combines time-based QR tokens with GPS-based location checks.
- The backend calculates the distance using the Haversine formula and checks it against the configured 150-metre radius.

> **Location verification note:** Coordinates are obtained through the browser's Geolocation API. The backend performs the distance calculation, but browser-provided GPS coordinates are not inherently tamper-proof and may be spoofed. Location verification should therefore be considered an additional deterrent, not a guarantee that proxy attendance is impossible.

---

## Challenges & What I Learned

### Two-layer attendance verification

A rotating QR code alone cannot completely prevent proxy attendance because someone nearby could share a current code. I added GPS-based location verification as a second layer. The server calculates the distance between the classroom and student coordinates using the Haversine formula and rejects requests outside the configured 150-metre radius. This helped me understand geolocation APIs, server-side validation, and practical security limitations.

### Token expiration race conditions

When a QR token rotated at the same time a student was submitting attendance, a legitimate request could fail with an invalid-token error. I addressed this with a short overlap window: the server accepts the previous token for 2 seconds after rotation. This makes the submission flow more tolerant of timing differences.

### Refresh token rotation

Implementing silent token refresh with Axios interceptors introduced concurrency challenges. When multiple requests failed because an access token had expired, several refresh requests could be triggered at once. I used a pending-promise pattern to coordinate refresh operations and avoid unnecessary concurrent refresh requests.

### Role-based architecture

Designing a single Express backend for three different user experiences — student, teacher, and admin — required careful separation of permissions and business logic. I organized the application using middleware, routes, controllers, and services to keep responsibilities clear.

---

## Deployment

| Service | Purpose | Notes |
|---|---|---|
| Vercel | Frontend hosting | Auto-deploys on push to `main` |
| Render | Backend hosting | Free tier — cold starts may take 10–15 seconds |
| MongoDB Atlas | Database | M0 free cluster |
| Resend | Email delivery | Free tier: 3,000 emails/month |

---

## Author

**Gurwinder Singh**

[GitHub](https://github.com/gurwindersingh777)

---

If you find MarkAttendance useful, consider giving the repository a ⭐ on GitHub.
