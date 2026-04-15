# 🚗 JustzRent — Full-Stack Car Rental Platform

> A production-ready car rental web application built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

**Live Demo:** [justzrent.vercel.app](https://justzrent.vercel.app) &nbsp;|&nbsp; **Portfolio:** [elbatin.com](https://elbatin.com)

---

![JustzRent Hero](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80)

---

## ✨ Features

### Customer-Facing
- **Homepage** — Full-viewport hero with live search form, featured vehicles grid, "Why Us" section, and customer testimonials
- **Fleet Page** — Filterable & sortable vehicle listing (category, transmission, price range) with real-time client-side filters
- **Vehicle Detail** — Interactive image gallery, full specs table, live price calculator with optional extras
- **Booking Flow** — Multi-step booking: customer info form → order summary → confirmation page with unique reference number
- **Dark / Light Theme** — Persistent theme toggle with `next-themes`
- **WhatsApp CTA** — Floating quick-contact button

### Admin Panel (`/admin`)
- Password-protected dashboard (cookie-based auth)
- Stats overview: total vehicles, pending/confirmed/cancelled bookings
- **Vehicle CRUD** — Add, edit, delete vehicles with image management
- **Booking Management** — View all bookings, confirm or cancel with one click

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Database | Supabase (PostgreSQL) |
| ORM / Client | @supabase/ssr |
| Auth | Cookie-based admin auth |
| Fonts | Geist Sans via `next/font` |
| Icons | Lucide React |
| Toasts | Sonner |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── fleet/page.tsx              # Fleet listing with filters
│   ├── vehicles/[id]/page.tsx      # Vehicle detail + price calculator
│   ├── booking/page.tsx            # Customer info + order summary
│   ├── booking/confirmation/       # Confirmation page
│   ├── admin/                      # Protected admin panel
│   │   ├── layout.tsx              # Auth guard
│   │   ├── page.tsx                # Dashboard
│   │   ├── vehicles/page.tsx       # Vehicle CRUD
│   │   └── bookings/page.tsx       # Booking management
│   └── api/admin/auth/route.ts     # Admin auth API
├── components/
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── vehicle-card.tsx
│   ├── vehicle-filters.tsx
│   ├── price-calculator.tsx
│   ├── image-gallery.tsx
│   ├── booking-form.tsx
│   ├── hero-search-form.tsx
│   ├── whatsapp-button.tsx
│   ├── theme-toggle.tsx
│   └── admin/
│       ├── vehicle-form.tsx
│       ├── vehicles-client.tsx
│       └── booking-status-buttons.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server client (SSR)
│   ├── actions/
│   │   ├── bookings.ts             # Server Actions
│   │   └── vehicles.ts             # Server Actions
│   └── utils.ts
└── types/index.ts
```

---

## 🗄 Database Schema

### `vehicles`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Model name |
| `brand` | text | Manufacturer |
| `year` | int | Production year |
| `category` | text | economy / suv / luxury / minivan |
| `daily_price` | numeric | EUR per day |
| `transmission` | text | automatic / manual |
| `seats` | int | Passenger capacity |
| `fuel_type` | text | petrol / diesel / electric / hybrid |
| `images` | text[] | Array of image URLs |
| `is_available` | boolean | Availability flag |

### `bookings`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | Primary key |
| `reference` | text | Unique `JR-XXXXXXXX` ref |
| `vehicle_id` | uuid | FK → vehicles |
| `customer_name/email/phone` | text | Customer info |
| `pickup_date` / `return_date` | date | Rental period |
| `extras` | jsonb | insurance, gps, child_seat |
| `total_price` | numeric | Calculated total |
| `status` | text | pending / confirmed / cancelled |

RLS is enabled on both tables. Public users can read vehicles and insert bookings. Admin operations use the service role.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo
```bash
git clone https://github.com/elbatin/JustzRent.git
cd JustzRent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_WHATSAPP_NUMBER=905551234567
```

### 4. Set up the database
Run the following SQL in your Supabase SQL editor:

```sql
-- Vehicles table
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  year int NOT NULL,
  category text NOT NULL CHECK (category IN ('economy','suv','luxury','minivan')),
  daily_price numeric(10,2) NOT NULL,
  transmission text NOT NULL CHECK (transmission IN ('automatic','manual')),
  seats int NOT NULL,
  fuel_type text NOT NULL,
  description text,
  images text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text UNIQUE NOT NULL DEFAULT 'JR-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  extras jsonb DEFAULT '{}',
  total_price numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_bookings" ON bookings FOR SELECT USING (true);
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Admin Access

Visit `/admin/login` and enter your `ADMIN_PASSWORD`.

Default (development): `justzrent2024`

---

## 📸 Screenshots

| Page | Preview |
|---|---|
| Homepage Hero | ![Hero](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=70) |
| Fleet | ![Fleet](https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=70) |
| Luxury | ![Luxury](https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=70) |

---

## 🧑‍💻 About

Built by **[Batın](https://elbatin.com)** as a full-stack portfolio project demonstrating:

- Next.js 16 App Router patterns (Server Components, Server Actions, async params)
- Supabase integration with Row-Level Security
- Type-safe full-stack TypeScript
- Modern UI with shadcn/ui and Tailwind CSS v4
- Cookie-based admin authentication without an auth library
- Responsive design with dark/light theming

---

## 📄 License

MIT — feel free to use this as a reference or starting point for your own projects.

---

<div align="center">
  <sub>Designed & built with ❤️ by <a href="https://elbatin.com">Batın</a></sub>
</div>