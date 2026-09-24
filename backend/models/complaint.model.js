import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    complaintType: {
      type: String,
      enum: ["general", "special"],
      required: true,
    },
    reason: {
      type: String,
      required: function () {
        return this.compalintType !== "special";
      },
    },

    resources: [
      {
        name: {
          type: String,
        },
        cost: {
          type: Number,
        },
      },
    ],

    status: {
      type: String,
      required: true,
      enum: ["pending", "resolved", "in progress", "rejected"],
    },

    message: {
      type: String,
      required: true,
    },
    isReadByAdmin: { type: Boolean, default: false },
    resolutionProofPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
    resolutionRating: { type: Number, default: null },
    resolutionFeedback: { type: String, default: "" },
    resolutionVerified: { type: Boolean, default: false },
    resolutionVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
