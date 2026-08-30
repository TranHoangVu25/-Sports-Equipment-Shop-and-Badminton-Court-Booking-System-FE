# 🚀 Sport Store Frontend

> Frontend for a sports equipment shop and badminton court booking system

## 📌 Overview

`sport-store-frontend` is a frontend application built with **React + TypeScript + Vite** for an e-commerce and court booking platform.

Based on the current source code, the project supports:

* Shopping for sports equipment
* Viewing product details, cart, and checkout
* Booking badminton courts and viewing booking details
* Registering, logging in, forgot password, and resetting password
* Managing user profiles
* An admin dashboard area

## 🏗️ Architecture

The project is organized in a module-based frontend structure, with clear separation between:

* `modules/auth/pages` for user-facing pages
* `components` for reusable UI pieces
* `layout` for page layouts
* `dashboard` for admin views
* `config` for API and default header configuration
* `routes` for route definitions

```text
src/
├── components/
├── config/
├── dashboard/
├── layout/
├── modules/
├── routes/
├── App.tsx
└── main.tsx
```

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| Language | TypeScript, JavaScript |
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router DOM |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Package Manager | npm |

## ✨ Features

### User Features

* Home page with banner and product sections
* Product listing and product details
* Product search
* Cart
* Order checkout
* Order list and order details
* Badminton court listing
* Court details and court checkout
* Booking details
* Register, login, forgot password, and reset password
* User profile page

### Admin Features

* Main dashboard overview
* Product management
* Order management
* Promotion management
* Court system management
* Booking management
* Chatbot dashboard
* User management

### Technical Features

* Automatic API base URL rewrite for `fetch`
* Default `ngrok-skip-browser-warning: true` header
* Separate base API configuration for the main system and auth API

## 📁 Project Structure

```text
src/
├── assets/
├── components/
│   ├── Auth/
│   ├── Home/
│   ├── Profile/
│   ├── footer/
│   └── header/
├── config/
├── dashboard/
├── layout/
├── modules/
│   └── auth/pages/
├── routes/
├── App.tsx
└── main.tsx
```

## ⚙️ Requirements

Before running the project, make sure you have:

* Node.js 18+ or newer
* npm
* The backend API running

Check versions:

```bash
node -v
npm -v
```

## 🔧 Configuration

Create a `.env` file from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8086/api/v1
VITE_AUTH_API_BASE_URL=http://localhost:8085/api/v1
```

### Notes

* `VITE_API_BASE_URL` is used for the main API
* `VITE_AUTH_API_BASE_URL` is used for auth API if it differs from the main base URL
* Do not commit `.env` files containing sensitive information to GitHub

## ▶️ Run Application

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the code

```bash
npm run lint
```

## 🧭 Routing

Main routes currently available in the source:

### User Pages

| Path | Description |
| --- | --- |
| `/` | Home page |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |
| `/profile` | User profile |
| `/search` | Product search |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/product-detail/:id` | Product details |
| `/order-detail/:id` | Order details |
| `/courts` | Court list |
| `/court-detail/:id` | Court details |
| `/court-checkout` | Court checkout |
| `/booking-detail/:id` | Booking details |

### Dashboard Pages

| Path | Description |
| --- | --- |
| `/dashboard/main` | Main dashboard overview |
| `/dashboard/users` | User management |
| `/dashboard/products` | Product management |
| `/dashboard/orders` | Order management |
| `/dashboard/promotions` | Promotion management |
| `/dashboard/courts` | Court system management |
| `/dashboard/bookings` | Booking management |
| `/dashboard/chatbot` | Chatbot dashboard |

## 🔐 Authentication

The application stores the token in `localStorage` and attaches it to the `Authorization` header when calling protected APIs.

Example:

```http
Authorization: Bearer <token>
```

## 🔌 API Notes

The current source calls backend endpoints such as:

* `/api/v1/products`
* `/api/v1/bookings`
* `/api/v1/court-centers`
* `/api/v1/reports/revenue`
* `/api/v1/auth`

In addition, `src/config/api-base-url.ts` rewrites legacy URLs to the base URL loaded from environment variables.

## 👨‍💻 Author

* Project: Graduation Thesis
* Repo: Sports Equipment Shop and Badminton Court Booking System - FE

## 📄 License

Not specified.
