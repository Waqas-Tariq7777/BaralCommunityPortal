import mongoose, { Schema } from "mongoose";

// Reply Schema (nested replies allowed manually)
// Reply Schema (recursive)
const replySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    numberOfLikes: { type: Number, default: 0 },
    replies: [], // <-- temporary placeholder
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// 🔁 Make it recursive AFTER declaration
replySchema.add({ replies: [replySchema] });


// Comment Schema
const commentSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    numberOfLikes: { type: Number, default: 0 },
    replies: [replySchema]
  },
  { timestamps: true }
);

// Post Schema
const postSchema = new Schema(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ url: String, public_id: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    numberOfLikes: { type: Number, default: 0 },
    comments: [commentSchema],
    isImportant: { type: Boolean, default: false },
    importantOrder: { type: Date, default: null },
    shares: { type: Number, default: 0 }, // ✅ ADD THIS
    isSharedPost: { type: Boolean, default: false },
    originalPost: { type: Schema.Types.ObjectId, ref: "Post" },
    sharedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isResolutionProof: { type: Boolean, default: false },
    targetUser: { type: Schema.Types.ObjectId, ref: "User", default: null },
    targetUserEmail: { type: String, default: null },
    complaintId: { type: Schema.Types.ObjectId, ref: "Complaint", default: null },
    resolutionVerification: {
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null },
      isSatisfied: { type: Boolean, default: null },
      rating: { type: Number, default: 0 },
      feedback: { type: String, default: "" },
      isReadByAdmin: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
