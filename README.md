# 🍿 SnackStore — Homemade Snacks eCommerce Platform

A complete, production-ready full-stack eCommerce web application for a homemade snacks store built with **Django + DRF** backend and **React + Tailwind CSS** frontend.

## 📸 Screenshots

### Home Page
- Hero section with gradient background and CTAs
- Trust badges (Free Delivery, 100% Fresh, Premium Quality)
- Category grid with product counts
- Featured products showcase
- Promotional coupon banner

### Admin Dashboard
- KPI cards (Revenue, Orders, Users, Pending)
- Revenue Line Chart & Orders Bar Chart (Recharts)
- Monthly summary
- Recent orders table

### Products Page
- Category sidebar filter
- Search bar
- Sorting options
- Pagination
- Product cards with discount badges

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Django 3.2 + Django REST Framework 3.13 |
| **Frontend** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v3 |
| **Charts** | Recharts |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Icons** | React Icons (HeroIcons) |
| **Notifications** | React Hot Toast |
| **Deployment** | Docker + Docker Compose (optional) |

---

## 📁 Project Structure

```
online store/
├── backend/                      # Django Backend (Port 8000)
├── frontend/                     # React Storefront (Port 5173)
└── admin-frontend/               # React Admin Panel (Port 5174)
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### 2. Storefront Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```bash
cd admin-frontend
npm install
npm run dev
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@snackstore.com | admin123 |
| **Customer** | customer@example.com | customer123 |

### ✨ Key Features
- **Project Separation**: Independent Storefront and Admin applications for better performance.
- **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.
- **Fast Loading**: Optimized asset handling and proxying for seamless image delivery.
- **WhatsApp Integration**: Direct order confirmation from the Admin Panel.

---

## 🐳 Docker Deployment (Optional)

```bash
# Build and start all services
docker-compose up --build

# The app will be available at http://localhost
```

---

## 📊 Database Schema

### Models

| Model | Key Fields |
|-------|-----------|
| **User** | email, username, phone, address, city, state, pincode, is_customer |
| **Category** | name, slug, description, image, is_active |
| **Product** | name, slug, description, price, discount_price, category (FK), image, stock, weight, is_featured |
| **Cart** | user (OneToOne) |
| **CartItem** | cart (FK), product (FK), quantity |
| **Order** | user (FK), order_number, shipping address fields, total_amount, discount_amount, final_amount, coupon (FK), status, payment_method |
| **OrderItem** | order (FK), product (FK), product_name, product_price, quantity |
| **Coupon** | code, discount_percent, min_order_amount, max_discount, expiry_date, usage_limit, used_count |

---

## 📡 API Documentation

### Authentication (`/api/auth/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register/` | Register new user | ❌ |
| POST | `/login/` | Get JWT token pair (email + password) | ❌ |
| POST | `/login/refresh/` | Refresh access token | ❌ |
| GET/PUT | `/profile/` | View/update profile | ✅ |
| GET | `/users/` | List all users | 🔒 Admin |
| GET | `/users/<id>/` | User details | 🔒 Admin |

### Products (`/api/products/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List products (search, filter, paginate) | ❌ |
| POST | `/` | Create product | 🔒 Admin |
| GET | `/featured/` | Featured products | ❌ |
| GET | `/<id>/` | Product details | ❌ |
| PUT | `/<id>/` | Update product | 🔒 Admin |
| DELETE | `/<id>/` | Delete product | 🔒 Admin |
| GET | `/categories/` | List categories | ❌ |
| POST | `/categories/` | Create category | 🔒 Admin |
| PUT/DELETE | `/categories/<id>/` | Update/delete category | 🔒 Admin |

### Cart (`/api/cart/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user's cart | ✅ |
| POST | `/add/` | Add item to cart | ✅ |
| PUT | `/update/<item_id>/` | Update quantity | ✅ |
| DELETE | `/remove/<item_id>/` | Remove item | ✅ |
| DELETE | `/clear/` | Clear entire cart | ✅ |

### Orders (`/api/orders/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/checkout/` | Place order from cart | ✅ |
| GET | `/` | List orders (user's own / all for admin) | ✅ |
| GET | `/<id>/` | Order details | ✅ |
| PUT | `/<id>/status/` | Update order status | 🔒 Admin |

### Coupons (`/api/coupons/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/` | List/create coupons | 🔒 Admin |
| GET/PUT/DELETE | `/<id>/` | Coupon CRUD | 🔒 Admin |
| POST | `/validate/` | Validate coupon code | ✅ |

### Analytics (`/api/analytics/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/` | KPI data (revenue, orders, users) | 🔒 Admin |
| GET | `/sales-chart/?period=daily` | Chart data for graphs | 🔒 Admin |

**Legend**: ❌ Public | ✅ Authenticated | 🔒 Admin Only

---

## ✨ Features

### 🔐 User Side
- ✅ User Registration & Login (JWT)
- ✅ Browse products with categories
- ✅ Product details page
- ✅ Add to cart / remove from cart
- ✅ Persistent cart (saved per user)
- ✅ Coupon system at checkout
- ✅ Checkout (address + COD payment)
- ✅ Order placement with stock validation
- ✅ Order tracking with status timeline (Pending → Confirmed → Shipped → Delivered)
- ✅ User profile with edit functionality
- ✅ Order history

### 🛒 Cart & Orders
- ✅ Server-side persistent cart
- ✅ Quantity management
- ✅ Order history with status badges
- ✅ Order detail with item breakdown

### 👨‍💼 Admin Dashboard
- ✅ KPI cards (Revenue, Orders, Users, Pending)
- ✅ Revenue line chart & Orders bar chart
- ✅ Daily/Monthly chart toggle
- ✅ Product CRUD (add/edit/delete)
- ✅ Category management
- ✅ Order management with inline status update
- ✅ User management with order counts
- ✅ Coupon CRUD (code, discount%, expiry, limits)
- ✅ Recent orders overview

### ⚡ Performance & UI
- ✅ Lazy loading for all pages
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Clean modern UI with Tailwind CSS
- ✅ Custom fonts (Inter + Outfit)
- ✅ Warm earth-tone color palette
- ✅ Glassmorphic navbar
- ✅ Micro-animations (fade-in, slide-up, hover effects)
- ✅ Loading spinners
- ✅ Toast notifications

### 🔒 Security
- ✅ JWT authentication with auto-refresh
- ✅ Protected routes (user & admin)
- ✅ Input validation (frontend + backend)
- ✅ Admin-only API endpoints
- ✅ CORS configuration

### 💡 Extra
- ✅ Product search
- ✅ Category filtering
- ✅ Price sorting
- ✅ Pagination
- ✅ Error handling
- ✅ Loading states

---

## 🔧 Configuration

### Environment Variables (Production)

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=0
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgres://user:pass@host:5432/dbname

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Switch to PostgreSQL

In `backend/config/settings.py`, uncomment the PostgreSQL config and comment out SQLite:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'snackstore',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 📝 License

This project is for educational and commercial use. Built with ❤️ for homemade snacks lovers.
