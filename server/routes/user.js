const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid token' 
        });
    }
};

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        
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
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, picture } = req.body;

        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Update fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (picture) user.picture = picture;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                picture: user.picture,
                loginMethod: user.loginMethod
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   GET /api/user/all
// @desc    Get all users (Admin only - for testing)
// @access  Private
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
