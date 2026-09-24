import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Complaint } from "../models/complaint.model.js";
import { Message } from "../models/message.model.js";

// Add a new post (Admin only)
const addPost = asyncHandler(async (req, res) => {
  const { title, content, isImportant, isResolutionProof, targetUserEmail, complaintId } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  let images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "posts",
          resource_type: "image",
        }
      );

      images.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }
  }

  // 🔴 IMPORTANT ANNOUNCEMENT LOGIC
  const importantFlag = isImportant === "true" || isImportant === true;
  const resolutionProofFlag = isResolutionProof === "true" || isResolutionProof === true;

  let targetUser = null;
  let targetComplaint = null;

  if (resolutionProofFlag) {
    if (!targetUserEmail) {
      throw new ApiError(400, "Target user email is required for resolution proof posts");
    }
    targetUser = await User.findOne({ email: targetUserEmail.trim() });
    if (!targetUser) {
      throw new ApiError(404, "Target user with provided email not found");
    }

    if (complaintId) {
      targetComplaint = await Complaint.findById(complaintId);
    } else {
      targetComplaint = await Complaint.findOne({ userId: targetUser._id }).sort({ createdAt: -1 });
    }
  }

  const post = await Post.create({
    adminId: req.user._id,
    title,
    content,
    images,
    isImportant: importantFlag,
    importantOrder: importantFlag ? new Date() : null,
    isResolutionProof: resolutionProofFlag,
    targetUser: targetUser ? targetUser._id : null,
    targetUserEmail: targetUser ? targetUser.email : (targetUserEmail || null),
    complaintId: targetComplaint ? targetComplaint._id : (complaintId || null),
    likes: [],
    comments: [],
    shares: 0,
  });

  if (resolutionProofFlag && targetComplaint) {
    targetComplaint.resolutionProofPost = post._id;
    await targetComplaint.save();
  }

  // Send notification message to concerned user
  if (resolutionProofFlag && targetUser) {
    await Message.create({
      sender: req.user._id,
      recipient: targetUser._id,
      email: targetUser.email,
      message: "Proof has been uploaded for your complaint. Please check and verify it.",
    });
  }

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});


// Get posts for users (Infinite Scroll + Search)
const getPostsForUser = asyncHandler(async (req, res) => {
    const { limit = 12, lastId, search } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
        ];
    }

    if (lastId) {
        query._id = { $lt: lastId };
    }

    const posts = await Post.find(query)
        .populate("adminId", "userName email profilePicture")
        .populate("targetUser", "userName email")
        .populate("comments.userId", "userName profilePicture")
        .populate("comments.replies.userId", "userName profilePicture")
        .populate("sharedBy", "userName profilePicture")
        .populate("originalPost", "title content images adminId")
        .sort({ _id: -1 })
        .limit(parseInt(limit));

if (!posts.length) {
    return res.status(200).json(
        new ApiResponse(200, [], "No posts found", { hasMore: false })
    );
}

const lastPostId = posts[posts.length - 1]._id;
const hasMore = posts.length === parseInt(limit);

// Add likedByCurrentUser field
const postsWithLikeInfo = posts.map((post) => ({
    ...post.toObject(),
    currentUserId: req.user._id,
    likedByCurrentUser: post.likes.includes(req.user._id),
}));

console.log('last id is ', lastPostId)
return res.status(200).json(
    new ApiResponse(200, postsWithLikeInfo, "Posts fetched successfully", {
        lastId: lastPostId,
        hasMore,
    })

);
});

// Like / Unlike a post (User)
const toggleLikePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
        post.likes = post.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
        post.numberOfLikes = Math.max(post.numberOfLikes - 1, 0);
    } else {
        post.likes.push(userId);
        post.numberOfLikes += 1;
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                postId: post._id,
                liked: !alreadyLiked,
                numberOfLikes: post.numberOfLikes,
            },
            alreadyLiked ? "Post unliked successfully" : "Post liked successfully"
        )
    );
});

// Add a comment to a post
// Add a comment to a post
const addComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;

    if (!comment) {
        throw new ApiError(400, "Comment text is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const newComment = {
        _id: new mongoose.Types.ObjectId(),
        userId: req.user._id,
        comment,
        likes: [],
        numberOfLikes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // 🔥 POPULATE the newly added comment user
    const populatedPost = await Post.findById(postId)
        .populate("comments.userId", "userName profilePicture");

    const populatedComment =
        populatedPost.comments[populatedPost.comments.length - 1];

    return res.status(201).json(
        new ApiResponse(201, populatedComment, "Comment added successfully")
    );
});


