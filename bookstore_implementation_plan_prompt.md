# Online Bookstore Project Plan (React + Firebase)

## 1. Implementation Plan

### Phase 1: Initial Setup & Configuration

* Scaffold the project using Vite with the React template.

* Install necessary dependencies: `react-router-dom`, `firebase`, `lucide-react`, and Tailwind CSS.

* Initialize Tailwind configuration.

* Set up a `src/firebase.js` configuration file that pulls credentials from environment variables (`.env`).

### Phase 2: Data Architecture & State Management

* Define Firestore collections structure for `books` and `orders`.

* Create a global `CartContext` to manage the shopping cart.

* Implement `localStorage` synchronization within the context so guest users do not lose their cart on page refresh.

### Phase 3: Customer Storefront (Public Routes)

* **Navbar & Layout:** Create a responsive navigation bar featuring a search input, category filters, and a dynamic cart icon.

* **Home/Storefront Page (`/`):** Fetch and display the `books` collection in a grid format. Implement search and category filtering logic.

* **Book Details (`/book/:id` or Modal):** Display extended information, high-quality cover images, and price. Add an "Add to Cart" interaction.

* **Cart & Checkout Page (`/cart`):**

  * Display current cart items and total amount.

  * Implement a Cash on Delivery (COD) form capturing: Full Name, Phone Number, Shipping Address, and Delivery Instructions.

  * On submit: Save document to the `orders` collection in Firestore, clear the `CartContext`, and show a success message.

### Phase 4: Admin Dashboard (Protected Routes)

* **Authentication:** Build a simple `/admin/login` page leveraging Firebase Email/Password Authentication.

* **Inventory Management (`/admin/inventory`):**

  * Create a table/grid of existing books.

  * Build a form to add new books. Include an image upload mechanism that uploads the cover to Firebase Storage, gets the download URL, and saves it along with text data to Firestore.

  * Add edit and delete functionalities.

* **Order Management (`/admin/orders`):**

  * Display all COD orders fetched from Firestore.

  * Implement a status dropdown to instantly update an order's status (`Pending`, `Shipped`, `Delivered`) directly in the database.

## 2. Master Mission Prompt for AI Tool (Antigravity)

*Copy and paste the text below directly into your AI coding assistant:*

```
You are an expert full-stack developer. Build a responsive, full-stack online bookstore using plain React (scaffolded with Vite), Tailwind CSS, React Router (react-router-dom), and Firebase (Firestore, Storage, and Auth). The project has two actors: Customers (guests, no login needed) and one Seller/Admin.

**Critical First Step:**
Before generating any code, create a `progress.md` file detailing your step-by-step implementation plan. Update and check off items in this file as you progress through the build.

**Tech Stack & Libraries:**
- React (Vite)
- Tailwind CSS
- lucide-react (for clean icons)
- react-router-dom (for client-side routing)
- Firebase SDK (Firestore, Firebase Storage, and Firebase Authentication)

**Core Requirements:**

1. Data Architecture:
- Firestore collection `books`: id, title, author, description, price (number), category (e.g., Fiction, Academic, Islamic), coverImageURL, createdAt.
- Firestore collection `orders`: id, customer: { name, phone, address, instructions }, items: [{ bookId, title, price, quantity }], totalAmount, status ("Pending" | "Shipped" | "Delivered"), createdAt.

2. Customer Storefront (Guest access, no authentication):
- Header/Navbar: Store name, Search bar, Category filter buttons/dropdown, and a Cart icon displaying item count.
- Book Grid: Cards showing book cover image, title, author, price, and an "Add to Cart" button.
- Book Detail Page/Modal: Full description, details, and cover picture.
- Cart & Guest Checkout:
  - Local cart managed via React Context and persisted in localStorage.
  - Checkout form collecting: Full Name, Contact Phone Number, Complete Shipping Address, and Delivery Instructions/Notes.
  - Payment method: Cash on Delivery (COD) only (no payment gateway).
  - Submitting the order writes to the `orders` collection and resets the cart.

3. Admin Panel (Protected Route):
- Simple login page (`/admin/login`) authenticated via Firebase Auth (Email/Password).
- Dashboard (`/admin/dashboard`) with two tabs:
  1. Inventory: Table/grid of existing books with options to Delete and Edit. Includes an "Add New Book" form with file upload that uploads book covers directly to Firebase Storage and saves the book record to Firestore.
  2. Orders: Table of incoming COD orders showing customer details, items ordered, total price, and date. Provide a dropdown toggle to update the order's status directly in Firestore between "Pending", "Shipped", and "Delivered".

**Implementation Instructions:**
- Provide clean, modular components inside `src/components/`, `src/pages/`, and `src/context/`.
- Provide a `src/firebase.js` configuration file reading from `import.meta.env` environment variables.
- Ensure the UI looks polished, clean, modern, and is fully responsive.
- Remember to maintain the `progress.md` file as your source of truth throughout the session.

```