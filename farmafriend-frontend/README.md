# FarmaFriend ERP — Frontend

A React 19 single-page application for the FarmaFriend ERP system, built against the
consolidated 6-table backend (Finance/EMI module removed; Customer/Dealer/Representative
Executive unified into one `users` table; Payment and Shipment folded into `Order`).

## Design

- **Palette** — deep fern green (`#0B6E4F`, primary/trust), saffron gold (`#E8A33D`, accent/CTA),
  near-black ink (`#16241F`, text), pale mint-paper (`#F3F6F4`, background).
- **Type** — `Fraunces` (serif, used sparingly for headlines), `Plus Jakarta Sans` (UI/body),
  `IBM Plex Mono` (prices, order IDs, tracking numbers — gives figures a precise, data-terminal feel).
- **Signature motif** — a dotted "connected route" line linking the admin dashboard's KPI cards
  (Customers → Dealers → Products → Orders → Shipments), echoing the actual supply chain, reused
  as a background accent on the auth screen and storefront hero. Status pills use a consistent
  color language across orders, payments, and shipments (`StatusChip`).
- **Layout** — branded split-screen auth page; ink-dark sidebar console for Admin/Dealer/RE;
  warm, card-based storefront for customers.

All tokens live in `src/theme.js`.

## Tech Stack
React 19, React Router 6, Redux Toolkit, Axios, Material UI (custom themed), React Hook Form + Yup,
Chart.js (via react-chartjs-2), React Toastify.

## Project Structure
```
src/
├── components/     Logo (brand mark), StatusChip, Loader, PageHeader, ConfirmDialog, EmptyState
├── pages/
│   ├── auth/        Login, Register, Forgot Password
│   ├── customer/    Home, Products, Product Details, Cart, Checkout, Orders, Invoice, Profile
│   ├── admin/        Dashboard, Customers, Products (+ stock), Dealers, Orders
│   ├── dealer/       Dashboard, My Products (+ stock), Shipments
│   └── re/           Assigned Customers
├── layouts/         AuthLayout, MainLayout (customer), AdminLayout, DealerLayout, RELayout,
│                    DashboardLayout (shared ink sidebar shell)
├── redux/           store.js + slices (auth, cart, products, orders)
├── services/        Axios wrappers — one file per backend resource
├── routes/          AppRoutes.jsx (routing + role-based protection), ProtectedRoute.jsx
├── hooks/           useAuth.js
└── theme.js         Design tokens + MUI theme overrides
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure the API URL
Copy `.env.example` to `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run the dev server
```bash
npm run dev
```
Opens on `http://localhost:5173`.

### 4. Build for production
```bash
npm run build
npm run preview
```

## Roles & Redirects
On login, the app redirects based on account role:
- `ADMIN` → `/admin/dashboard`
- `CUSTOMER` → `/customer/home`
- `DEALER` → `/dealer/dashboard`
- `REPRESENTATIVE_EXECUTIVE` → `/re/customers`

## Notes on the Consolidated Backend
- There is no Finance/EMI module — no such pages or API calls exist in this frontend.
- Customers, Dealers, and Representative Executives are all just `User` accounts server-side.
  A logged-in dealer's own `userId` **is** their dealer ID — no separate lookup is needed
  (see `pages/dealer/*`).
- Payment and shipment actions are sub-resources of Order: `POST /orders/payment`,
  `POST /orders/shipment`, `PUT /orders/{id}/shipment-status` — handled entirely in
  `services/orderService.js`.
- JWT access & refresh tokens are stored in `localStorage`; Axios auto-attaches and
  transparently refreshes them on a 401 (see `services/axiosInstance.js`).