// Get comments of a post
const getCommentsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await Post.findById(postId)
        .populate("comments.userId", "userName profilePicture")
        .populate("comments.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.replies.userId", "userName profilePicture");

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(
        new ApiResponse(200, post.comments, "Comments fetched successfully")
    );
});

// Reply to a comment
const replyToComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const { reply, parentReplyId } = req.body; // parentReplyId is optional

    if (!reply) {
        throw new ApiError(400, "Reply text is required");
    }

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const newReply = {
        _id: new mongoose.Types.ObjectId(),
        userId: req.user._id,
        reply,
        likes: [],
        numberOfLikes: 0,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    if (parentReplyId) {
        // Replying to a nested reply
        const addNestedReply = (replies) => {
            for (let r of replies) {
                if (r._id.toString() === parentReplyId) {
                    r.replies.push(newReply);
                    return true;
                }
                if (r.replies.length) {
                    const found = addNestedReply(r.replies);
                    if (found) return true;
                }
            }
            return false;
        };
        addNestedReply(comment.replies);
    } else {
        // Replying to top-level comment
        comment.replies.push(newReply);
    }

    comment.updatedAt = new Date();
    await post.save();

    const populatedPost = await Post.findById(postId)
        .populate("comments.userId", "userName profilePicture")
        .populate("comments.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.replies.userId", "userName profilePicture");


    // Find the populated reply
    let populatedReply = null;

    const findReply = (replies) => {
        for (let r of replies) {
            if (r._id.toString() === newReply._id.toString()) return r;
            if (r.replies.length) {
                const res = findReply(r.replies);
                if (res) return res;
            }
        }
        return null;
    };

    const populatedComment = populatedPost.comments.id(commentId);
    populatedReply = findReply(populatedComment.replies);


    return res.status(201).json(
        new ApiResponse(201, populatedReply, "Reply added successfully")
    );
});


// Like / Unlike a comment
const toggleLikeComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
        comment.likes = comment.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
        comment.numberOfLikes = Math.max(comment.numberOfLikes - 1, 0);
    } else {
        comment.likes.push(userId);
        comment.numberOfLikes += 1;
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                commentId,
                liked: !alreadyLiked,
                numberOfLikes: comment.numberOfLikes,
            },
            alreadyLiked
                ? "Comment unliked successfully"
                : "Comment liked successfully"
        )
    );
});

function findReplyById(replies, replyId) {
    for (const r of replies) {
        if (r._id.toString() === replyId.toString()) return r;
        if (r.replies && r.replies.length) {
            const found = findReplyById(r.replies, replyId);
            if (found) return found;
        }
    }
    return null;
}

const toggleLikeReply = asyncHandler(async (req, res) => {
    const { postId, commentId, replyId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // 🔹 Use recursive search
    const reply = findReplyById(comment.replies, replyId);
    if (!reply) throw new ApiError(404, "Reply not found");

    const alreadyLiked = reply.likes.includes(userId);

    if (alreadyLiked) {
        reply.likes = reply.likes.filter(id => id.toString() !== userId.toString());
        reply.numberOfLikes = Math.max(reply.numberOfLikes - 1, 0);
    } else {
        reply.likes.push(userId);
        reply.numberOfLikes += 1;
    }

    reply.updatedAt = new Date();

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                replyId,
                liked: !alreadyLiked,
                numberOfLikes: reply.numberOfLikes,
            },
            alreadyLiked ? "Reply unliked successfully" : "Reply liked successfully"
        )
    );
});

// Edit a comment or a reply
const editComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;
    const { newText, replyId } = req.body; // replyId is optional

    if (!newText) {
        throw new ApiError(400, "New text is required");
    }

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (replyId) {
        // Editing a nested reply
        const editNestedReply = (replies) => {
            for (let r of replies) {
                if (r._id.toString() === replyId) {
                    r.reply = newText;
                    r.updatedAt = new Date();
                    return true;
                }
                if (r.replies.length) {
                    const found = editNestedReply(r.replies);
                    if (found) return true;
                }
            }
            return false;
        };

        const found = editNestedReply(comment.replies);
        if (!found) throw new ApiError(404, "Reply not found");
    } else {
        // Editing a top-level comment
        comment.comment = newText;
        comment.updatedAt = new Date();
    }

    await post.save();

    // Populate to return updated comment/reply
    const populatedPost = await Post.findById(postId)
        .populate("comments.userId", "userName profilePicture")
        .populate("comments.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.userId", "userName profilePicture")
        .populate("comments.replies.replies.replies.userId", "userName profilePicture");

    if (replyId) {
        // Find the populated reply
        let updatedReply = null;
        const findReply = (replies) => {
            for (let r of replies) {
                if (r._id.toString() === replyId) return r;
                if (r.replies.length) {
                    const res = findReply(r.replies);
                    if (res) return res;
                }
            }
            return null;
        };
        const populatedComment = populatedPost.comments.id(commentId);
        updatedReply = findReply(populatedComment.replies);
        return res.status(200).json(
            new ApiResponse(200, updatedReply, "Reply updated successfully")
        );
    } else {
        // Return updated comment
        const updatedComment = populatedPost.comments.id(commentId);
        return res.status(200).json(
            new ApiResponse(200, updatedComment, "Comment updated successfully")
        );
    }
});

