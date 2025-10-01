# 🚀 Quick Start Guide - StyloOutfit with MongoDB

## ⚡ Fast Setup (3 Steps)

### Step 1: Install Dependencies
```bash
cd server
npm install
```

### Step 2: Start Backend Server
**Option A - Double click:**
- `start-server-dev.bat` (for development with auto-reload)
- OR `start-server.bat` (for production)

**Option B - Command line:**
```bash
cd server
npm run dev
```

### Step 3: Open Frontend
- Use Live Server extension in VS Code
- OR open `auth.html` in browser with a local server

## ✅ Verify Setup

1. **Backend Running?**
   - Visit: http://localhost:5000/api/health
   - Should see: `{"status": "OK", ...}`

2. **Frontend Working?**
   - Open `auth.html`
   - Try registering a new user
   - Check browser console for errors

3. **Database Connected?**
   - Server console should show: "✅ MongoDB Atlas Connected Successfully"

## 🎯 Test Authentication

### Test Manual Registration:
1. Go to auth.html
2. Click "Sign up"
3. Fill form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test1234
4. Click "Create Account"

### Test Manual Login:
1. Use the credentials above
2. Click "Sign In"

### Test Google Login:
1. Click "Continue with Google"
2. Select your Google account

## 📊 View Database

1. Go to: https://cloud.mongodb.com/
2. Login with your MongoDB Atlas account
3. Browse Collections → stylooutfit → users
4. See all registered users

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in `server/.env` |
| CORS error | Use local server for frontend |
| MongoDB error | Check internet & MongoDB Atlas IP whitelist |
| Module not found | Run `npm install` in server folder |

## 📝 Important Files

- `server/.env` - MongoDB credentials & config
- `js/config.js` - API endpoints configuration
- `js/auth.js` - Frontend authentication logic
- `server/server.js` - Backend main file
- `server/models/User.js` - User database schema

## 🔐 MongoDB Connection

```
mongodb+srv://stylooutfit:stylooutfit@cluster0.zqvautx.mongodb.net/stylooutfit
```

## 📞 Need Help?

Read the full guide: `MONGODB_SETUP_GUIDE.md`

---

**That's it! Your app is now connected to MongoDB Atlas! 🎉**
