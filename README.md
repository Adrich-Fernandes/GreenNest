# 🌿 GreenNest — Plant & Gardening Services Platform

> A full-stack web application where users can shop for plants and gardening products, book professional gardening appointments, and raise support queries. Built with **React + Vite** (frontend & admin), **Node.js + Express + MongoDB** (backend), and **Clerk** for authentication.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Three-App Architecture](#-three-app-architecture)
- [Project Structure](#-project-structure)
- [Features](#-features)
  - [User Features](#-user-features)
  - [Admin Features](#-admin-features)
  - [Gardener Features](#-gardener-features)
- [Pages & Routes](#-pages--routes)
  - [Frontend (Customer App)](#frontend-customer-app)
  - [Admin Panel](#admin-panel)
- [Backend API](#-backend-api)
  - [Product API](#product-api----apiproducts)
  - [User / Cart API](#user--cart-api----apiuser--apicart)
  - [Order API](#order-api----apiorders)
  - [Gardener API](#gardener-api----apigardener)
  - [Query API](#query-api----apiqueries)
  - [Admin API](#admin-api----apiadmin)
- [Database Models](#-database-models)
  - [User Model](#user-model)
  - [Product Model](#product-model)
  - [Order Model](#order-model)
  - [Gardener Model](#gardener-model)
  - [Query Model](#query-model)
- [Authentication & Middleware](#-authentication--middleware)
- [Role-Based Access Control](#-role-based-access-control)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Admin Panel Setup](#admin-panel-setup)
- [Environment Variables](#-environment-variables)

---

## 🌐 Overview

**GreenNest** is a modern e-commerce and gardening services platform with three key pillars:

1. **Shop** — Browse and buy indoor/outdoor plants, seeds, pots, tools, and more.
2. **Book a Gardener** — Find and book professional gardeners for home gardening appointments.
3. **Support** — Submit queries and track replies through a full support ticket system.

The platform has three separate applications sharing one backend:
- **Customer Frontend** — The public-facing shopping and booking site.
- **Admin Panel** — A restricted dashboard for admins to manage products, orders, gardeners, and queries.
- **Gardener Dashboard** — A dedicated view within the Admin Panel for gardeners to manage their appointments.

---

## 🧰 Tech Stack

### Frontend & Admin
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Lucide React | Icon library |
| Clerk React | Authentication (sign-in, sign-up, user sessions) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Clerk SDK (Node) | Server-side token verification |
| bcryptjs | Password hashing |
| JSON Web Tokens (JWT) | Token-based auth utilities |
| Nodemailer | Email notifications |
| dotenv | Environment variable management |
| CORS | Cross-Origin Resource Sharing |
| Nodemon | Auto-restart dev server |

---

## 🏗️ Three-App Architecture

```
GreenNest/
├── frontend/     → Customer-facing app  (runs on :5173)
├── Admin/        → Admin + Gardener app (runs on :5174)
└── backend/      → Shared REST API      (runs on :8000)
```

All three apps share the same MongoDB database and backend API. The frontend and admin panels are deployed as separate Vite apps with different Clerk configurations.

---

## 📁 Project Structure

```
GreenNest/
├── backend/
│   ├── config/
│   │   └── db.js                       # MongoDB connection setup
│   ├── Controller/
│   │   ├── userController.js           # User sync, cart, addresses
│   │   ├── productController.js        # Product CRUD
│   │   ├── orderController.js          # Place order, returns, cancellations
│   │   ├── gardenerController.js       # Gardener profiles & appointments
│   │   ├── queryController.js          # Support query management
│   │   └── adminController.js          # Dashboard stats
│   ├── models/
│   │   ├── userModel.js                # User schema (cart, wishlist, orders)
│   │   ├── productModel.js             # Product schema with stock hooks
│   │   ├── orderModel.js               # Order schema with tracking
│   │   ├── gardenerModel.js            # Gardener schema with appointments
│   │   └── queryModel.js              # Support query schema
│   ├── Routes/
│   │   ├── userRoutes.js               # User & cart API routes
│   │   ├── productRoutes.js            # Product API routes
│   │   ├── orderRoutes.js              # Order API routes
│   │   ├── gardenerRoutes.js           # Gardener API routes
│   │   ├── queryRoutes.js              # Query API routes
│   │   └── adminRoutes.js              # Admin stats route
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT/Clerk token protection
│   │   └── roleMiddleware.js           # Role enforcement
│   ├── .env
│   ├── package.json
│   └── server.js                       # Express app entry point
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── home.jsx                # Landing / homepage
│       │   ├── products.jsx            # Product listing & filters
│       │   ├── productView.jsx         # Single product detail page
│       │   ├── gardeners.jsx           # Gardener listing page
│       │   ├── gardenerView.jsx        # Single gardener profile & booking
│       │   ├── cart.jsx                # Shopping cart & checkout
│       │   ├── orders.jsx              # Order history & tracking
│       │   ├── appointments.jsx        # Booked gardening appointments
│       │   └── myQueries.jsx           # User's support queries
│       ├── components/
│       │   ├── userNavBar.jsx          # Top navigation bar
│       │   ├── footer.jsx              # Site footer with quick contact form
│       │   ├── Skeleton.jsx            # Skeleton loading components
│       │   ├── UserSync.jsx            # Clerk → MongoDB user sync
│       │   └── UserGuard.jsx           # Redirect unauthenticated users
│       ├── assets/
│       ├── App.jsx                     # Root component with routing
│       └── main.jsx                    # React entry point
│
└── Admin/
    └── src/
        ├── pages/
        │   ├── Login.jsx               # Admin login page
        │   ├── dashboard.jsx           # Stats overview dashboard
        │   ├── Products.jsx            # Product management (CRUD)
        │   ├── Orders.jsx              # Order management
        │   ├── Returns.jsx             # Return request management
        │   ├── Gardners.jsx            # Gardener management
        │   └── Queries.jsx             # Support query management
        ├── Gardner/
        │   └── dashboard.jsx           # Gardener's personal dashboard
        ├── components/
        │   ├── AdminNavBar.jsx         # Admin sidebar/navbar
        │   ├── GardenerNavBar.jsx      # Gardener-specific navbar
        │   ├── AdminLayout.jsx         # Shared admin layout wrapper
        │   ├── AdminGuard.jsx          # Restrict to admin role only
        │   ├── GardenerGuard.jsx       # Restrict to gardener role only
        │   ├── RoleGate.jsx            # Top-level role-based routing gate
        │   ├── Skeleton.jsx            # Admin skeleton loaders
        │   └── UserSync.jsx            # Clerk → MongoDB sync for admin
        ├── context/
        │   └── RoleContext.jsx         # Global role state context
        ├── App.jsx                     # Admin root with routing
        └── main.jsx                    # Admin React entry point
```

---

## ✨ Features

### 👤 User Features

#### 🏠 Homepage
- Hero banner with a call-to-action to explore plants and book gardeners.
- Featured product categories for quick navigation.
- Highlighted gardening services section.
- Quick contact/message form embedded in the footer (powered by Nodemailer).

#### 🌱 Product Browsing
- **Products Page** — Browse the full catalogue with category filters:
  - `Indoor`, `Outdoor`, `Flowering`, `Seeds`, `Pots & Planters`, `Tools`
- **Product View** — Detailed product page with images, price, stock status, description, and care instructions.
- **Out of Stock** / **Low Stock** indicators automatically shown based on stock count.
- Add to Cart directly from the product listing or product detail page.

#### 🛒 Cart & Checkout
- View all cart items with quantity controls.
- Update item quantities or remove products from cart.
- Choose a **saved delivery address** or add a new one at checkout.
- Select **payment method**: Cash on Delivery or Online.
- Order summary with subtotal, delivery charges, and total.
- **Wishlist** — Save products to a wishlist for later purchase.

#### 📦 Orders
- Full order history with real-time **status tracking**:
  - `Ordered → Shipped → Out for Delivery → Delivered`
- Visual step-by-step **tracking timeline** for every order.
- **Cancel Order** — Cancel an order before it is shipped.
- **Request Return** — Submit a return request after delivery with a reason and details.
- View expected delivery date and pickup date for returns.

#### 🌿 Gardeners
- **Gardeners Page** — Browse all available professional gardeners.
  - View their specialties, experience, location, rating, and base price.
- **Gardener Profile** — Detailed page showing the gardener's full bio, available services, and calendar.
- **Book Appointment** — Schedule a gardening appointment by selecting:
  - Service required
  - Date and time
  - Location
  - Duration and optional note
- Track and manage booked appointments from the **Appointments** page.
- **Cancel** or **Reschedule** an appointment.

#### 🆘 Support Queries
- Submit a query with your name, email, and message through the footer or My Queries page.
- Track all submitted queries and their statuses:
  - `Pending → In Progress → Update Requested → Resolved → Reopened`
- View admin replies directly in the My Queries section.
- **Request Update** — Ask the admin for a status update on a pending query.
- **Reopen** a resolved query if the issue persists.

#### 📍 Address Management
- Save multiple delivery addresses to your account.
- Set a **default address** for fast checkout.
- Add or delete addresses from the cart/checkout page.

---

### 🛠️ Admin Features

#### 📊 Dashboard (`/`)
- Real-time stats overview:
  - Total revenue, total orders, total products, total queries.
  - Recent orders and pending returns count.
- Quick links to all management sections.

#### 📦 Product Management (`/products`)
- **Add** new products with: name, nursery, category, price, stock, description, care instructions, and images.
- **Edit** product details inline.
- **Delete** products.
- Real-time **stock status** auto-updates (`Active`, `Low Stock`, `Out of Stock`) based on stock count.
- Real-time **search** and **category filter**.

#### 🧾 Order Management (`/orders`)
- View **all customer orders** across all users.
- **Update order status** through all fulfillment stages.
- Set **expected delivery date** for orders.
- Real-time search by customer name or product.
- View shipping address and payment method for each order.

#### 🔄 Return Management (`/returns`)
- View all orders with an active **return request**.
- Update return status: `Return Requested → Return Confirmed → Refunded`.
- Set **pickup date** for return logistics.

#### 🌿 Gardener Management (`/gardeners`)
- **Add** new gardeners (name, email, specialties, location, base price, bio, experience).
- **Edit** gardener profiles.
- **Delete** gardeners.
- View a gardener's appointment schedule and history.
- Real-time search by name or specialty.

#### 🎫 Query / Support Management (`/queries`)
- View all customer support queries.
- **Reply** to queries with an admin response.
- **Update status**: Pending → In Progress → Resolved.
- Real-time search by customer name or query content.

---

### 🌱 Gardener Features

Gardeners have a dedicated dashboard inside the Admin Panel (`/gardener/dashboard`) with a separate Gardener navigation bar.

#### 🗓️ Appointment Management
- View all incoming appointment requests.
- **Accept** or **Reject** pending appointments.
- Mark appointments as **Completed**.
- **Reschedule** appointments and propose a new date/time.
- Filter appointments by status: `Pending`, `Accepted`, `Completed`, `Canceled`, `Rescheduled`.

#### 👤 Profile Management
- Update personal bio, specialties, location, phone, base price, experience, and profile image.
- View rating and appointment statistics.

---

## 🗺️ Pages & Routes

### Frontend (Customer App)

| Path | Page | Auth Required |
|---|---|---|
| `/` | Home | No |
| `/products` | Product Listing | No |
| `/plants/:id` | Product Detail View | No |
| `/gardeners` | Gardener Listing | No |
| `/gardeners/:id` | Gardener Profile & Booking | No |
| `/cart` | Shopping Cart & Checkout | ✅ Yes |
| `/orders` | Order History & Tracking | ✅ Yes |
| `/appointments` | My Gardening Appointments | ✅ Yes |
| `/my-queries` | My Support Queries | ✅ Yes |

### Admin Panel

| Path | Page | Role Required |
|---|---|---|
| `/login` | Admin Login | Public |
| `/` | Dashboard | 🔐 Admin |
| `/products` | Product Management | 🔐 Admin |
| `/orders` | Order Management | 🔐 Admin |
| `/returns` | Return Management | 🔐 Admin |
| `/gardeners` | Gardener Management | 🔐 Admin |
| `/queries` | Query Management | 🔐 Admin |
| `/gardener/dashboard` | Gardener Dashboard | 🌿 Gardener |
| `/gardener/services` | Gardener Services | 🌿 Gardener |

---

## 🔌 Backend API

Base URL: `http://localhost:8000`

---

### Product API — `/api/products`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allProducts` | Fetch all products |
| `GET` | `/product/:id` | Fetch a single product by ID |
| `POST` | `/insertProduct` | Create a new product (admin) |
| `PUT` | `/updateProduct/:id` | Update a product by ID (admin) |
| `DELETE` | `/deleteProduct/:id` | Delete a product by ID (admin) |

---

### User / Cart API — `/api/user` & `/api/cart`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/user/sync` | Create or sync a Clerk user in MongoDB |
| `GET` | `/api/user/me` | Get authenticated user's profile |
| `GET` | `/api/cart/` | Get user's cart items |
| `POST` | `/api/cart/add` | Add a product to the cart |
| `PUT` | `/api/cart/update/:productId` | Update cart item quantity |
| `DELETE` | `/api/cart/remove/:productId` | Remove a product from the cart |
| `GET` | `/api/user/addresses` | Get saved delivery addresses |
| `POST` | `/api/user/addresses` | Add a new delivery address |
| `DELETE` | `/api/user/addresses/:id` | Delete a saved address |

---

### Order API — `/api/orders`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/place` | Place a new order |
| `GET` | `/my-orders` | Get all orders for the logged-in user |
| `POST` | `/:orderId/cancel` | Cancel an order |
| `POST` | `/:orderId/return` | Submit a return request |
| `GET` | `/admin/all` | Get all orders (admin) |
| `GET` | `/admin/returns` | Get all return requests (admin) |
| `PUT` | `/admin/:orderId/status` | Update an order's status (admin) |

---

### Gardener API — `/api/gardener`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all gardeners (public) |
| `GET` | `/profile/:id` | Get a gardener's profile (public) |
| `POST` | `/book-appointment` | Book an appointment with a gardener |
| `GET` | `/my-appointments/:userId` | Get all appointments for a user |
| `PUT` | `/cancel-appointment` | Cancel a booked appointment |
| `PUT` | `/reschedule-appointment` | Reschedule an appointment |
| `GET` | `/:clerkId` | Get gardener's own data (gardener only) |
| `POST` | `/update-profile` | Update gardener's own profile (gardener only) |
| `PUT` | `/appointment-status` | Update appointment status (gardener only) |
| `POST` | `/admin-add` | Add a new gardener (admin) |
| `PUT` | `/admin-update/:id` | Update a gardener (admin) |
| `DELETE` | `/:id` | Delete a gardener (admin) |

---

### Query API — `/api/queries`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/submit` | Submit a new support query |
| `GET` | `/all` | Get all queries (admin) |
| `GET` | `/user/:clerkId` | Get queries for a specific user |
| `PATCH` | `/:id/update-request` | User requests a status update |
| `PATCH` | `/:id/reply` | Admin replies to a query |
| `PATCH` | `/:id/reopen` | User reopens a resolved query |
| `PATCH` | `/:id/status` | Admin updates query status |

---

### Admin API — `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats` | Get dashboard statistics (revenue, orders, products, queries) |

---

## 🗃️ Database Models

### User Model

Stores user identity synced from Clerk, plus cart, wishlist, addresses, and order history.

| Field | Type | Description |
|---|---|---|
| `clerkId` | String | Unique ID from Clerk (primary identifier) |
| `name` | String | User's full name |
| `email` | String | User's email address |
| `role` | Enum | `"user"`, `"admin"`, or `"gardener"` (default: `"user"`) |
| `address[]` | Array | Saved delivery addresses with default flag |
| `cart[]` | Array | Cart items (product ref, quantity, addedAt) |
| `wishlist[]` | Array | Wishlist items (product ref, addedAt) |
| `orders[]` | Array | Embedded past/current orders with status and shipping address |

**Order Status Flow (in User model):**
```
pending → processing → shipped → delivered → cancelled
```

---

### Product Model

Includes an automatic pre-save hook that updates `status` and `inStock` based on stock count.

| Field | Type | Description |
|---|---|---|
| `name` | String | Product name |
| `nursery` | String | Nursery name (default: `"GreenNest"`) |
| `price` | Number | Selling price (₹) |
| `category` | Enum | Indoor / Outdoor / Flowering / Seeds / Pots & Planters / Tools |
| `stock` | Number | Available inventory count |
| `status` | Enum | Auto-set: `Active`, `Low Stock` (≤10), `Out of Stock` (0) |
| `inStock` | Boolean | Auto-set: `true` if stock > 0 |
| `rating` | Number | Product rating (0–5) |
| `description` | String | Product description |
| `careInstructions` | String | Plant care guide |
| `images` | [String] | Array of product image URLs |

**Automatic Stock Status Logic:**
```
stock = 0         → Out of Stock  (inStock: false)
stock = 1–10      → Low Stock     (inStock: true)
stock > 10        → Active        (inStock: true)
```

---

### Order Model

Standalone order documents with full tracking timeline support.

| Field | Type | Description |
|---|---|---|
| `user` | ObjectId | Reference to the User who placed the order |
| `items[]` | Array | Ordered products (name, qty, price, image, category) |
| `address` | Object | Snapshot of the delivery address at time of order |
| `subtotal` | Number | Item total before delivery charges |
| `delivery` | Number | Delivery fee |
| `total` | Number | Grand total |
| `status` | String | Human-readable status label |
| `statusKey` | Enum | Machine key: `ordered`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`, `cancel_requested`, `return_requested`, `return_confirmed`, `refunded` |
| `tracking[]` | Array | Step-by-step tracking labels with timestamps |
| `canCancel` | Boolean | Whether the order can still be cancelled |
| `canReturn` | Boolean | Whether a return can be requested |
| `paymentMethod` | Enum | `cash` or `online` |
| `returnStatus` | String | Current return processing status |
| `returnDate` | Date | Date return was requested |
| `pickupDate` | Date | Scheduled pickup date |
| `expectedDeliveryDate` | Date | Estimated delivery date |
| `returnReason` | String | Customer's reason for return |

**Order Lifecycle:**
```
ordered → shipped → out_for_delivery → delivered
        ↓
   cancel_requested → cancelled
                             ↓
                    return_requested → return_confirmed → refunded
```

---

### Gardener Model

| Field | Type | Description |
|---|---|---|
| `clerkId` | String | Unique Clerk ID (links to user account) |
| `name` | String | Gardener's full name |
| `email` | String | Gardener's email |
| `phone` | String | Contact number |
| `location` | String | Service area / city |
| `basePrice` | Number | Starting price per appointment (₹) |
| `specialties[]` | [String] | Skills (e.g. Pruning, Lawn Care, Landscaping) |
| `bio` | String | Short personal bio |
| `profileImage` | String | Profile image URL |
| `rating` | Number | Average customer rating |
| `experience` | String | Years of experience |
| `status` | Enum | `active` or `inactive` |
| `appointments[]` | Array | All bookings with customer, date, service, price, status |

**Appointment Status Flow:**
```
Pending → Accepted → Completed
        → Canceled
        → Rescheduled
```

---

### Query Model

| Field | Type | Description |
|---|---|---|
| `name` | String | Customer's name |
| `email` | String | Customer's email |
| `query` | String | The message/question |
| `clerkId` | String | Clerk ID of the logged-in user (optional) |
| `status` | Enum | `Pending`, `In Progress`, `Update Requested`, `Resolved`, `Reopened` |
| `adminReply` | String | Admin's response message |

---

## 🔐 Authentication & Middleware

GreenNest uses **[Clerk](https://clerk.com)** for authentication on both the frontend and backend.

### How it works:
1. User signs in via Clerk on the frontend.
2. The `UserSync` component automatically calls `POST /api/user/sync` to create or update the user record in MongoDB.
3. Clerk issues a **session token** which is sent in the `Authorization: Bearer <token>` header on protected requests.
4. The backend `authMiddleware.js` verifies the token using the **Clerk SDK for Node** and attaches the user to the request.

### Middleware Layers

| Middleware | Purpose |
|---|---|
| `protect` | Verifies the Clerk token; rejects unauthenticated requests |
| `isAdmin` | Ensures `user.role === "admin"`; blocks non-admins |
| `isUser` | Ensures `user.role === "user"` |
| `isGardener` | Ensures `user.role === "gardener"`; blocks others from gardener routes |

---

## 🛡️ Role-Based Access Control

GreenNest supports **three roles**:

| Role | Access |
|---|---|
| `user` | Frontend shopping, cart, orders, appointments, queries |
| `admin` | Full Admin Panel — products, orders, returns, gardeners, queries, dashboard stats |
| `gardener` | Gardener Dashboard — manage own appointments and profile only |

### Frontend (Customer App)
- Public pages (Home, Products, Gardeners) are accessible to everyone.
- Protected pages (`/cart`, `/orders`, `/appointments`, `/my-queries`) require a signed-in user via `UserGuard`.

### Admin Panel
- `RoleGate` wraps all routes and checks the user's role on load.
- `AdminGuard` restricts admin-only pages — non-admins are redirected to `/login`.
- `GardenerGuard` restricts gardener pages — non-gardeners are redirected away.
- Role is assigned **manually** in MongoDB by setting `role` to `"admin"` or `"gardener"`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local or MongoDB Atlas)
- **Clerk account** — [clerk.com](https://clerk.com) (separate apps for frontend and admin)
- **npm** package manager

---

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your .env file (see Environment Variables section)

# Start development server
npm run dev

# OR start production server
npm start
```

The backend runs on **http://localhost:8000** by default.

---

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create your .env file
# Add VITE_CLERK_PUBLISHABLE_KEY

# Start development server
npm run dev
```

The frontend runs on **http://localhost:5173** by default.

---

### Admin Panel Setup

```bash
# Navigate to the admin directory
cd Admin

# Install dependencies
npm install

# Create your .env file
# Add VITE_CLERK_PUBLISHABLE_KEY (use a separate Clerk app for admin)

# Start development server
npm run dev
```

The admin panel runs on **http://localhost:5174** by default.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` files.

### Backend (`backend/.env`)
```env
PORT=8000
DB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_for_nodemailer
EMAIL_PASS=your_email_password_or_app_password
```

### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:8000
```

### Admin Panel (`Admin/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_admin_clerk_publishable_key
VITE_API_URL=http://localhost:8000
```

---


---

## 👨‍💻 Author

**Adrich Fernandes**

---

## 📄 License

This project is licensed under the **ISC License**.