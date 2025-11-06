import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { getUsersCollection, isDbConnected } from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  // Ensure DB is connected
  if (!isDbConnected()) {
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable (database not connected)' });
  }
  try {
    const { fullName, email, username, password } = req.body;
    const usersCollection = getUsersCollection();

    // Validation
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if username already exists
  const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Check if email already exists
  const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into database
    const result = await usersCollection.insertOne({
      fullName,
      email,
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId: result.insertedId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable (database not connected)' });
  }
  try {
    const { usernameOrEmail, password } = req.body;
    const usersCollection = getUsersCollection();

    // Validation
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username/Email and password are required' 
      });
    }

    // Find user by username or email
    const user = await usersCollection.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Return success with user data (excluding password)
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!', dbConnected: isDbConnected() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
