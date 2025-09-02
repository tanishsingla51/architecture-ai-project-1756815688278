import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed!', err);
    process.exit(1);
  });
