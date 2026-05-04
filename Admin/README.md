# 🛠️ GreenNest — Admin & Gardener Panel

This is the management dashboard for GreenNest, used by administrators to manage the platform and gardeners to handle their appointments.

## 🚀 Key Features

### 🔐 For Administrators
- **Stats Dashboard**: Real-time overview of revenue, orders, products, and queries.
- **Product Management**: Full CRUD operations for the plant catalog with automatic stock status.
- **Order Fulfillment**: Update order statuses and manage delivery timelines.
- **Return Processing**: Handle customer return requests and schedule pickups.
- **Gardener Management**: Onboard and manage professional gardener profiles.
- **Support Tickets**: Reply to and resolve customer support queries.

### 🌿 For Gardeners
- **Appointment Dashboard**: View and manage incoming service requests.
- **Service Management**: Update your bio, specialties, and pricing.
- **Schedule Tracking**: Accept, completed, or reschedule appointments.

## 🛠️ Setup and Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory and add:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_admin_clerk_publishable_key
   VITE_API_URL=http://localhost:8000
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Architecture
- Built with **React 19** and **Vite**.
- Styled using **Tailwind CSS 4**.
- Uses **Role-Based Access Control** (RBAC) to distinguish between Admin and Gardener views.
