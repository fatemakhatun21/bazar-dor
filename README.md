
# 🛒 BazarDor — বাজার দর

BazarDor is a responsive Bengali market price tracking web application built with Next.js. Users can explore daily prices of essential products, compare prices across markets, and track price increases or decreases.

## 🚀 Features

1. **Daily Market Prices** — Browse updated prices of essential products.
2. **Dynamic Categories** — Explore products by category, including rice, lentils, oil, vegetables, fish, meat, dairy, and spices.
3. **Price Increase & Decrease** — View products with rising and falling prices.
4. **Product Details** — View minimum, maximum, average, and market-wise prices.
5. **Product Sorting** — Sort products by price in ascending or descending order.
6. **Authentication** — Sign up and sign in using email/password, Google, or GitHub.
7. **Protected Routes** — Product details require authentication.
8. **User Profile** — View account information and update the user's name.
9. **Live Price Ticker** — Scrolling display of product prices and percentage changes.
10. **Responsive Design** — Supports mobile, tablet, and desktop screens.
11. **Error Handling** — Includes loading skeletons, error messages, and a custom 404 page.

## 🛠️ Technologies Used

- Next.js (App Router)
- React
- Tailwind CSS
- HeroUI
- DaisyUI
- BetterAuth
- MongoDB
- React Hot Toast
- Vercel (deployment platform)

## 🔐 Authentication

BazarDor supports:

- Email and password authentication
- Google OAuth
- GitHub OAuth
- User profile management

## 🌐 API

BazarDor uses the following external API:

https://openapi.programming-hero.com/api/bazardor

## 💻 Run Locally

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and configure the required variables:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Never commit environment files containing real credentials.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📄 Pages

- `/` — Home
- `/category/[slug]` — Category Products
- `/product/[slug]` — Protected Product Details
- `/sign-in` — Sign In
- `/sign-up` — Sign Up
- `/profile` — User Profile
- Custom 404 Page

## 🔗 Live Website

Live URL: Add your Vercel deployment link here.

## 👩‍💻 Developer

Developed as a Next.js assignment project.