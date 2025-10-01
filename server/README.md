# StyloOutfit Backend Server

Backend server for StyloOutfit with MongoDB Atlas integration for storing user authentication data.

## Features

- ✅ User Registration (Manual & Google OAuth)
- ✅ User Login (Manual & Google OAuth)
- ✅ JWT Token Authentication
- ✅ Password Hashing with bcrypt
- ✅ MongoDB Atlas Database Integration
- ✅ RESTful API Endpoints
- ✅ Input Validation
- ✅ Error Handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas Account (already configured)

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The `.env` file is already configured with your MongoDB Atlas credentials:

```
MONGODB_URI=mongodb+srv://stylooutfit:stylooutfit@cluster0.zqvautx.mongodb.net/stylooutfit?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=stylooutfit_secret_key_2024_secure_random_string
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Register User (Manual)
- **URL**: `POST /api/auth/register`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "loginMethod": "manual"
  }
}
```

#### 2. Login User (Manual)
- **URL**: `POST /api/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Response**: Same as register

#### 3. Google OAuth Login/Register
- **URL**: `POST /api/auth/google`
- **Body**:
```json
{
  "email": "john@gmail.com",
  "googleId": "google_user_id",
  "firstName": "John",
  "lastName": "Doe",
  "picture": "profile_picture_url"
}
```
- **Response**: Same as register

#### 4. Verify Token
- **URL**: `GET /api/auth/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### User Routes

#### 1. Get User Profile
- **URL**: `GET /api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object

#### 2. Update User Profile
- **URL**: `PUT /api/user/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "picture": "new_picture_url"
}
```

#### 3. Get All Users (Testing)
- **URL**: `GET /api/user/all`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of all users

### Health Check
- **URL**: `GET /api/health`
- **Response**:
```json
{
  "status": "OK",
  "message": "StyloOutfit Backend Server is running",
  "timestamp": "2024-10-01T09:09:44.000Z"
}
```

## Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required for manual login),
  loginMethod: String (enum: ['manual', 'google']),
  googleId: String (unique, for Google login),
  picture: String,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration

The frontend is already configured to connect with this backend. Make sure:

1. The backend server is running on `http://localhost:5000`
2. The frontend includes `js/config.js` before other scripts
3. CORS is enabled (already configured)

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- The frontend application

### Example curl command:
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Password123"}'
```

## Security Notes

⚠️ **Important**: 
- The JWT_SECRET in `.env` should be changed to a more secure random string in production
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for production
- Add email verification for production

## Troubleshooting

### MongoDB Connection Error
- Check if your IP address is whitelisted in MongoDB Atlas
- Verify the connection string is correct
- Ensure network connectivity

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 5000

### CORS Error
- Ensure the backend server is running
- Check if CORS is properly configured in `server.js`

## Support

For issues or questions, please contact the development team.
