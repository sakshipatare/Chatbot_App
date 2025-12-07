import mongoose from "mongoose";

const url = "mongodb://localhost:27017/chatbot_app";

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);  //  No extra options needed
    console.log("=> Connected to MongoDB");
  } catch (err) {
    console.log("! Error connecting to MongoDB");
    console.log(err);
  }
};
