# Apple Product Management System

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://apple-products-management-system.vercel.app)

This is a full-stack, database-centric web application demonstrating MongoDB relationships, CRUD operations, and an Apple-inspired modern UI. It uses Node.js, Express, Mongoose, and a Vanilla HTML/CSS/JS frontend.

## Requirements

- [Node.js](https://nodejs.org/) installed on your machine
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`

## Setup Instructions

### 1. Start MongoDB
Ensure that your local `mongod` service is running in the background. It will look for the connection URI `mongodb://localhost:27017/apple_prod_db`.

### 2. Install Backend Dependencies
Navigate into the `backend` directory and install the necessary Node modules:
```sh
cd backend
npm install
```

### 3. Run the Backend Server
Start the Express API server:
```sh
cd backend
npm start
```
*You should see a message saying "Successfully connected to MongoDB."*

### 4. Open the Frontend
Since the frontend uses vanilla HTML/JS, you can simply open the `frontend/index.html` file in your preferred web browser. No frontend build step or dedicated server is strictly required, although using an extension like VS Code Live Server works beautifully.

## Features & Implementation

- **RESTful API**: Proper HTTP methods mapped directly to Mongoose queries (GET, POST, PUT, DELETE).
- **Core Collections**: Database schema features 5 distinct interconnected models:
  - `Products`
  - `Customers`
  - `Orders`
  - `OrderItems`
  - `Payments`
- **MongoDB Transactions**: Ordering logic uses Mongoose Sessions to ensure stock deduction and order documentation occur atomically.
- **Frontend State**: Shopping cart simulated with LocalStorage and interconnected immediately to the checkout flow.
- **Apple UI Aesthetics**: Beautiful, clean CSS utilizing `Inter` font, soft gray backgrounds, distinct white product cards, and sleek layout grids.

## Navigating the App

- **Store (`index.html`)**: Browse the products, filter by category computationally via backend query parameters, and add available items to the cart.
- **Admin (`admin.html`)**: Add new items into the MongoDB database. A live warning box displays any product whose stock level drops below 5. View, edit, and delete current items.
- **Cart (`cart.html`)**: View items queued for purchase. Filling out customer information natively inserts new `Customer` records and references them directly to `Orders` and `Payments`.
- **Orders (`orders.html`)**: A complete view representing order history across the system using Mongoose's `.populate()` functionality. 
