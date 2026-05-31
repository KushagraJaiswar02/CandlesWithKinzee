# KindleLight Project Brief for Claude Analysis

Generated from local source inspection on 2026-05-31.

## Purpose

KindleLight is a MERN e-commerce app for a single-vendor candle store. The app includes a public storefront, user auth/profile/cart/checkout flows, Razorpay payment integration, image uploads through Cloudinary, and an admin dashboard for products, orders, collections, and CMS-like page content.

The repository is split into:

- `backend/`: Node.js, Express 5, MongoDB/Mongoose API.
- `frontend/`: React 19, Vite 7, Tailwind CSS storefront/admin UI.
- Root `package.json`: placeholder only; real scripts live inside `backend/` and `frontend/`.

## Current Git State

At inspection time, the worktree had existing uncommitted changes in:

- `backend/error.log`
- `frontend/src/components/ProductCard.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/context/CartContext.jsx`
- `frontend/src/context/ToastContext.jsx`
- `frontend/src/pages/CheckOutpage.jsx`

Treat these as user changes unless explicitly told otherwise.

## Tech Stack

Backend:

- Express `^5.1.0`
- Mongoose `^8.19.2`
- JWT auth via `jsonwebtoken`
- Password hashing via `bcryptjs`
- Validation via `zod`
- Rate limiting via `express-rate-limit`
- Uploads via `multer`, `cloudinary`, `multer-storage-cloudinary`
- Payments via `razorpay`

Frontend:

- React `^19.1.1`
- React Router DOM `^7.9.4`
- Vite `^7.1.7`
- Tailwind CSS `^3.4.18`
- Framer Motion, Swiper, Lucide React, Recharts
- Global app state via React Context, not Redux

## Run Commands

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

Seeder:

```bash
cd backend
node seeder.js      # import sample users/products
node seeder.js -d   # destroy users/products/orders
```

The frontend dev server proxies `/api` and `/uploads` to `http://127.0.0.1:5001` via `frontend/vite.config.js`.

## Required Environment

`backend/index.js` exits on startup unless all of these exist:

```env
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
PORT=5001
NODE_ENV=development
```

Frontend production API base is optional:

```env
VITE_API_URL=
VITE_RAZORPAY_KEY_ID=
```

If `VITE_API_URL` is omitted, frontend requests use relative paths and rely on Vite proxy in development.

## Backend Entry Points

Main server: `backend/index.js`

Important behavior:

- Loads env and fails fast if required variables are missing.
- Connects to MongoDB via `backend/config/db.js`.
- Uses `express.json({ limit: '10kb' })`.
- CORS allows:
  - `https://candles-with-kinzee.vercel.app`
  - `http://localhost:5173`
  - any `*.vercel.app`
- Applies general `/api` rate limiting.
- Mounts routes:
  - `/api/auth`
  - `/api/products`
  - `/api/orders`
  - `/api/admin`
  - `/api/upload`
  - `/api/landing-config`
  - `/api/collections`
  - `/api/about`
  - `/api/contact`
- Serves `/uploads` from `backend/uploads`, though current upload route stores in Cloudinary.
- Appends uncaught errors to `backend/error.log`.

## API Surface

Auth:

- `POST /api/auth/register`: public, Zod validated, returns user plus JWT.
- `POST /api/auth/login`: public, Zod validated, returns user plus JWT.
- `GET /api/auth/profile`: protected.
- `PUT /api/auth/profile`: protected, profile/address/payment fields validated.

Products:

- `GET /api/products`: public; supports `keyword`, `category`, `showAll`.
- `POST /api/products`: admin only; create product.
- `GET /api/products/categories`: public.
- `GET /api/products/history`: admin only; returns all products including soft-deleted.
- `GET /api/products/:id`: public.
- `PUT /api/products/:id`: admin only.
- `DELETE /api/products/:id`: admin only; soft-deletes via `isDeleted = true`.
- `POST /api/products/:id/reviews`: protected.
- `PUT /api/products/:id/reviews`: protected.
- `DELETE /api/products/:id/reviews`: protected.

