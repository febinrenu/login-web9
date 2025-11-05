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
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Initialize database on module load
await initDatabase();

export { usersCollection };