// Delete a top-level comment
const deleteTopLevelComment = asyncHandler(async (req, res) => {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    const commentIndex = post.comments.findIndex(
        (c) => c._id.toString() === commentId
    );

    if (commentIndex === -1) {
        throw new ApiError(404, "Comment not found");
    }

    post.comments.splice(commentIndex, 1); // ✅ SAFE DELETE
    await post.save();

    res.status(200).json(new ApiResponse(200, "Comment deleted"));
});


// Delete a reply or nested reply
const deleteReply = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  const { replyId } = req.query;

  if (!replyId) {
    throw new ApiError(400, "replyId is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  let deleted = false;

  const deleteNestedReply = (replies) => {
    for (let i = 0; i < replies.length; i++) {
      const r = replies[i];

      if (r._id.toString() === replyId) {
        const isOwner = r.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin === true;

        // ✅ allow owner OR admin
        if (!isOwner && !isAdmin) {
          throw new ApiError(403, "You are not allowed to delete this reply");
        }

        replies.splice(i, 1);
        deleted = true;
        return true;
      }

      if (r.replies.length) {
        const found = deleteNestedReply(r.replies);
        if (found) return true;
      }
    }
    return false;
  };

  deleteNestedReply(comment.replies);

  if (!deleted) {
    throw new ApiError(404, "Reply not found");
  }

  comment.updatedAt = new Date();
  await post.save();

  return res.status(200).json(
    new ApiResponse(200, { commentId, replyId }, "Reply deleted successfully")
  );
});

// Share a post
const sharePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!postId) throw new ApiError(400, "Post ID is required");

    const originalPost = await Post.findById(postId);
    if (!originalPost) throw new ApiError(404, "Original post not found");

    const sharingUser = await User.findById(userId);
    if (!sharingUser) throw new ApiError(404, "Sharing user not found");

    const sharedTitle = `${originalPost.title} (shared by ${sharingUser.userName})`;

    const sharedPost = await Post.create({
        adminId: originalPost.adminId,
        title: sharedTitle,
        content: originalPost.content,
        images: originalPost.images,
        likes: [],
        numberOfLikes: 0,
        comments: [],
        shares: 0,
        isSharedPost: true,
        originalPost: originalPost._id,
        sharedBy: userId
    });

    originalPost.shares = (originalPost.shares || 0) + 1;
    await originalPost.save();

    const populatedSharedPost = await Post.findById(sharedPost._id)
        .populate("sharedBy", "userName profilePicture")
        .populate("originalPost", "title content images adminId")
        .populate("adminId", "userName profilePicture"); // ✅ populate admin info

    return res.status(201).json(
        new ApiResponse(201, populatedSharedPost, "Post shared successfully")
    );
});

// Unshare a post (delete shared post + decrement original shares)
const unsharePost = asyncHandler(async (req, res) => {
  const { postId } = req.params; // this is the SHARED post id
  const userId = req.user._id;

  const sharedPost = await Post.findById(postId);
  if (!sharedPost) throw new ApiError(404, "Shared post not found");

  if (!sharedPost.isSharedPost || !sharedPost.originalPost) {
    throw new ApiError(400, "This post is not a shared post");
  }

  // Only the user who shared it can unshare
  if (sharedPost.sharedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to unshare this post");
  }

  // Decrement original post share count
  const originalPost = await Post.findById(sharedPost.originalPost);
  if (originalPost) {
    originalPost.shares = Math.max((originalPost.shares || 1) - 1, 0);
    await originalPost.save();
  }

  // Delete the shared post
  await Post.findByIdAndDelete(postId);

  return res.status(200).json(
    new ApiResponse(200, { postId }, "Post unshared successfully")
  );
});

