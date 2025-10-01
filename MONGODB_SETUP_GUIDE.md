# MongoDB Atlas Integration Setup Guide

Complete guide for setting up and running StyloOutfit with MongoDB Atlas database integration.

## 📋 Overview

Your StyloOutfit application is now integrated with MongoDB Atlas to store:
- ✅ Manual user registrations (email/password)
- ✅ Google OAuth login data
- ✅ User profiles and authentication tokens
- ✅ Login history and timestamps

## 🗄️ Database Information

**MongoDB Atlas Connection String:**
```
mongodb+srv://stylooutfit:stylooutfit@cluster0.zqvautx.mongodb.net/stylooutfit
```

**Database Name:** `stylooutfit`
**Collection:** `users`

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

Open terminal in the project root and run:

```bash
cd server
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- cors (Cross-origin resource sharing)
- bcryptjs (Password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (Environment variables)
- express-validator (Input validation)

### Step 2: Start the Backend Server

**Option A - Development Mode (recommended for testing):**
```bash
npm run dev
```

**Option B - Production Mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Atlas Connected Successfully
🚀 Server running on port 5000
📍 Health check: http://localhost:5000/api/health
```

### Step 3: Open Frontend

1. Keep the backend server running
2. Open `index.html` or `auth.html` in your browser
3. Try registering or logging in

**Important:** Use a local server for the frontend (like Live Server extension in VS Code) to avoid CORS issues.

## 📁 Project Structure

```
Stylooutfit/
├── server/                      # Backend server
│   ├── models/
│   │   └── User.js             # User database model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── user.js             # User profile routes
│   ├── .env                    # Environment variables (MongoDB credentials)
│   ├── .gitignore              # Git ignore file
│   ├── package.json            # Dependencies
│   ├── server.js               # Main server file
│   └── README.md               # Server documentation
├── js/
│   ├── config.js               # API configuration (NEW)
│   ├── auth.js                 # Updated with API integration
│   └── ...other files
├── auth.html                   # Updated with config.js
└── MONGODB_SETUP_GUIDE.md      # This file
```

## 🔐 Authentication Flow

### Manual Registration
1. User fills registration form (firstName, lastName, email, password)
2. Frontend validates input
3. Frontend sends POST request to `/api/auth/register`
4. Backend validates data and checks for duplicate email
5. Backend hashes password with bcrypt
6. Backend saves user to MongoDB
7. Backend returns JWT token and user data
8. Frontend stores token in localStorage
9. User is redirected to dashboard

### Manual Login
1. User enters email and password
2. Frontend validates input
3. Frontend sends POST request to `/api/auth/login`
4. Backend finds user by email
5. Backend compares password hash
6. Backend updates lastLogin timestamp
7. Backend returns JWT token and user data
8. Frontend stores token in localStorage
9. User is redirected to dashboard

### Google OAuth Login
1. User clicks "Sign in with Google"
2. Google OAuth popup appears
3. User authenticates with Google
4. Frontend receives Google JWT token
5. Frontend decodes token to get user info
6. Frontend sends POST request to `/api/auth/google`
7. Backend checks if user exists:
   - If exists: Update lastLogin and return token
   - If new: Create new user with Google data
8. Backend returns JWT token and user data
9. Frontend stores token in localStorage
10. User is redirected to dashboard

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated MongoDB ID
  firstName: "John",                // Required
  lastName: "Doe",                  // Required
  email: "john@example.com",        // Required, unique, lowercase
  password: "hashed_password",      // Required only for manual login
  loginMethod: "manual" | "google", // How user registered
  googleId: "google_user_id",       // Only for Google login
  picture: "profile_url",           // Profile picture URL
  isEmailVerified: false,           // Email verification status
  lastLogin: ISODate,               // Last login timestamp
  createdAt: ISODate,               // Account creation date
  updatedAt: ISODate                // Last update date
}
```

## 🧪 Testing the Integration

### 1. Test Backend Health
Open browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "OK",
  "message": "StyloOutfit Backend Server is running",
  "timestamp": "2024-10-01T09:09:44.000Z"
}
```

