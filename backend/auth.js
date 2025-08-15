import jwt from 'jsonwebtoken';
import { findValidSession } from './database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        
        // Verify JWT token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Check if session exists in database
        const session = await findValidSession(token);
        if (!session) {
            return res.status(401).json({ error: 'Session expired or invalid' });
        }

        // Add user info to request
        req.user = {
            id: session.user_id,
            name: session.name,
            email: session.email
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

// Optional authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyToken(token);
            
            if (decoded) {
                const session = await findValidSession(token);
                if (session) {
                    req.user = {
                        id: session.user_id,
                        name: session.name,
                        email: session.email
                    };
                }
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
