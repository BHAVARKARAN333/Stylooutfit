const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user (Manual Registration)
// @access  Public
router.post('/register', [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        // Create new user
        user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password,
            loginMethod: 'manual',
            lastLogin: new Date()
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                loginMethod: user.loginMethod,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user (Manual Login)
// @access  Public
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check if user registered with Google
        if (user.loginMethod === 'google') {
            return res.status(400).json({ 
                success: false,
                message: 'This account was created with Google. Please sign in with Google.' 
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                loginMethod: user.loginMethod,
                picture: user.picture
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   POST /api/auth/google
// @desc    Google OAuth Login/Register
// @access  Public
router.post('/google', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('googleId').notEmpty().withMessage('Google ID is required'),
    body('firstName').notEmpty().withMessage('First name is required')
], async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        const { email, googleId, firstName, lastName, picture } = req.body;

        // Check if user exists with this email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // User exists - check if it's a Google account
            if (user.loginMethod === 'manual') {
                return res.status(400).json({ 
                    success: false,
                    message: 'An account with this email already exists. Please sign in with your password.' 
                });
            }

            // Update last login and picture if changed
            user.lastLogin = new Date();
            if (picture) user.picture = picture;
            await user.save();

        } else {
            // Create new user with Google
            user = new User({
                firstName,
                lastName: lastName || '',
                email: email.toLowerCase(),
                googleId,
                picture: picture || '',
                loginMethod: 'google',
                isEmailVerified: true,
                lastLogin: new Date()
            });

            await user.save();
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: user.createdAt.getTime() === user.updatedAt.getTime() ? 'Account created successfully' : 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                loginMethod: user.loginMethod,
                picture: user.picture,
                googleId: user.googleId
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during Google authentication',
            error: error.message
        });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
});

module.exports = router;