Orders and payments:

- `POST /api/orders`: protected; validates stock, atomically decrements stock using `bulkWrite`, creates order.
- `GET /api/orders`: admin only.
- `GET /api/orders/myorders`: protected.
- `GET /api/orders/:id`: protected.
- `POST /api/orders/pay/:id`: protected; creates Razorpay order and stores `razorpayOrderId`.
- `POST /api/orders/pay/verify`: protected; verifies HMAC signature and order match, marks paid.
- `PUT /api/orders/:id/deliver`: admin only; updates order status.

Admin:

- `GET /api/admin/stats`: admin only; aggregates paid revenue and basic counts.

Uploads:

- `POST /api/upload`: protected multipart field `image`; returns `{ url }` from Cloudinary.

CMS/config:

- `GET /api/landing-config`: public singleton, auto-creates default.
- `PUT /api/landing-config`: admin only.
- `GET /api/about`: public singleton, auto-creates default.
- `PUT /api/about`: admin only.
- `GET /api/contact`: public singleton, auto-creates default.
- `PUT /api/contact`: admin only.

Collections:

- `GET /api/collections`: public active collections.
- `POST /api/collections`: admin only.
- `GET /api/collections/admin`: admin only, includes inactive.
- `GET /api/collections/:slug`: public collection details plus resolved products.
- `PUT /api/collections/:id`: admin only.
- `DELETE /api/collections/:id`: admin only.

Important route-order note: `GET /api/collections/:slug` is declared before `PUT/DELETE /api/collections/:id`; HTTP method separation avoids direct conflict.

## Data Models

`UserModel`:

- `name`, `email`, hashed `password`, `isAdmin`, `role`
- `profileImage`, `phoneNumber`
- `addresses[]`: `street`, `city`, `postalCode`, `country`
- `paymentMethods[]`: `cardType`, `last4`, `expiryDate`, `holderName`, `encryptedData`
- Pre-save middleware hashes password.

`ProductModel`:

- `name`, `description`, `price`, `category`, `countInStock`, `image`
- `reviews[]`: `name`, `rating`, `comment`, `user`, `images[]`
- `rating`, `numReviews`, `isDeleted`
- Virtual: `isOutOfStock`.

`OrderModel`:

- `user`, `orderItems[]`, `shippingAddress`
- `paymentMethod`, `totalPrice`
- Razorpay audit fields: `razorpayOrderId`, `razorpayPaymentId`, `paymentStatus`, `gatewayResponse`, `paymentVerifiedAt`
- Fulfillment fields: `isPaid`, `paidAt`, `isDelivered`, `deliveredAt`, `status`

`CollectionModel`:

- `name`, `slug`, `description`, `type` (`manual` or `automated`)
- `bannerImage`, `featuredProduct`, `isActive`
- Manual: `productIds[]`
- Automated: `rules.tags`, `rules.priceRange`, `rules.discountOnly`, `rules.inStockOnly`
- `seo.metaTitle`, `seo.metaDescription`

`LandingConfigModel`, `AboutModel`, and `ContactModel` are singleton-style CMS documents used by public pages and admin managers.

## Frontend Entry Points

Main app: `frontend/src/App.jsx`

Providers:

- `AuthProvider`: loads `userInfo` from `localStorage`, checks JWT expiry every minute, exposes `login`, `register`, `logout`, `updateUser`.
- `ToastProvider`: global toast queue.
- `CartProvider`: persists cart in `localStorage`, requires auth for add-to-cart, checks stock client-side.

API config:

- `frontend/src/config/api.js` exports `import.meta.env.VITE_API_URL || ''`.

Public routes:

- `/`
- `/login`
- `/register`
- `/shop`
- `/collections`
- `/collection/:slug`
- `/about`
- `/contact`
- `/product/:id`
- `/cart`
- `/profile`
- `/checkout`
- `*` NotFound

Admin routes under `/admin` and wrapped in `AdminRoute`:

