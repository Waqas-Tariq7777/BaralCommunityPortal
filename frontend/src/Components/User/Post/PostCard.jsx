import React, { useState } from "react";
import DOMPurify from "dompurify";
import { FiThumbsUp, FiMessageCircle, FiShare2 } from "react-icons/fi";
import { usePostStore } from "../../../Store/PostStore.js";
import CommentModal from "./CommentModal.jsx";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../Store/AuthStore.js";
import EditPostModal from "../../Admin/Post/EditPostModal.jsx";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../Admin/ConfirmDeleteModal.jsx";
const PostCard = ({ post, onImageClick, onPostShared, }) => {
  const likePost = usePostStore((state) => state.likePost);
  const sharePost = usePostStore((state) => state.sharePost);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const deletePost = usePostStore((state) => state.deletePost);
  const [expanded, setExpanded] = useState(false);
  const sanitizedContent = DOMPurify.sanitize(post.content || "");
  const MAX_LENGTH = 300;
  const isLongContent = sanitizedContent.length > MAX_LENGTH;
  const previewContent = isLongContent && !expanded
    ? sanitizedContent.slice(0, MAX_LENGTH) + "..."
    : sanitizedContent;

  const [sharing, setSharing] = useState(false);

  const [liked, setLiked] = useState(post.likedByCurrentUser || false);
  const [likesCount, setLikesCount] = useState(post.numberOfLikes || 0);
  const unsharePost = usePostStore((state) => state.unsharePost);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const [deleting, setDeleting] = useState(false);

  const [unsharing, setUnsharing] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds


  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    post.comments?.length || 0
  );
  const [sharedByInfo, setSharedByInfo] = useState(
    post.isSharedPost ? post.sharedBy : null
  );
  const [sharesCount, setSharesCount] = useState(post.shares || 0);
  const cleanTitle = post.isSharedPost
    ? post.title.replace(/\s*\(shared by.*?\)$/i, "")
    : post.title;


  const handleLike = async () => {
    const previousLiked = liked;
    const previousLikesCount = likesCount;

    setLiked(!previousLiked);
    setLikesCount(previousLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await likePost(post._id);
      setLiked(res.liked);
      setLikesCount(res.numberOfLikes);
    } catch (err) {
      setLiked(previousLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const handleShare = async () => {
    if (sharing) return;

    try {
      setSharing(true);

      const sharedPost = await sharePost(post._id);

      // Update share count locally
      setSharesCount((prev) => prev + 1);

      // Add new shared post to feed immediately
      onPostShared?.(sharedPost);
    } catch (err) {
      console.error("Failed to share post:", err);
      toast.error("Failed to share post");
    } finally {
      setSharing(false);
    }
  };

  const isStillImportant = (post) => {
    if (!post.isImportant || !post.createdAt) return false;
    const age = Date.now() - new Date(post.createdAt).getTime();
    return age <= ONE_WEEK_MS;
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 10) return "just now";
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes === 1) return "a minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "an hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) return "a week ago";
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) return "a month ago";
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    if (diffInYears === 1) return "a year ago";
    return `${diffInYears} years ago`;
  };



  return (
    <>
      <div
        className="relative bg-white dark:bg-gray-900 dark:border dark:border-[#748dff] 
  rounded-2xl shadow p-4 mb-4 w-full xl:w-[850px] mx-auto"
      >

        {/* 🔖 Admin Important Pill */}
        {isStillImportant(post) && (
          <span className="absolute -top-3 right-4 z-20 px-3 py-1 text-xs font-semibold 
           rounded-full bg-red-500 text-white shadow-md">
            Important
          </span>
        )}


        {/* 🔁 Shared By Banner */}
        {post.isSharedPost && post.sharedBy && (
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 
                          border border-slate-200 dark:border-slate-700 
                          rounded-xl px-3 py-2 mb-3">
            <FiShare2 className="text-blue-500" />
            <img
              src={post.sharedBy?.profilePicture?.url || "/avatar.png"}
              alt="shared by"
              className="w-8 h-8 rounded-full object-cover border border-[#748dff]"
            />
            <span className="text-sm text-slate-700 dark:text-slate-200">
              Shared by{" "}
              <span className="font-semibold">
                {post.sharedBy?.userName || "User"}
              </span>
            </span>
          </div>
        )}

        {/* Admin Info */}
        <div className="flex items-center gap-3 mb-2">
          <img
            src={post.adminId?.profilePicture?.url || "/avatar.png"}
            alt="admin"
            className="border border-[#748dff] w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {post.adminId?.userName || "Admin"}
            </h3>
            <p className="text-xs text-[#748dff]">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 break-words whitespace-pre-wrap">
          {cleanTitle}
        </h2>



        {/* Post Content */}
        <div className="text-slate-700 dark:text-slate-300 mb-3 break-words">
          <div
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />

          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="cursor-pointer mt-1 text-blue-500 hover:underline text-sm font-medium"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={`grid gap-2 mb-3 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
          >
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="post"
                loading="lazy" // <-- added lazy loading here
                onClick={() => onImageClick(post.images, idx)}
                className={`rounded-xl object-cover w-full cursor-pointer ${post.images.length === 1
                  ? "h-80"
                  : post.images.length === 3 && idx === 2
                    ? "col-span-2 h-64"
                    : "h-48"
                  }`}
              />
            ))}
          </div>
        )}


        {/* Likes, Comments, Shares */}
        <div className="flex justify-between text-slate-500 text-sm mb-2">
          <span>{likesCount} likes</span>
          <span>{commentsCount} comments</span>
          <span>{sharesCount} shares</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-around border-t border-slate-200 dark:border-slate-700 pt-2 gap-2">

          <button
            onClick={handleLike}
            className={`cursor-pointer flex items-center gap-2 hover:text-blue-500 ${liked
              ? "text-blue-500"
              : "text-slate-600 dark:text-slate-300"
              }`}
          >
            <FiThumbsUp /> Like
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500"
          >
            <FiMessageCircle /> Comment
          </button>

          {isAdmin ? (
            <button
              onClick={() => setShowEdit(true)}
              className="cursor-pointer flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <FiEdit size={18} /> Edit
            </button>
          ) : post.isSharedPost && post.sharedBy?._id === post.currentUserId ? (
            <button
              onClick={async () => {
                if (unsharing) return;

                try {
                  setUnsharing(true);
                  await unsharePost(post._id);
                } catch {
                  toast.error("Failed to unshare post");
                } finally {
                  setUnsharing(false);
                }
              }}
              disabled={unsharing}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 disabled:opacity-60"
            >
              {unsharing ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </span>
              ) : (
                <>
                  <FiShare2 /> Unshare
                </>
              )}
            </button>
          ) : (
            <button
              onClick={async () => {
                if (sharing) return;

                try {
                  setSharing(true);
                  await handleShare();
                } finally {
                  setSharing(false);
                }
              }}
              disabled={sharing}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 disabled:opacity-60"
            >
              {sharing ? (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-[#748dff] rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </span>
              ) : (
                <>
                  <FiShare2 /> Share
                </>
              )}
            </button>
          )}

          {isAdmin && !post.isSharedPost && post.adminId._id === post.currentUserId && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 "
            >
              <FiTrash2 size={18} /> Delete
            </button>
          )}


        </div>
      </div>

      {/* Comment Modal */}
      {showComments && (
        <CommentModal
          post={post}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
        />
      )}

      {showEdit && (
        <EditPostModal
          post={post}
          onClose={() => setShowEdit(false)}
          onUpdated={(updatedPost) => {
            toast.success("Post updated");
            Object.assign(post, updatedPost); // local UI update
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        loading={deleting}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={async () => {
          try {
            setDeleting(true);
            await deletePost(post._id);
            setShowDeleteModal(false);
            toast.success("Post deleted successfully!");
          } catch (err) {
            toast.error("Failed to delete post");
          } finally {
            setDeleting(false);
          }
        }}
      />

    </>
  );
};

export default PostCard;
