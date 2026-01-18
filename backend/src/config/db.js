import mongoose from "mongoose";

// const url = "mongodb://localhost:27017/chatbot_app";
const url = "mongodb+srv://sakshi_chatbot_user:Chatbot@cluster0.ian6xtg.mongodb.net/chatbot?retryWrites=true&w=majority";


export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);  //  No extra options needed
    console.log("=> Connected to MongoDB");
    console.log("=> DB NAME:", mongoose.connection.name);
  } catch (err) {
    console.log("! Error connecting to MongoDB");
    console.log(err);
  }
};