- `/admin`
- `/admin/analytics`
- `/admin/orders`
- `/admin/products`
- `/admin/collections`
- `/admin/collections/new`
- `/admin/collections/:id/edit`
- `/admin/inventory` stub
- `/admin/customers` stub
- `/admin/promotions` stub
- `/admin/landing-page`
- `/admin/about-page`
- `/admin/contact-page`
- `/admin/settings` stub
- `/admin/product/:id/edit` is outside the admin shell but wrapped in `AdminRoute`.

## Security and Reliability Notes

Implemented:

- JWT bearer auth and admin middleware.
- Password hashing with bcrypt.
- Zod validation for auth, products, orders, common Mongo IDs.
- Rate limiters for auth/API/order routes.
- Cloudinary upload response is JSON, not raw string.
- Razorpay payment verification uses HMAC and checks the local order's stored Razorpay order ID.
- Duplicate payment verification is handled idempotently if `order.isPaid` is already true.
- Product deletes are soft deletes.

Review targets:

- `authLimiter`, `apiLimiter`, and `orderLimiter` comments say 15 minutes / stricter values, but actual `windowMs` is 60 seconds and `max` is 100.
- `GET /api/products?showAll=true` exposes out-of-stock/non-public inventory to anyone; code comment says admin is trusted by query param.
- `GET /api/orders/:id` only requires authentication and does not obviously check owner/admin authorization.
- `createRazorpayOrder` does not obviously check that the authenticated user owns the order.
- Order creation decrements stock before payment succeeds; failed/abandoned Razorpay payments may leave stock reduced unless business rules intend reservation.
- No backend test runner is configured; `backend/tests/razorTest.js` is an ad hoc integration script.
- `backend/error.log` is tracked/modified, which can create noisy commits and may leak stack traces.
- Several files contain mojibake in comments/README output, likely encoding damage from emoji or special characters.

## Verification Snapshot

Commands run from the current tree:

```bash
cd frontend && npm run build
```

Result: passes. Warnings:

- Browserslist/caniuse-lite data is stale.
- `baseline-browser-mapping` data is over two months old.
- Main JS chunk is large: about 1.9 MB minified / 451 KB gzip; consider code splitting.

```bash
cd frontend && npm run lint
```

Result: fails with 17 errors and 6 warnings. Main categories:

- Unused imports/variables: `motion`, `Icon`, `cn`, `error`, `e`, `_`.
- Empty block in `frontend/src/pages/admin/LandingPageManager.jsx`.
- Missing React hook dependencies in collection/page/admin manager effects.

Existing `frontend/build_output.txt` says a previous build failed on `src/pages/admin/CollectionManager.jsx`, but current source imports `CollectionsManager.jsx` and the fresh build passes.

Backend was not started because required environment variables are not present in this repository.

## Suggested Claude Analysis Prompts

Use one of these depending on the goal:

1. "Review this MERN e-commerce app for security and payment-flow risks. Prioritize authorization bugs, stock/payment consistency, input validation gaps, and production deployment issues."
2. "Analyze the frontend architecture and identify the smallest set of changes needed to reduce bundle size, fix lint failures, and improve route/data-fetch reliability."
3. "Review the backend API design for ownership checks, admin-only data exposure, rate limiting correctness, and Razorpay order lifecycle integrity."
4. "Create a prioritized remediation plan with file-level changes and tests for the issues in `CLAUDE_PROJECT_BRIEF.md`."

## High-Value Files to Inspect First

- `backend/index.js`
- `backend/controllers/orderController.js`
- `backend/controllers/productController.js`
- `backend/controllers/authController.js`
- `backend/middlewares/authMiddleware.js`
- `backend/middlewares/rateLimiter.js`
- `backend/validators/*.js`
- `backend/models/*.js`
- `frontend/src/App.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/context/CartContext.jsx`
- `frontend/src/pages/CheckOutpage.jsx`
- `frontend/src/pages/AccountPage.jsx`
- `frontend/src/pages/admin/*`
