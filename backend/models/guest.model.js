import mongoose, { Schema } from "mongoose";

const guestSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ["technical", "account", "feedback", "other"],
    },
    message: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1000,
    },
    isReadByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Guest = mongoose.model("Guest", guestSchema);