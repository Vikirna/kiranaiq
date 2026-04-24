# 🌾 KiranaIQ — AI Inventory & Restock Prediction Platform

> A full-stack SaaS platform for Indian kirana store owners to predict restocking needs, track profits, and manage inventory using real-world data signals.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kiranaiq--kappa.vercel.app-C07841?style=for-the-badge)](https://kiranaiq-kappa.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Railway-6B8F47?style=for-the-badge)](https://kiranaiq-production.up.railway.app)

---

## 📌 About the Project

KiranaIQ helps small kirana store owners stop losing sales due to unpredictable stock-outs. It combines a store's own sales history with real-world signals — live weather data, government commodity prices, and upcoming festival calendars — to forecast demand and suggest optimal restock quantities through a custom-built prediction engine.

**Demo Credentials**
- Email: `demo@kiranaiq.com`
- Password: `demo1234`

---

## ✨ Features

- **Smart Inventory Management** — Add products with selling price, cost price, and stock thresholds; color-coded stock badges (Good / Low / Critical)
- **Sales Entry with Live Preview** — Record daily sales with discount support; see real-time profit/loss preview before submitting
- **Profit & Loss Tracking** — Per-sale profit/loss calculation based on cost price vs final revenue; separate dashboard cards for total gains and total losses
- **Search Sales** — Filter sales history by date (calendar picker) or item name (dropdown)
- **AI Predictions** — Custom REST API prediction engine using time-series sales analysis + weather + festival data
- **External API Integration** — OpenWeatherMap (demand based on weather), data.gov.in (commodity prices), Festival Calendar (upcoming demand spikes)
- **Email Verification & Forgot Password** — Full auth flow using Resend — signup triggers verification email, forgot password sends reset link
- **Animated UI** — Framer Motion page transitions, staggered card entrances, spring pop on interactive elements, fixed video background across all pages
- **Responsive Design** — Works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| External APIs | OpenWeatherMap, data.gov.in, Festival Calendar API |
| Prediction Engine | Custom REST API (Node.js) |
| Email Service | Resend |
| Deployment | Vercel (Frontend), Railway (Backend + DB) |

---

## 📁 Project Structure

```
kiranaiq/
├── client/                        # React frontend
│   ├── public/
│   │   └── kirana.mp4             # Background video
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Loader.jsx
│       │   │   └── VideoBackground.jsx
│       │   └── dashboard/
│       │       └── StatsCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── lib/
│       │   ├── api.js             # Axios API calls
│       │   └── variants.js        # Framer Motion variants
│       └── pages/
│           ├── Landing.jsx
│           ├── Login.jsx
│           ├── Signup.jsx
│           ├── ForgotPassword.jsx
│           ├── ResetPassword.jsx
│           ├── VerifyEmail.jsx
│           ├── Dashboard.jsx
│           ├── Inventory.jsx
│           ├── Sales.jsx
│           └── Predictions.jsx
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # PostgreSQL connection
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   └── salesController.js
    ├── middleware/
    │   └── auth.js                # JWT middleware
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   └── salesRoutes.js
    ├── services/
    │   └── emailService.js        # Resend email integration
    └── server.js
```

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  shop_name VARCHAR(255),
  owner_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  current_stock DECIMAL(10,2),
  min_threshold DECIMAL(10,2),
  unit VARCHAR(50),
  price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity_sold DECIMAL(10,2),
  sale_date DATE,
  revenue DECIMAL(10,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  final_revenue DECIMAL(10,2),
  profit DECIMAL(10,2),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/kiranaiq.git
cd kiranaiq
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://localhost:5432/kiranaiq
JWT_SECRET=your_jwt_secret
OPENWEATHER_API_KEY=your_openweather_key
RESEND_API_KEY=your_resend_key
```

### 3. Setup the frontend
```bash
cd ../client
npm install
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run the app
```bash
# Terminal 1 — backend
cd server && node server.js

# Terminal 2 — frontend
cd client && npm start
```

---

## 🚀 Deployment

| Service | Purpose | URL |
|---|---|---|
| Vercel | Frontend hosting | kiranaiq-kappa.vercel.app |
| Railway | Backend (Express) + PostgreSQL | kiranaiq-production.up.railway.app |

---

## 📊 Prediction Engine Logic

```javascript
// Trend-adjusted demand forecasting
function predictRestock(salesHistory, currentStock) {
  const avgDailySales = average(salesHistory)
  const recentAvg = average(salesHistory.slice(-7))
  const olderAvg = average(salesHistory.slice(-14, -7))
  const trend = (recentAvg - olderAvg) / olderAvg  // % change

  const adjustedDailySales = avgDailySales * (1 + trend)
  const daysUntilStockout = currentStock / adjustedDailySales
  const recommendedQty = Math.ceil(adjustedDailySales * 30)

  return { daysUntilStockout, recommendedQty, trend, confidence }
}
```

External signals layered on top:
- **Weather** — cold wave → chai/ginger spike; rain → instant noodles spike
- **Festivals** — Diwali → dry fruits; Ramzan → dates; Holi → colours & sweets
- **Commodity prices** — data.gov.in wholesale rates for real-time cost benchmarking

---

## 👤 Author

**Vikirna** — CS Student, Batch 2027  
[GitHub](https://github.com/yourusername) · [LinkedIn](https://linkedin.com/in/yourusername)
