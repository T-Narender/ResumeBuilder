import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const connection = process.env.MONGODB_URI;
    await mongoose.connect(connection)
      .then(() => {
        console.log('Connected to MongoDB');
      })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};



