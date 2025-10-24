# 🕯️ KindleLight E-commerce Platform

## 🌟 Project Overview

This project involves creating a modern, responsive, and secure e-commerce platform dedicated to selling handcrafted candles. [cite_start]The goal is to migrate the client's business from an Instagram-only presence to a professional, scalable website, providing a smooth, aesthetic shopping experience similar in structure and flow to platforms like Flipkart[cite: 3, 5, 8].

[cite_start]The design emphasizes a **minimalist and elegant candle-themed aesthetic** with a consistent warm color palette[cite: 5, 23, 41].

## 🎯 Objectives

* [cite_start]Build a **fast, mobile-friendly** e-commerce website[cite: 7, 24].
* [cite_start]Provide a smooth shopping experience with an **aesthetic UI**[cite: 8].
* [cite_start]Integrate **secure authentication and payment gateway**[cite: 9, 37].
* [cite_start]Enable comprehensive product management with images, categories, and stock control[cite: 10].
* [cite_start]Provide a **review system** and customer engagement tools[cite: 11].
* [cite_start]Ensure **scalability and security** from day one[cite: 12, 32].

---

## 💻 Tech Stack & Architecture

[cite_start]The application follows a **MERN (MongoDB, Express, React, Node.js) architecture** with a clear separation of frontend and backend concerns[cite: 29].

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | [cite_start]**React + Vite**, Tailwind CSS, Shaden UI, **Framer Motion**, Lucide React, Swiper.js [cite: 15, 20] | [cite_start]Handles UI, state, and smooth transitions[cite: 25, 30]. |
| **State Management** | [cite_start]Context API / **Zustand** [cite: 17] | Efficiently manages global state. |
| **Backend** | [cite_start]**Node.js, Express.js, MongoDB** [cite: 16] | [cite_start]Handles API routing, business logic, and data storage[cite: 30]. |
| **Payment** | [cite_start]Razorpay / Stripe [cite: 18] | [cite_start]Secure online transaction processing[cite: 9]. |
| **Hosting** | [cite_start]Vercel / Render / AWS [cite: 19] | Cloud deployment infrastructure. |
| **Images** | [cite_start]**Cloudinary** [cite: 20] | External hosting for high-quality product images. |

---

## ✨ Implemented Frontend Features (Phase 1)

The current iteration focuses on the core user interface and routing for customer feedback.

* **Responsive Navigation (`Header.jsx`):** Elegant, mobile-friendly navbar with the textual "KindleLight" logo.
* **Authentication Flow (`LoginPage.jsx`, `RegisterPage.jsx`):** User login and account creation forms.
* **Product Views:**
    * **Home Page:** Features a hero section and browsable product categories.
    * **Product Listing Page (`/shop`):** Displays products in a medium-density grid with a toggleable filter/sort sidebar using **Framer Motion** for smooth transitions.
    * **Product Detail Page (`/product/:id`):** Dedicated page for product images, descriptions, pricing, and review placeholders.
* **User Flow Pages:**
    * [cite_start]**Cart Page (`/cart`):** Interface for managing item quantities and viewing the order summary[cite: 13].
    * **Account Page (`/profile`):** Sidebar navigation for managing orders and profile details.
* **Admin Skeleton (`/admin`):** Separate high-contrast dashboard for management access.

---

## 🔒 Security Measures

[cite_start]Security is prioritized across the stack[cite: 12]. Key measures include:

* [cite_start]HTTPS implementation with SSL[cite: 33].
* [cite_start]Password hashing using **bcrypt**[cite: 34].
* [cite_start]Secure API routes with **JWT authentication**[cite: 35].
* [cite_start]Database validation and sanitation[cite: 36].
* [cite_start]Payment encryption and webhook verification[cite: 37].
* [cite_start]Admin-level authorization for sensitive operations[cite: 38].

---

## 🚀 Getting Started

To run the project locally, you will need Node.js and npm/yarn installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd KindleLight/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install 
    # or
    yarn install
    ```

### Running the Frontend

Start the React application using Vite:

```bash
npm run dev
# or
yarn dev