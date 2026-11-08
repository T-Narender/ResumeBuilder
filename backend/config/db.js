import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const connection = process.env.MONGODB_URI;
    await mongoose.connect(connection)
      .then(() => {
        console.log('Connected to MongoDB');
        console.log("MongoDB host:", mongoose.connection.host);
        console.log("MongoDB database:", mongoose.connection.name);
      })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};



