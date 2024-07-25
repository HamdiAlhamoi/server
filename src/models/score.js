import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  level: { type: String, required: true },
  time: { type: String, required: true },
});

const Score = mongoose.model("Score", scoreSchema);
export default Score;
