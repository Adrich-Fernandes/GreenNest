# 🌿 GreenNest — Customer Frontend

This is the customer-facing application for the GreenNest platform, where users can browse plants, book gardening appointments, and manage their orders.

## 🚀 Key Features
- **Product Catalog**: Browse and filter plants by categories (Indoor, Outdoor, Seeds, etc.).
- **Gardener Booking**: Find professional gardeners and book appointments with a real-time calendar.
- **Order Tracking**: Visual tracking timeline for all your plant orders.
- **Support System**: Raise and track support queries directly from your dashboard.
- **Authentication**: Secure user management powered by Clerk.

## 🛠️ Setup and Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory and add:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
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
- Uses **React Router 7** for navigation.
- Icons provided by **Lucide React**.
