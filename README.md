# SupportDesk AI

An AI-powered customer support ticket management system. Every ticket is automatically categorized, prioritized, and summarized by Gemini AI the moment it is submitted.

---

## Live Demo

> Frontend: `https://supportdesk-ai.vercel.app` *(update after deployment)*  
> Backend API: `https://supportdesk-ai-server.onrender.com` *(update after deployment)*

---

## Features

- Submit support tickets with name, email, title, and description
- AI automatically assigns **category** (Billing, Technical, Account, General)
- AI automatically assigns **priority** (Low, Medium, High)
- AI generates a concise **summary** of the issue
- View all tickets with **filter by status and priority**
- Update ticket status (Open → In Progress → Resolved)
- Pre-seeded with 6 realistic tickets for immediate demo
- Graceful AI failure — ticket always saves even if AI is unavailable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS 4 |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon cloud) |
| AI | Google Gemini API |
| State Management | React Context API |
| HTTP Client | Axios |
| Notifications | React Toastify |

---

## Project Structure

```
support-ticket-ai/
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool + schema + seed
│   ├── controllers/
│   │   └── ticketController.js    # Business logic for all ticket operations
│   ├── models/
│   │   └── ticketModel.js         # All SQL queries (data access layer)
│   ├── routes/
│   │   └── ticketRoute.js         # Express router — URL to controller mapping
│   ├── services/
│   │   └── aiService.js           # Gemini AI integration (isolated)
│   ├── .env.example               # Environment variable template
│   └── server.js                  # Entry point
│
└── client/                        # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── TicketCard.jsx      # Ticket preview card with badges
    │   │   ├── PriorityBadge.jsx   # Colored priority pill (High/Med/Low)
    │   │   └── CategoryBadge.jsx   # Colored category tag
    │   ├── Pages/
    │   │   ├── Home.jsx            # Dashboard with stats
    │   │   ├── TicketList.jsx      # All tickets with filters
    │   │   ├── CreateTicket.jsx    # Ticket submission form
    │   │   └── TicketDetail.jsx    # Full ticket + AI analysis + status update
    │   ├── context/
    │   │   └── AppContext.jsx      # Global state (tickets, loading, backendUrl)
    │   ├── App.jsx                 # Route definitions
    │   └── main.jsx                # React entry point
    ├── .env.example
    └── index.html
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  Home → TicketList → CreateTicket → TicketDetail        │
│  Context API holds global tickets state                  │
└────────────────────┬────────────────────────────────────┘
                     │ Axios HTTP requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Express REST API                        │
│  GET  /api/ticket/list      → all tickets               │
│  GET  /api/ticket/:id       → single ticket             │
│  POST /api/ticket/create    → create + trigger AI       │
│  POST /api/ticket/status/:id → update status            │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│  PostgreSQL DB   │      │   Gemini AI API       │
│  (Neon Cloud)    │      │                       │
│  tickets table   │      │  classify + prioritize│
│                  │      │  + summarize ticket   │
└──────────────────┘      └──────────────────────┘
```

**Ticket Creation Flow:**
1. User submits form → React sends `POST /api/ticket/create`
2. Express validates fields
3. Ticket saved to PostgreSQL immediately *(AI never blocks the save)*
4. Express calls Gemini API with ticket title + description
5. Gemini returns `{ category, priority, summary }` as JSON
6. Express updates ticket record with AI results
7. Complete ticket returned to frontend
8. React redirects to ticket detail page showing AI analysis

---

## Database Schema

```sql
CREATE TABLE tickets (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    customer_name   VARCHAR(100) NOT NULL,
    customer_email  VARCHAR(150) NOT NULL,
    category        VARCHAR(50) DEFAULT NULL,   -- filled by AI
    priority        VARCHAR(20) DEFAULT NULL,   -- filled by AI
    summary         TEXT DEFAULT NULL,          -- filled by AI
    status          VARCHAR(30) DEFAULT 'Open',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## REST API Reference

### GET `/api/ticket/list`
Returns all tickets ordered by newest first.

**Response:**
```json
{
  "success": true,
  "tickets": [
    {
      "id": 1,
      "title": "Cannot login to my account",
      "customer_name": "John Smith",
      "customer_email": "john@example.com",
      "category": "Account",
      "priority": "High",
      "status": "Open",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET `/api/ticket/:id`
Returns single ticket with full details including description and AI summary.

**Response:**
```json
{
  "success": true,
  "ticket": {
    "id": 1,
    "title": "Cannot login to my account",
    "description": "I have been trying to login since yesterday...",
    "customer_name": "John Smith",
    "customer_email": "john@example.com",
    "category": "Account",
    "priority": "High",
    "summary": "User cannot login despite multiple password resets.",
    "status": "Open",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST `/api/ticket/create`
Creates a new ticket and triggers AI analysis.

**Request body:**
```json
{
  "title": "Payment failed during checkout",
  "description": "My card was declined even though my bank confirmed the charge.",
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticket": { ...complete ticket with AI fields populated }
}
```

### POST `/api/ticket/status/:id`
Updates ticket status.

**Request body:**
```json
{ "status": "In Progress" }
```
Valid values: `"Open"`, `"In Progress"`, `"Resolved"`

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) account (free)
- A [Google AI Studio](https://aistudio.google.com) account (free)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/support-ticket-ai.git
cd support-ticket-ai
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env` from the example:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=4000
DATABASE_URL=postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=AIzaSy-your-key-here
```

Getting your credentials:
- **DATABASE_URL** → [neon.tech](https://neon.tech) → Your project → Connection Details → copy connection string
- **GEMINI_API_KEY** → [aistudio.google.com](https://aistudio.google.com) → Get API Key → Create API key

Start the server:

```bash
npm run dev
```

Expected output:
```
Server started on port 4000
PostgreSQL connected successfully
Database seeded with sample tickets
```

Verify at `http://localhost:4000` → should show `API WORKING`

### 3. Frontend setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `4000` |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://...` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_BACKEND_URL` | Backend API base URL | `http://localhost:4000` |

---

## Key Design Decisions

**Why AI failure never breaks ticket creation**  
The Gemini API call is wrapped in its own `try/catch` inside the ticket creation controller. The ticket is saved to the database before AI is called. If AI fails (rate limit, API down), the ticket is still created with `category`, `priority`, `summary` as NULL. The frontend handles NULL gracefully by showing "Analyzing..." badges.

**Why PostgreSQL over MongoDB**  
Support tickets are structured data — every ticket has exactly the same fields. Relational databases excel at consistent schemas with strong data integrity guarantees.

**Why Gemini API call is isolated in `services/aiService.js`**  
Switching AI providers (Gemini → Claude → OpenAI) requires changing one file only. Controllers never import the AI SDK directly.

**Why Context API over Redux**  
The app manages one primary resource (tickets) with simple read/write operations. Redux adds significant boilerplate that isn't justified at this scale.

---

## .env.example files

**`server/.env.example`:**
```env
PORT=4000
DATABASE_URL=your_neon_connection_string_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**`client/.env.example`:**
```env
VITE_BACKEND_URL=http://localhost:4000
```