// Edit a post (Admin only)
const editPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { title, content, removedImages } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  let images = post.images || [];

  // 🧨 1) Remove images that admin deleted from UI
  if (removedImages) {
    const removed = JSON.parse(removedImages);

    for (const img of removed) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    images = images.filter(
      (img) => !removed.some((r) => r.public_id === img.public_id)
    );
  }

  // ➕ 2) Append new uploaded images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "posts",
          resource_type: "image",
        }
      );

      images.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }
  }

  // Update original post
  post.title = title;
  post.content = content;
  post.images = images;
  post.updatedAt = new Date();
  await post.save();

  // 🔁 Update all shared posts (preserve shared title suffix)
const sharedPosts = await Post.find({
  isSharedPost: true,
  originalPost: post._id,
});

for (const shared of sharedPosts) {
  const sharedByUser = await User.findById(shared.sharedBy);

  const sharedTitle = sharedByUser
    ? `${title} (shared by ${sharedByUser.userName})`
    : `${title} (shared)`;

  shared.title = sharedTitle;
  shared.content = content;
  shared.images = images;
  shared.updatedAt = new Date();

  await shared.save();
}


  const updatedPost = await Post.findById(post._id)
    .populate("adminId", "userName profilePicture");

  return res.status(200).json(
    new ApiResponse(200, updatedPost, "Post updated successfully")
  );
});

// Delete a post (Admin only, original posts only)
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // 1️⃣ Find the post
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  // 2️⃣ Check admin ownership
  if (!req.user.isAdmin || post.adminId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  // 3️⃣ Prevent deletion of shared posts
  if (post.isSharedPost) {
    throw new ApiError(400, "Cannot delete a shared post");
  }

  // 4️⃣ Delete images from Cloudinary
  if (post.images && post.images.length > 0) {
    for (const img of post.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
  }

  // 5️⃣ Delete all shared posts referencing this post
  await Post.deleteMany({ isSharedPost: true, originalPost: post._id });

  // 6️⃣ Delete the post itself
  await post.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, { postId }, "Post deleted successfully")
  );
});

// Verify resolution for a proof post (Concerned user only)
const verifyResolutionPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, feedback, isSatisfied } = req.body;

  const post = await Post.findById(id);
  if (!post) throw new ApiError(404, "Post not found");

  if (!post.isResolutionProof) {
    throw new ApiError(400, "This post is not a resolution proof post");
  }

  const isTarget = (post.targetUser && post.targetUser.toString() === req.user._id.toString()) ||
                   (post.targetUserEmail && post.targetUserEmail.toLowerCase() === req.user.email.toLowerCase());

  if (!isTarget) {
    throw new ApiError(403, "Only the concerned user can verify this resolution");
  }

  const numericRating = Number(rating) || 5;

  post.resolutionVerification = {
    isVerified: true,
    verifiedAt: new Date(),
    isSatisfied: isSatisfied !== undefined ? Boolean(isSatisfied) : true,
    rating: numericRating,
    feedback: feedback || "",
  };

  await post.save();

  if (post.complaintId) {
    const complaint = await Complaint.findById(post.complaintId);
    if (complaint) {
      complaint.resolutionVerified = true;
      complaint.resolutionRating = numericRating;
      complaint.resolutionFeedback = feedback || "";
      complaint.resolutionVerifiedAt = new Date();
      if (isSatisfied !== false) {
        complaint.status = "resolved";
      }
      await complaint.save();
    }
  }

  return res.status(200).json(new ApiResponse(200, post, "Resolution verification submitted successfully"));
});

// Get unread verified proof posts count for admin
const getUnreadVerifiedCount = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments({
    isResolutionProof: true,
    "resolutionVerification.isVerified": true,
    "resolutionVerification.isReadByAdmin": { $ne: true },
  });
  return res.status(200).json(new ApiResponse(200, count, "Unread verified count fetched successfully"));
});

// Mark verified proof post as read by admin
const markVerifiedPostAsRead = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.resolutionVerification && post.resolutionVerification.isVerified) {
    post.resolutionVerification.isReadByAdmin = true;
    await post.save();
  }

  return res.status(200).json(new ApiResponse(200, post, "Verified post marked as read"));
});

export {
    addPost,
    getPostsForUser,
    toggleLikePost,
    addComment,
    getCommentsByPost,
    replyToComment,
    toggleLikeComment,
    toggleLikeReply,
    editComment,
    deleteTopLevelComment,
    deleteReply,
    sharePost,
    unsharePost,
    editPost,
    deletePost,
    verifyResolutionPost,
    getUnreadVerifiedCount,
    markVerifiedPostAsRead
};
