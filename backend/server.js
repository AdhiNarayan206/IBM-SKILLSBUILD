import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { 
    initDatabase, 
    createUser, 
    findUserByEmail, 
    updateLastLogin,
    createSession,
    deleteSession,
    saveApiKey,
    getUserApiKeys,
    saveDoubt,
    getUserDoubts
} from './database.js';
import { generateToken, authenticate, optionalAuth } from './auth.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// Authentication Routes

// Register endpoint
app.post('/auth/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await createUser(name, email, hashedPassword);

        // Generate token
        const token = generateToken(user.id);

        // Create session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await createSession(user.id, token, expiresAt);

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/auth/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find user
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Update last login
        await updateLastLogin(user.id);

        // Generate token
        const token = generateToken(user.id);

        // Create session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await createSession(user.id, token, expiresAt);

        res.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout endpoint
app.post('/auth/logout', authenticate, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7);
        
        await deleteSession(token);
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Get user profile
app.get('/auth/profile', authenticate, (req, res) => {
    res.json({ user: req.user });
});

// API Keys management
app.post('/api-keys', authenticate, async (req, res) => {
    try {
        const { apiKeys } = req.body;
        
        for (const [provider, apiKey] of Object.entries(apiKeys)) {
            if (apiKey && apiKey.trim()) {
                await saveApiKey(req.user.id, provider, apiKey.trim());
            }
        }
        
        res.json({ message: 'API keys saved successfully' });
    } catch (error) {
        console.error('API keys save error:', error);
        res.status(500).json({ error: 'Failed to save API keys' });
    }
});

app.get('/api-keys', authenticate, async (req, res) => {
    try {
        const apiKeys = await getUserApiKeys(req.user.id);
        res.json({ apiKeys });
    } catch (error) {
        console.error('API keys fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch API keys' });
    }
});

// History management
app.get('/history', authenticate, async (req, res) => {
    try {
        const doubts = await getUserDoubts(req.user.id);
        res.json({ doubts });
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// LLM API functions
async function callGeminiAPI(apiKey, base64Image, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
                ]
            }]
        })
    });
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No solution generated';
}

async function callAnthropicAPI(apiKey, base64Image, prompt) {
    // Placeholder for Anthropic API integration
    return 'Anthropic API integration coming soon';
}

async function callOpenAIAPI(apiKey, base64Image, prompt) {
    // Placeholder for OpenAI API integration
    return 'OpenAI API integration coming soon';
}

// Main solve endpoint
app.post('/solve', optionalAuth, upload.single('image'), async (req, res) => {
    try {
        const { subject = 'general', apiKeys } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded.' });
        }

        // Convert image to base64
        const base64Image = req.file.buffer.toString('base64');
        const prompt = `You are an expert tutor. Analyze this ${subject} problem in the uploaded image and provide a comprehensive, detailed solution. 

Please structure your response as follows:

1. **Problem Understanding**: First, clearly identify and explain what the problem is asking for.

2. **Step-by-Step Solution**: Provide a detailed, step-by-step breakdown of how to solve this problem. Use clear, numbered steps or logical progression. Explain WHY each step is necessary.

3. **Detailed Explanation**: For each major concept or formula used, provide background explanation. Don't assume the student knows everything - explain the underlying principles.

4. **Final Answer**: Clearly state the final answer in a separate section.

5. **Summary**: Provide key takeaways or concepts that the student should remember from this problem.

Please be thorough and educational. Use as much detail as needed to help a student truly understand the concept, not just get the answer. Include relevant formulas, theorems, or principles that apply.`;

        let solution = 'No solution could be generated';
        let providerUsed = 'none';
        let parsedApiKeys = {};

        // Parse API keys
        try {
            parsedApiKeys = typeof apiKeys === 'string' ? JSON.parse(apiKeys) : apiKeys || {};
        } catch (e) {
            console.warn('Invalid API keys format:', e);
        }

        // If user is authenticated, try to get their saved API keys
        if (req.user) {
            try {
                const userApiKeys = await getUserApiKeys(req.user.id);
                parsedApiKeys = { ...userApiKeys, ...parsedApiKeys }; // Allow override
            } catch (e) {
                console.warn('Could not fetch user API keys:', e);
            }
        }

        // Try different LLM providers in order
        try {
            if (parsedApiKeys.gemini) {
                solution = await callGeminiAPI(parsedApiKeys.gemini, base64Image, prompt);
                providerUsed = 'gemini';
            } else if (parsedApiKeys.anthropic) {
                solution = await callAnthropicAPI(parsedApiKeys.anthropic, base64Image, prompt);
                providerUsed = 'anthropic';
            } else if (parsedApiKeys.openai) {
                solution = await callOpenAIAPI(parsedApiKeys.openai, base64Image, prompt);
                providerUsed = 'openai';
            } else {
                return res.status(400).json({ 
                    error: 'No API keys provided. Please configure at least one LLM API key.' 
                });
            }
        } catch (apiError) {
            console.error('LLM API error:', apiError);
            return res.status(500).json({ 
                error: 'Failed to process your question. Please check your API keys and try again.' 
            });
        }

        // Save to history if user is authenticated
        if (req.user && solution !== 'No solution could be generated') {
            try {
                await saveDoubt(
                    req.user.id,
                    req.file.originalname,
                    subject,
                    'Image uploaded', // Could extract text from image in future
                    solution,
                    providerUsed
                );
            } catch (saveError) {
                console.warn('Could not save doubt to history:', saveError);
            }
        }

        res.json({ solution, provider: providerUsed });
    } catch (error) {
        console.error('Solve endpoint error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 AI Study Assistant backend running on port ${PORT}`);
    console.log(`📊 Database: SQLite`);
    console.log(`🔐 Authentication: JWT + Sessions`);
});
