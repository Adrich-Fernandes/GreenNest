# ⚙️ GreenNest — Backend API

This is the central REST API server for the GreenNest platform, powering the Customer Frontend, Admin Panel, and Gardener Dashboard.

## 🚀 Key Features
- **Centralized Data Management**: Shared MongoDB database for all three applications.
- **RESTful Endpoints**: Dedicated routes for Products, Users, Orders, Gardeners, and Support Queries.
- **Secure Authentication**: Integrated with Clerk SDK for server-side token verification.
- **Role Management**: Custom middleware to enforce role-based access (Admin, User, Gardener).
- **Automated Notifications**: Nodemailer integration for sending support emails and contact forms.
- **Stock Logic**: Automated database hooks to manage product status based on inventory.

## 🛠️ Setup and Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in this directory and add:
   ```env
   PORT=8000
   DB_URI=your_mongodb_connection_string
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_for_nodemailer
   EMAIL_PASS=your_email_password_or_app_password
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

## 📂 Structure
- `Controller/`: Request handling logic.
- `models/`: Mongoose schemas and database logic.
- `Routes/`: API endpoint definitions.
- `middleware/`: Authentication and role protection layers.
- `config/`: Database and server configurations.

## 🔌 API Base URL
`http://localhost:8000`
