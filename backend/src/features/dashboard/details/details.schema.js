import mongoose from "mongoose";

const detailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    websiteName: {
      type: String,
      required: true,
    },

    websiteURL: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export { detailsSchema };
