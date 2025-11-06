import { MongoClient } from 'mongodb';

// MongoDB connection string - use environment variable for production
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Validate MongoDB URI in production
if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not set!');
  console.error('Please set MONGODB_URI in your Render dashboard.');
  process.exit(1);
}

if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
  console.error('ERROR: MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
  console.error('Current value:', process.env.MONGODB_URI);
  process.exit(1);
}

const client = new MongoClient(uri);

let db;
let usersCollection;

// Initialize MongoDB connection
const initDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    db = client.db('login_app');
    usersCollection = db.collection('users');
    
    // Create indexes for faster lookup
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    console.log('Database initialized successfully');
  } catch (error) {
    // Log error but do NOT exit the process. Let the server start and return
    // clear 503 responses from the API if the DB is not connected.
    console.error('MongoDB connection error:', error);
    usersCollection = null;
  }
};

// Initialize database on module load (non-blocking - allow server to start)
initDatabase().catch((err) => {
  // already handled inside initDatabase but ensure we don't leave unhandled
  console.error('initDatabase error (unexpected):', err);
});

// Getter for other modules to access the collection at runtime. If null,
// callers should respond with 503 Service Unavailable.
const getUsersCollection = () => usersCollection;

const isDbConnected = () => !!usersCollection;

export { getUsersCollection, isDbConnected };
