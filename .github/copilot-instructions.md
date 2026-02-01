# Copilot Instructions for Sports E-Commerce Website

## Project Overview
A full-stack sports e-commerce platform with React frontend and Node.js/Express backend, featuring product management, shopping cart, user authentication, and admin panel.

## Project Structure
- `frontend/` - React application
- `backend/` - Express.js API server
- Both require separate `npm install` commands

## Common Development Tasks

### Running the Project
1. Start MongoDB service
2. Terminal 1: `cd backend && npm run dev`
3. Terminal 2: `cd frontend && npm start`

### Adding a New Feature
1. Backend: Add route in `backend/routes/`
2. Frontend: Create component in `frontend/src/components/` or `frontend/src/pages/`
3. Connect via API calls using axios

### Adding Products (Admin)
- Use the Admin Panel at `/admin` route
- Fill in product details (name, description, price, category, stock)
- Product is immediately available in the store

## Key Files
- `backend/server.js` - Express server entry point
- `frontend/src/App.js` - React app root component
- `backend/models/` - MongoDB schemas
- `frontend/src/pages/AdminPanel.js` - Product management

## Dependencies to Know
- Frontend: React, React Router, Axios
- Backend: Express, Mongoose, JWT, Bcryptjs
- Database: MongoDB

## Testing the Flow
1. Register/Login at `/login` or `/register`
2. Browse products at `/`
3. Add items to cart
4. Go to `/cart` to view
5. Checkout with shipping info
6. Admin can add products at `/admin`
