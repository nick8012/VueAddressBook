# Vue Address Book

A full-stack address book application built with Vue 3, Express, and SQLite. Manage your contacts with full CRUD functionality, shared schema validation, phone number input masking, and a responsive design that works on both desktop and mobile.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Vue 3 + Vite | Reactive SPA with fast dev server |
| HTTP Client | Axios | API communication from the frontend |
| API | Express + TypeScript | REST API server |
| Validation | Zod | Shared schema validation across frontend and backend |
| ORM | Drizzle ORM | Type-safe database queries |
| Database | SQLite (better-sqlite3) | Lightweight relational data storage |
| Package Management | npm Workspaces | Monorepo dependency management |
| Process Manager | PM2 | Keeps the Node.js app running in production |

---

## Project Structure

```
VueAddressBook/
├── API/                              # Express + TypeScript REST API
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle database connection
│   │   │   └── schema.ts             # Database table definitions
│   │   ├── routes/
│   │   │   └── contactRouter.ts      # HTTP route handlers
│   │   ├── services/
│   │   │   └── contactService.ts     # Database CRUD operations
│   │   └── index.ts                  # Express app entry point
│   ├── .env                          # Local environment variables (not committed)
│   ├── contacts.db                   # SQLite database file (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                         # Vue 3 + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── contacts.ts           # Axios API calls
│   │   ├── assets/
│   │   │   └── main.css              # Global styles and CSS variables
│   │   ├── components/
│   │   │   ├── ContactForm.vue       # Add and edit contact form
│   │   │   └── ContactList.vue       # Contact table and layout
│   │   ├── App.vue                   # Root component
│   │   └── main.ts                   # Vue app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── shared/                           # Shared code between API and frontend
│   ├── contactSchema.ts              # Zod validation schema
│   ├── index.ts                      # Package exports
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                      # Root workspace package.json
└── README.md
```

---

## Features

- View all contacts in a responsive table layout
- Add new contacts via a validated form
- Edit existing contacts
- Delete contacts
- Shared Zod validation schema used on both frontend and backend
- Real-time field validation on blur and input events
- Invalid fields highlighted in red, clearing as soon as requirement is met
- Address group cross-field validation — if any address field is filled, all are required
- Phone number input masking — digits only, auto-formatted as `233-456-7890`
- State auto-capitalised on input
- Phone numbers stored as raw digits, displayed formatted
- Responsive mobile layout with card-style rows and column labels

---

## Validation Rules

| Field | Rule |
|---|---|
| First Name | Required |
| Last Name | Required |
| Email | Required if no phone number provided, must be valid email format |
| Phone | Required if no email provided, must be exactly 10 digits, numbers only, auto-formatted with hyphens |
| Street Address | Optional, max 50 characters, letters/numbers/periods/hyphens only |
| City | Optional, max 30 characters, letters and hyphens only |
| State | Optional, exactly 2 letters, auto-capitalised |
| Zip | Optional, exactly 5 digits, numbers only |

> If any address field (street, city, state, zip) is filled in, all four become required.
> Empty fields in an incomplete address group are highlighted in red on form submission.

---

## Architecture Notes

### Separation of Concerns
The API is split into two distinct layers:
- **`contactRouter.ts`** — handles HTTP requests and responses only, no database logic
- **`contactService.ts`** — handles all database operations, no HTTP concepts

### Shared Validation
The Zod schema in `shared/contactSchema.ts` is imported by both the frontend and backend. This guarantees validation rules are identical in both places and can never fall out of sync. The frontend validates before making an API call for immediate user feedback, and the backend validates again as a safety net.

### CSS Variable Theming
All colours are defined as CSS custom properties in `main.css` under `:root`. Components reference these variables rather than hard-coded values, making the theme easy to update globally.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

Clone the repository and install all dependencies from the root:

```bash
git clone https://github.com/your-username/VueAddressBook.git
cd VueAddressBook
npm install
```

### Environment Setup

Create a `.env` file in the `API/` folder:

```
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
PORT=3000
```

### Database Setup

Run the Drizzle migration to create the database tables:

```bash
cd API
npx drizzle-kit push --dialect=sqlite --schema=src/db/schema.ts --url=contacts.db
```

### Running the App

You need two terminals running simultaneously:

**Terminal 1 — API:**
```bash
cd API
npm run dev
```
API runs on `http://localhost:3000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Create a new contact |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

All `POST` and `PUT` requests are validated against the shared Zod schema. Invalid requests return a `400 Bad Request` with field-level error details.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `ALLOWED_ORIGIN` | The frontend URL allowed by CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Port the API runs on | `3000` |

In production, set these through your hosting platform's environment variable settings. No code changes are required between environments.

---

## Deployment

### First Time Setup

1. SSH into your server:
```bash
ssh username@your-server-ip
```

2. Clone the repository:
```bash
git clone https://github.com/nick8012/VueAddressBook.git
cd VueAddressBook
```

3. Install dependencies:
```bash
npm install
```

4. Create the production `.env` file:
```bash
cd API
nano .env
```
```
NODE_ENV=production
ALLOWED_ORIGIN=https://yourdomain.com
PORT=3000
```

5. Run the database migration:
```bash
npx drizzle-kit push --dialect=sqlite --schema=src/db/schema.ts --url=contacts.db
```

6. Build the API:
```bash
cd ..
cd API && npm run build
```

7. Build the frontend:
```bash
cd ../frontend && npm run build
```

8. Start with PM2:
```bash
npm install -g pm2
cd ..
pm2 start API/dist/src/index.js --name vue-address-book
pm2 save
pm2 startup
```

### Subsequent Deployments

```bash
ssh username@your-server-ip
cd VueAddressBook
git pull
npm install
cd API && npm run build
cd ../frontend && npm run build
cd ..
pm2 restart vue-address-book
```

---

## Future Improvements

- Search and filter contacts
- Sort by column
- Pagination for large contact lists
- Export contacts to CSV
- Authentication
- Switch to PostgreSQL for multi-user support