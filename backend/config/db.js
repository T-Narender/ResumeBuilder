import mongoose from "mongoose";


export const connectDB=async()=>{
  try {
    await mongoose.connect('mongodb+srv://tnarendergoud6300_db_user:Nari1236@cluster0.ulie1bm.mongodb.net/Resume')
    .then(()=>{
        console.log('Connected to MongoDB');
    })
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


  
