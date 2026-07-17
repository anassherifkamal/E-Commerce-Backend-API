# E-Commerce Backend API

A robust, RESTful backend API designed to power modern e-commerce web applications. The system features modular architecture, strict data validation, server-side price calculation, and automated inventory management during checkout.

### 🛠️ Tech Stack
* **Runtime Environment:** Node.js (v24.x)
* **Framework:** Express.js
* **Database:** MongoDB (Local or Atlas)
* **ODM:** Mongoose

---

## ✨ Features

* **Categories Management:** Full CRUD operations with dynamic route parameter parsing (/:id).
* **Products Engine:** Complete inventory management with category reference tracking.
* **Shopping Cart System:** Stateful session-based shopping cart (test-session-123) supporting adding, updating quantities, and auto-calculating totals.
* **Checkout & Orders Engine:** Secure checkout process that extracts cart items, verifies server-side pricing directly from the database, snapshots product details to lock in transaction records, decrements stock levels, and flushes the cart.
* **Global Error Handling:** Custom centralized error handler (AppError / asyncHandler) returning consistent, clean JSON payloads for all operational errors.

---

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:
* **Node.js:** v24.15.0 or higher
* **npm:** v10.x or higher
* **MongoDB:** Community Server (Local instance running on port 27017) or a MongoDB Atlas Connection URI.

---

## 🚀 Installation & Setup

Follow these steps to set up and run the API environment locally:

### 1. Clone the Repository
git clone https://github.com/YOUR_GITHUB_USERNAME/E-Commerce-Backend-API.git
cd E-Commerce-Backend-API

### 2. Install Project Dependencies
npm install

### 3. Configure Environment Variables
Create a file named .env in the root directory of the project and populate it with your local configurations (see the Environment Variables section below).

### 4. Seed the Database
Populate your database with mock category and product entries to enable immediate testing:
npm run seed

### 5. Start the Development Server
Launch the application using nodemon to watch for local file changes:
npm run dev

---

## 🔑 Environment Variables

Create a .env file in the root directory and add the following keys. 

> ⚠️ **Security Warning:** The .env file contains sensitive local credentials and is automatically ignored by Git using .gitignore. Never commit this file to public repositories.

| Variable | Example Value | Description |
| :--- | :--- | :--- |
| PORT | 5000 | The port number on which the Express server runs. |
| MONGO_URI | mongodb://localhost:27017/ecommerce | The connection string for your local or Atlas MongoDB instance. |
| NODE_ENV | development | Setting this to development reveals verbose backend stack traces for easier debugging. |

---

## 🛣️ API Endpoints

### 📁 Categories
| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/categories | Retrieve all categories |
| POST | /api/categories | Create a new product category |
| GET | /api/categories/:id | Retrieve a single category by its MongoDB ID |
| PUT | /api/categories/:id | Update an existing category |
| DELETE | /api/categories/:id | Delete a category from the database |

### 📦 Products
| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/products | Retrieve all products (includes stock availability status) |
| POST | /api/products | Create a new product (requires a valid categoryId) |
| GET | /api/products/:id | Retrieve detailed information for a single product |
| PUT | /api/products/:id | Update product attributes, pricing, or stock |
| DELETE | /api/products/:id | Remove a product from inventory |

### 🛒 Shopping Cart
| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/cart | View all active items and prices in the current cart session |
| POST | /api/cart | Add a product or update item quantity in the cart |
| DELETE | /api/cart/:productId | Remove a specific product completely from the cart |

### 🧾 Orders & Checkout
| Method | URL | Description |
| :--- | :--- | :--- |
| GET | /api/orders | Retrieve a historical list of all placed orders |
| GET | /api/orders/:id | View tracking and snapshot details of a single order |
| POST | /api/orders | Checkout: Convert active cart contents into an order using flat shipping details |
| PATCH | /api/orders/:id/status | Update fulfillment state (pending, shipped, delivered, etc.) |

---

## 📂 Project Structure

E-Commerce-Backend-API/
├── config/              # Database configurations and environment connection settings
├── controllers/         # Request handling logic, input validation, and business workflow
├── models/              # Mongoose Schemas definitions enforcing data integrity constraints
├── routes/              # Express Router declarations organizing endpoint hierarchies
├── utils/               # Shared helper modules (Centralized AppError, asyncHandler wrapper)
├── scripts/             # Standalone automation scripts (Database seeder utility)
├── postman/             # Exported JSON collections for instant testing integration
├── .env.example         # Blank template showcasing required environment structural keys
├── .gitignore           # Prevents security credentials and node_modules tracking
├── app.js               # Primary application file bootstrapping middleware and global error hooks
├── server.js            # Entry point establishing DB connections and starting listeners
└── package.json         # Project manifests listing explicit script directives and dependencies

---