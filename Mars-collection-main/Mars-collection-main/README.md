# MARS Collection - Premium Luxury Fashion E-Commerce

**MARS Collection** is a professional, full-stack, premium fashion e-commerce web application. Featuring a minimalist luxury and streetwear design aesthetic (inspired by clean Apple-like interfaces), it serves as a showcase-ready software engineering portfolio project.

The application allows users to search, filter, and browse a high-end streetwear catalogue, manage cart sessions, process mock invoices, and track orders on an interactive delivery timeline. Administrators can manage inventories (CRUD products), monitor stock alert limits, update order statuses, and view gross sales performance metrics via interactive visual charts.

---

## Tech Stack

*   **Frontend**: React.js, Tailwind CSS (Vanilla CSS configurations), React Router, Context API, Lucide Icons, Recharts (Admin analytics).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (configured via Mongoose ODM).
*   **Security & Authentication**: JWT (JSON Web Tokens) with client-side headers validation, password hashing via `bcryptjs`.
*   **Deployment Ready**: Ready to deploy (Frontend: Vercel, Backend: Render, Database: MongoDB Atlas).

---

## Folder Structure

```
MARS-Collection/
├── client/
│   ├── src/
│   │   ├── components/      # Global components (Navbar, Footer, Skeletons, Toasts)
│   │   ├── context/         # Auth, Cart, Theme, and Toast Contexts
│   │   ├── pages/           # Pages (Landing, Catalog, Product Details, Cart, Checkout, Dashboards)
│   │   ├── services/        # Fetch API central client wrapper
│   │   ├── index.css        # Global CSS stylesheet & Tailwind setup
│   │   └── main.jsx         # React root entry node
│   ├── tailwind.config.js   # Custom luxury palette configuration
│   └── index.html           # Main HTML structure with SEO meta-tags
│
├── server/
│   ├── config/              # Database connection configuration
│   ├── controllers/         # Request handling logic (Auth, Products, Orders, Analytics)
│   ├── middleware/          # JWT authorization and Admin access gates
│   ├── models/              # Mongoose schemas (User, Product, Order)
│   ├── routes/              # Express API router definitions
│   └── server.js            # Express application entry point
│
└── database/
    └── seedProducts.js      # DB seeding script with premium seed data
```

---

## Getting Started (Local Run Guide)

### Prerequisites
*   [Node.js](https://nodejs.org/) (version 18 or higher recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally (default: `mongodb://127.0.0.1:27017/mars-collection`) or a MongoDB Atlas connection string.

---

### Step 1: Clone and Setup Database Configuration
1. Create a `.env` file inside the `server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/mars-collection
   JWT_SECRET=supersecretkeyformarscollection
   NODE_ENV=development
   ```

---

### Step 2: Install Dependencies and Seed the Database
1. Open your terminal in the workspace root, change to the server folder, and install backend packages:
   ```bash
   cd server
   npm install
   ```
2. Seed the database with sample luxury garments, customer profiles, and transaction logs for analytics charts:
   ```bash
   npm run seed
   ```
   *Note: This creates two default accounts:*
   *   **Admin Access**: `admin@marscollection.com` (password: `admin12345`)
   *   **Customer Access**: `customer@marscollection.com` (password: `password123`)

---

### Step 3: Run the Backend API Server
1. From the `server/` directory, start the API:
   ```bash
   npm run dev
   ```
   The API will boot on `http://localhost:5000`.

---

### Step 4: Setup and Run the Frontend Client
1. Open a new terminal instance and navigate to the `client/` directory:
   ```bash
   cd client
   npm install
   npm run dev
   ```
2. Open your browser and navigate to the local client URL (usually `http://localhost:5173`).

---

## API Documentation (Endpoints Reference)

### 1. Authentication & Wishlist (`/api/auth`)
*   `POST /register` - Registers a new customer profile. Returns a JWT.
*   `POST /login` - Sign in using email/password. Returns profile info and JWT.
*   `GET /profile` - Retrieve current logged-in profile details and wishlist (Requires Auth).
*   `PUT /profile` - Update profile data (name, email, password, address) (Requires Auth).
*   `GET /wishlist` - Get wishlist items (Requires Auth).
*   `POST /wishlist` - Add a product ID to customer wishlist (Requires Auth).
*   `DELETE /wishlist/:id` - Remove a product ID from wishlist (Requires Auth).

### 2. Product Catalog (`/api/products`)
*   `GET /` - List catalog products (Supports pagination `?page=X`, searching `?keyword=Y`, category filters `?category=A,B`, and sorting `?sort=priceAsc`).
*   `GET /suggestions?keyword=X` - Autocomplete suggestions for searches.
*   `GET /:id` - Retrieve full details for a product (pricing, sizes, reviews).
*   `POST /` - Add a new product (Requires Admin Auth).
*   `PUT /:id` - Update product details (Requires Admin Auth).
*   `DELETE /:id` - Remove a product from inventory (Requires Admin Auth).
*   `POST /:id/reviews` - Submit a star review comment (Requires Auth).

### 3. Orders & Analytics (`/api/orders`)
*   `POST /` - Place a new checkout order (Requires Auth). Decrements inventory stock.
*   `GET /myorders` - List all orders for the current user (Requires Auth).
*   `GET /:id` - Retrieve order details and invoice information (Requires Auth/Admin).
*   `GET /` - List all system orders (Requires Admin Auth).
*   `PUT /:id/status` - Update shipping timeline status or payment (Requires Admin Auth).
*   `GET /analytics` - Get sales totals, monthly revenues, and best sellers (Requires Admin Auth).

---

## Deployment Guide

### Database (MongoDB Atlas)
1. Register on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster, add a database user, and configure Network Access to allow connections (`0.0.0.0/0` for global hosting).
3. Retrieve your connection string (URI) and replace the local `MONGO_URI` in the backend configuration.

### Backend API (Render)
1. Create a Web Service on [Render](https://render.com/).
2. Link your GitHub repository and set Root Directory to `server`.
3. Set Environment to `Node`. Build Command: `npm install`, Start Command: `npm start`.
4. Define Environment Variables: `MONGO_URI`, `JWT_SECRET`, `PORT=10000`, `NODE_ENV=production`.
5. Note down the deployed Render URL (e.g. `https://mars-api.onrender.com`).

### Frontend Host (Vercel)
1. In the frontend client code `client/src/services/api.js`, update the `BASE_URL` variable to point to your deployed Render URL:
   `const BASE_URL = 'https://YOUR_RENDER_SUBDOMAIN.onrender.com/api';`
2. Connect your repository to [Vercel](https://vercel.com/).
3. Choose project root as `client`. Build settings will automatically detect Vite.
4. Click Deploy.
