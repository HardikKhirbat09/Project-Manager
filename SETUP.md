# Project Manager - Setup Guide

## Project Structure

```
project-manager/
├── backend/          # Express.js backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env
└── frontend/         # React Vite frontend
    ├── src/
    │   ├── pages/
    │   │   └── Login.jsx
    │   ├── services/
    │   │   └── authService.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd project-manager/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure your `.env` file is configured with:
   - MongoDB connection string
   - JWT secret
   - Email configuration
   - Port (default: 5000)

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd project-manager/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000` and automatically proxy API requests to `http://localhost:5000`.

## Login Page Features

### Current Implementation

- **Email & Password Login**: Simple form-based authentication
- **Error Handling**: Displays backend error messages
- **Loading States**: Shows loading indicator during login
- **Password Toggle**: Show/hide password functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Protected Routes**: Dashboard is protected and requires authentication
- **Token Storage**: JWT token stored in localStorage
- **Logout**: Logout functionality in dashboard

### API Endpoints Used

- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/current-user` - Get current user info (for protected routes)

## Next Steps

1. **User Registration Page**: Create `/register` route with registration form
2. **Password Reset**: Implement forgot password and reset password flows
3. **Dashboard**: Create projects dashboard after login
4. **Project Management**: Build project CRUD operations
5. **Task Management**: Implement task and subtask management UI

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/project-manager
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=5000
NODE_ENV=development
```

## Troubleshooting

### Login not working?
- Ensure backend is running on port 5000
- Check CORS is enabled in backend
- Verify MongoDB is running
- Check browser console for API errors

### Frontend won't start?
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Connection refused?
- Make sure backend is running: `npm run dev` in backend folder
- Check ports: Backend should be on 5000, Frontend on 3000
