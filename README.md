# Sports E-Commerce Website

A modern, full-stack e-commerce platform for selling sports products with user authentication, shopping cart, and admin panel for product management.

## Features

- **Product Listing**: Browse all available sports products
- **Product Detail Page**: View detailed information about each product
- **Shopping Cart**: Add/remove products, manage quantities
- **User Authentication**: Register and login functionality
- **Checkout**: Complete orders with shipping information
- **Admin Panel**: Add, edit, and delete products (daily product updates)
- **Order Management**: Track user orders

## Tech Stack

### Frontend
- React 18
- React Router v6
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js & Express.js
- MongoDB for database
- JWT for authentication
- Bcryptjs for password hashing
- CORS for cross-origin requests

## Project Structure

```
sports website/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── backend/                  # Node.js backend
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route handlers (for expansion)
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone or open the project in VS Code**

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file from `.env.example`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sports-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server** (from `backend` folder)
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start Frontend** (from `frontend` folder in new terminal)
   ```bash
   npm start
   ```
   Frontend will open on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Admin Routes
- `POST /api/admin/products/add` - Add new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `GET /api/orders/user/:userId` - Get user's orders
- `POST /api/orders/create` - Create new order

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:itemId` - Remove from cart

## Daily Product Management

1. **Login to Admin Panel** (`/admin`)
2. **Fill in Product Details**:
   - Product Name
   - Description
   - Price
   - Category
   - Stock Quantity
3. **Click "Add Product"** - Product will be added to your store immediately

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Product reviews and ratings
- Search and filter functionality
- Order tracking
- Email notifications
- Inventory management
- Product images upload
- Advanced admin dashboard
- User profile management

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId,
  items: [{productId, quantity, price}],
  totalAmount: Number,
  status: String (pending/completed/cancelled),
  shippingAddress: {street, city, state, zipCode},
  paymentMethod: String,
  createdAt: Date
}
```

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.
