import mongoose from "mongoose";

const cacheSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  responses: {
    type: [String],
    default: []
  },
  useCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days in seconds
  }
});

const Cache = mongoose.model("Cache", cacheSchema);

export default Cache;