### 2. Test Manual Registration
1. Open `auth.html` in browser
2. Click "Sign up"
3. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test1234 (must have uppercase, lowercase, number)
   - Confirm Password: Test1234
   - Check "I agree to terms"
4. Click "Create Account"
5. You should be redirected to dashboard

### 3. Test Manual Login
1. Open `auth.html`
2. Enter the credentials you just created
3. Click "Sign In"
4. You should be redirected to dashboard

### 4. Test Google Login
1. Open `auth.html`
2. Click "Continue with Google" button
3. Select your Google account
4. You should be redirected to dashboard

### 5. Verify Data in MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login to your account
3. Click "Browse Collections"
4. Select `stylooutfit` database
5. Select `users` collection
6. You should see all registered users

## 🔍 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/google` | Google OAuth | No |
| GET | `/api/auth/verify` | Verify JWT token | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update profile | Yes |
| GET | `/api/user/all` | Get all users | Yes |

## 🛠️ Troubleshooting

### Problem: "MongoDB Connection Error"
**Solution:**
1. Check your internet connection
2. Verify MongoDB Atlas credentials in `server/.env`
3. Ensure your IP is whitelisted in MongoDB Atlas:
   - Go to MongoDB Atlas Dashboard
   - Network Access → Add IP Address
   - Add your current IP or use `0.0.0.0/0` (allow all - for development only)

### Problem: "CORS Error"
**Solution:**
1. Make sure backend server is running
2. Use a local server for frontend (Live Server, http-server, etc.)
3. Don't open HTML files directly (file://)

### Problem: "Port 5000 already in use"
**Solution:**
1. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```
2. Or change port in `server/.env`:
   ```
   PORT=3000
   ```

### Problem: "Cannot find module"
**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Invalid token" or "Token expired"
**Solution:**
1. Clear localStorage in browser:
   ```javascript
   localStorage.clear()
   ```
2. Login again

### Problem: "User already exists"
**Solution:**
- Use a different email address
- Or delete the user from MongoDB Atlas

## 🔒 Security Best Practices

### For Development:
- ✅ Backend is configured with basic security
- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 30 days
- ✅ Input validation is implemented

### For Production (TODO):
- ⚠️ Change JWT_SECRET to a strong random string
- ⚠️ Use HTTPS for all connections
- ⚠️ Implement rate limiting
- ⚠️ Add email verification
- ⚠️ Use environment-specific .env files
- ⚠️ Whitelist specific IPs in MongoDB Atlas
- ⚠️ Enable MongoDB Atlas backup
- ⚠️ Implement refresh tokens
- ⚠️ Add password reset functionality
- ⚠️ Implement 2FA (Two-Factor Authentication)

## 📝 Environment Variables

The `server/.env` file contains:

```env
MONGODB_URI=mongodb+srv://stylooutfit:stylooutfit@cluster0.zqvautx.mongodb.net/stylooutfit?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=stylooutfit_secret_key_2024_secure_random_string
NODE_ENV=development
```

**Important:** Never commit `.env` file to Git (already in .gitignore)

## 🎯 Next Steps

1. ✅ Backend server is ready
2. ✅ Frontend is integrated
3. ✅ MongoDB Atlas is connected
4. 📝 Test all authentication flows
5. 📝 Add more user features (profile editing, avatar upload, etc.)
6. 📝 Implement password reset
7. 📝 Add email verification
8. 📝 Deploy to production

## 📞 Support

If you encounter any issues:
1. Check the console logs (both browser and server)
2. Verify all steps in this guide
3. Check MongoDB Atlas dashboard for connection issues
4. Review the API endpoint documentation

## 🎉 Success Indicators

Your setup is successful if:
- ✅ Backend server starts without errors
- ✅ MongoDB Atlas connection is established
- ✅ You can register a new user
- ✅ You can login with credentials
- ✅ Google OAuth works
- ✅ User data appears in MongoDB Atlas
- ✅ Dashboard shows user information

---

**Database URL:** `mongodb+srv://stylooutfit:stylooutfit@cluster0.zqvautx.mongodb.net/stylooutfit`

All user login data (both Google and manual) is now being stored in this MongoDB Atlas database! 🎉
