// models/userDeletionLog.model.js

import mongoose from "mongoose";

const userDeletionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserDeletionLog = mongoose.model(
  "UserDeletionLog",
  userDeletionLogSchema
);