// models/message.model.js
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },

    parentMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    isReply: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // ✅ Track admins who soft deleted this message
    deletedForAdmin: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);