# TrackPath — Job Search Tracker (MERN Stack)

A full-stack job application tracker built with **MongoDB, Express, React, Node.js** and **Tailwind CSS**.
Organize your job search by **City → Sector → Company**, track applied status, recruiter response,
and interview process for every company — with a secure, JWT-authenticated personal profile.

---

## Features

- 🔐 **JWT Authentication** — Register/Login, protected routes, password hashing with bcrypt
- 🏙️ **City → Sector → Company hierarchy** — e.g. Noida → Sector 62 → "Tech Mahindra"
- 📊 **Tracking table** with columns: S.N., Company Name, Type, Applied, Response, Process, Detail
  - **Applied** — toggle button (green when applied)
  - **Response** — dropdown badge: Pending / Positive / Negative (color-coded)
  - **Process** — dropdown badge: Not Started / Ongoing / Selected / Rejected (color-coded)
  - **Detail** — free-text notes per company (interview rounds, recruiter contact, etc.)
- 👤 **Developer profile page** — photo upload, name/age/education, categorized technical skills
  (Languages, Frontend, Backend, Databases, Tools, Core Concepts), editable project cards, professional
  links (LinkedIn, GitHub, LeetCode, Portfolio), and a full embedded resume PDF viewer with download
- 📈 **Dashboard** — quick stats overview (applied, positive responses, ongoing interviews, selected)
- 🎨 Professional, formal UI — dark sidebar, clean cards, color-coded status badges

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React 19 (Vite), Tailwind CSS, React Router, Axios, lucide-react |
| Backend     | Node.js, Express.js                      |
| Database    | MongoDB (Mongoose ODM)                   |
| Auth        | JSON Web Tokens (JWT), bcryptjs           |

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # User, City, Sector, Company schemas
│   ├── controllers/              # Route logic
│   ├── routes/                   # Express routes
│   ├── middleware/                # JWT auth + error handling
│   ├── server.js                  # App entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/                   # Axios instance + API call functions
    │   ├── components/            # Reusable UI + layout + tracker components
    │   ├── context/                # Auth + Toast context providers
    │   ├── pages/                  # Login, Register, Dashboard, Tracker, Profile
    │   ├── utils/                  # Status/badge configuration
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    ├── package.json
    └── .env
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Cloud**: create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and grab your connection string

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job-tracker
JWT_SECRET=replace_this_with_a_long_random_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string, e.g.
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/job-tracker`

Generate a strong JWT secret (optional helper):
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the backend:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start        # plain node
```

The API will run at `http://localhost:5000`. Test it: open `http://localhost:5000/api/health` — you should see `{"status":"ok"}`.

> A `backend/uploads/` folder (for profile photos and resume PDFs) is created automatically the first
> time you upload a file — no manual setup needed.

### 2. Frontend Setup

In a **new terminal**:

```bash
cd frontend
npm install
```

The `.env` file is already set up to point at `http://localhost:5000/api`. If your backend runs on a
different port, edit `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. First Use

1. Click **Create one** to register a new account (name, email, password).
2. You'll land on the **Dashboard**.
3. Go to **Job Tracker** → click **Add city** (e.g. "Noida") → click **Add sector** (e.g. "Sector 62")
   → click **Add company** to start logging companies.
4. Click the **Applied** button to toggle applied status (turns green).
5. Click the **Response** or **Process** badges to change status via dropdown.
6. Click **Detail → Add/View** to write notes about interview rounds.
7. Go to **My Profile** to build your developer profile: upload a photo, fill in your education and
   categorized skills, add your projects, add your LinkedIn/GitHub/LeetCode/Portfolio links, and
   upload your resume as a PDF (it displays in full below and can be downloaded any time).

---

## API Endpoints Reference

### Auth (`/api/auth`)
| Method | Endpoint               | Access  | Description              |
|--------|--------------------------|---------|--------------------------|
| POST   | `/register`               | Public  | Register a new user       |
| POST   | `/login`                   | Public  | Login, returns JWT        |
| GET    | `/profile`                 | Private | Get logged-in user's profile (includes skills, projects, links, resume info) |
| PUT    | `/profile`                  | Private | Update profile (JSON body, including `projects` array) |
| POST   | `/profile/photo`            | Private | Upload/replace profile photo (multipart, field name `photo`) |
| POST   | `/profile/resume`           | Private | Upload/replace resume PDF (multipart, field name `resume`) |
| DELETE | `/profile/resume`           | Private | Remove the current resume PDF |

Uploaded files are served statically from `/uploads/photos/...` and `/uploads/resumes/...` on the
backend, and are private to each user (filenames are namespaced by user ID).

### Cities (`/api/cities`)
| Method | Endpoint     | Access  | Description        |
|--------|---------------|---------|---------------------|
| GET    | `/`           | Private | List user's cities  |
| POST   | `/`           | Private | Create a city        |
| PUT    | `/:id`        | Private | Rename a city        |
| DELETE | `/:id`        | Private | Delete city (cascades to sectors + companies) |

### Sectors (`/api/sectors`)
| Method | Endpoint            | Access  | Description           |
|--------|----------------------|---------|------------------------|
| GET    | `/city/:cityId`       | Private | List sectors in a city |
| POST   | `/`                    | Private | Create a sector         |
| PUT    | `/:id`                 | Private | Rename a sector         |
| DELETE | `/:id`                 | Private | Delete sector (cascades to companies) |

### Companies (`/api/companies`)
| Method | Endpoint              | Access  | Description               |
|--------|------------------------|---------|----------------------------|
| GET    | `/`                     | Private | List all companies (any city/sector) |
| GET    | `/sector/:sectorId`     | Private | List companies in a sector |
| POST   | `/`                     | Private | Create a company entry      |
| PUT    | `/:id`                  | Private | Update a company entry (status, detail, etc.) |
| DELETE | `/:id`                  | Private | Delete a company entry      |

All `Private` routes require an `Authorization: Bearer <token>` header.

---

## Notes on Security

- Passwords are hashed with bcrypt before storage — plaintext passwords are never saved.
- All city/sector/company data is scoped to `req.user._id` — users can only ever see and modify their own data.
- JWT tokens expire after 7 days by default (`JWT_EXPIRES_IN` in `.env`).
- **Before deploying**, change `JWT_SECRET` to a long, random value and never commit your real `.env` file.

## Deployment Tips

- **Backend**: deploy to Render, Railway, or any Node host. Set environment variables from `.env.example` in your host's dashboard.
- **Frontend**: deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's URL.
- **Database**: use MongoDB Atlas for a free hosted cluster — update `MONGO_URI` accordingly.
- Update `CLIENT_URL` in the backend `.env` to your deployed frontend URL (for CORS).


*✅Built By - Sanchay Kumar Singh*
