# ✦ SHUBHRESTRO — Fine Indian Vegetarian Dining Web Application

> **ShubhRestro** is an ultra-luxury fine Indian vegetarian restaurant web application built on the MERN stack (MongoDB, Express, React, Node.js) with real-time Socket.io communication. The interface is a pixel-faithful implementation of the luxury design system, conforming strictly to the `cinematic_noir` aesthetic tokens (sharp geometric edges, warm amber gold accents, dark obsidian glassmorphism, and Playfair Display / Montserrat typography) celebrating 100% vegetarian culinary heritage.

---

## 🏛 System Architecture & Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Custom Design System Tokens (`cinematic_noir/DESIGN.md`)
- **Routing:** React Router v6
- **Real-Time Client:** Socket.io Client (`socket.io-client`)
- **State Management:** React Context (`AuthContext`, `CartContext`) with localStorage persistence
- **Testing:** Vitest + React Testing Library (Unit/Component), Playwright (End-to-End browser tests)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (`shubh_restro`) with Mongoose ODM
- **Real-Time Server:** Socket.io (WebSocket engine with room isolation)
- **Authentication:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Validation:** Zod schemas
- **File Uploads:** Multer with secure disk storage (`uploads/`)
- **Testing:** Vitest + Supertest + Vitest Socket.io integration test

---

## 📁 Repository Structure

```
restro_shubh/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection & env variables
│   │   ├── controllers/    # Express controllers (auth, menu, order, booking, review, gallery, admin)
│   │   ├── middleware/     # Auth, admin guard, error handling, Zod validation, Multer
│   │   ├── models/         # Mongoose models (User, MenuItem, Order, Booking, Table, Review, GalleryImage)
│   │   ├── routes/         # Express REST API routes
│   │   ├── sockets/        # Socket.io event engine & room handlers
│   │   ├── utils/          # ID generators (SHUBH-ORD, SHUBH-BKG) & seed script
│   │   ├── app.js          # Express app definition
│   │   └── server.js       # HTTP server & Socket.io initialization
│   ├── __tests__/          # Vitest backend suites (API, models, real-time sockets)
│   ├── uploads/            # Uploaded gallery & menu item images
│   └── package.json
├── frontend/
│   ├── e2e/                # Playwright End-to-End test suites
│   ├── src/
│   │   ├── components/     # Layout, Navbar, Footer, AdminLayout, Route Guards
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── hooks/          # useSocketEvent hook
│   │   ├── pages/          # 12 Customer Pages + 8 Admin Back-Office Pages
│   │   │   ├── admin/      # Admin Login, Overview, Orders, Reservations, Menu, Gallery, Reviews, CRM
│   │   │   ├── Home.jsx, Menu.jsx, ItemDetails.jsx, ShoppingCart.jsx, Checkout.jsx,
│   │   │   ├── OrderTracking.jsx, BookATable.jsx, Gallery.jsx, GuestReviews.jsx,
│   │   │   └── LoginRegister.jsx, MyAccount.jsx, NotFound.jsx
│   │   ├── services/       # Axios API client & Socket.io client
│   │   ├── styles/         # Custom luxury theme styles & Tailwind entry
│   │   └── App.jsx         # Client-side routing configuration
│   └── package.json
├── design-reference/       # Original Stitch 20-screen UI export & DESIGN.md
├── KNOWN_ISSUES.md         # Operational notes & resolved environment details
└── README.md
```

---

## 🔑 Default Credentials & Database Seeding

Run the seed script in the backend to initialize tables, menu items, reviews, gallery photos, and test accounts:

```bash
cd backend
node src/utils/seed.js
```

### Pre-Configured Accounts:
| Role | Name | Email | Password |
|---|---|---|---|
| **Executive Admin** | Shubham Pandey | `admin@shubhrestro.com` / `admin@gmail.com` | `Admin123` |
| **Loyal Patron (Customer)** | Rahul Sharma | `rahul.sharma@gmail.com` / `customer@gmail.com` | `Customer123!` |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/shubh_restro
JWT_SECRET=it_is_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Running the Application Locally

### 1. Prerequisites
- Node.js v18+
- MongoDB instance running locally on `mongodb://127.0.0.1:27017`

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server starts on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser to experience ShubhRestro.

---

## 🛡️ Automated Quality Gates & Test Suites

Every quality gate is automated and verified with zero errors:

### Backend Quality Gates
```bash
cd backend

# 1. Lint Check
npm run lint

# 2. TypeScript Compilation Check
npx tsc --noEmit

# 3. Unit & Integration Test Suites (API, Models, and Real-Time Sockets)
npm test
```
*Result: 4 passed test suites, 53 passed tests.*

### Frontend Quality Gates
```bash
cd frontend

# 1. Lint Check
npm run lint

# 2. TypeScript Compilation Check
npx tsc --noEmit

# 3. Unit & Component Test Suites (CartContext, CheckoutForm, BookATable)
npm test

# 4. Production Build Verification
npm run build

# 5. Playwright End-to-End Test Suite (Full customer ordering, table booking, admin route guards, and live Socket.io cross-browser push)
npx playwright test
```
*Result: 3 passed Vitest component test suites (9 tests).*

---

## ⚡ Real-Time Socket.io Features

ShubhRestro implements instant, bi-directional event delivery:
- **`order:created`**: Emitted when a customer finishes checkout; instantly notifies connected admin dashboards without page reload.
- **`order:status_changed`**: Broadcasts status transitions (`confirmed` → `preparing` → `ready` → `delivered`) to the customer order tracking view.
- **`booking:created`**: Immediately alerts host/management screen with party details and reservation time.
- **`booking:status_changed`**: Pushes reservation confirmation updates.
- **`stats:updated`**: Triggers real-time revenue and active order counter recalculations in the admin overview.

---

## 🎨 Design System Compliance

Faithfully implements the **Cinematic Noir** tokens:
- **Zero Border Radii:** Strict geometric elegance (`border-radius: 0px` across cards, buttons, inputs, and modals).
- **Luxury Color Palette:**
  - Obsidian Noir (`#131315`, `#1b1b1d`, `#202022`)
  - Warm Candlelight Gold / Amber (`#d4a373`, `#e9c46a`, `#e5c158`)
  - Deep Bronze accents (`#b08968`, `#7f5539`)
- **Typography:**
  - Headlines: *Playfair Display* (serif, high contrast, elegant letterforms)
  - Body & UI: *Montserrat* / *Plus Jakarta Sans* (sans-serif, tracked uppercase labels)
