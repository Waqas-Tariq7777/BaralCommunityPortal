import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { FiThumbsUp, FiMessageCircle, FiShare2, FiGlobe, FiShield, FiCheckCircle, FiStar } from "react-icons/fi";
import { usePostStore } from "../../../Store/PostStore.js";
import CommentModal from "./CommentModal.jsx";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../Store/AuthStore.js";
import EditPostModal from "../../Admin/Post/EditPostModal.jsx";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import ConfirmDeleteModal from "../../Admin/ConfirmDeleteModal.jsx";
import VerifyResolutionModal from "./VerifyResolutionModal.jsx";
import axios from "axios";
import { useTranslation } from "react-i18next";

const PostCard = ({ post, onImageClick, onPostShared, }) => {
  const { t } = useTranslation();
  const [localPost, setLocalPost] = useState(post);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const likePost = usePostStore((state) => state.likePost);
  const sharePost = usePostStore((state) => state.sharePost);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const currentUser = useAuthStore((state) => state.user);
  const deletePost = usePostStore((state) => state.deletePost);
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  useEffect(() => {
    if (isAdmin && localPost.isResolutionProof && localPost.resolutionVerification?.isVerified && !localPost.resolutionVerification?.isReadByAdmin) {
      const markRead = async () => {
        try {
          const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
          await axios.patch(`${baseUrl}/api/post/admin/${localPost._id}/mark-verified-read`, {}, { withCredentials: true });
          setLocalPost((prev) => ({
            ...prev,
            resolutionVerification: {
              ...prev.resolutionVerification,
              isReadByAdmin: true,
            },
          }));
        } catch (err) {
          console.error("Failed to mark verified post as read:", err);
        }
      };
      markRead();
    }
  }, [isAdmin, localPost._id, localPost.isResolutionProof, localPost.resolutionVerification?.isVerified, localPost.resolutionVerification?.isReadByAdmin]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentUserId = String(currentUser?._id || currentUser?.id || "");
  const currentUserEmail = (currentUser?.email || "").trim().toLowerCase();

  const targetUserId = String(
    localPost.targetUser?._id ||
    localPost.targetUser?.id ||
    (typeof localPost.targetUser === "string" ? localPost.targetUser : "") ||
    ""
  );

  const targetUserEmail = (
    localPost.targetUserEmail ||
    (typeof localPost.targetUser === "object" ? localPost.targetUser?.email : "") ||
    ""
  ).trim().toLowerCase();

  const matchesUser = Boolean(
    (currentUserId && targetUserId && currentUserId === targetUserId) ||
    (currentUserEmail && targetUserEmail && currentUserEmail === targetUserEmail)
  );

  const isTargetResident = Boolean(
    localPost.isResolutionProof &&
    !isAdmin &&
    !currentUser?.isAdmin &&
    currentUser &&
    !localPost.resolutionVerification?.isVerified &&
    matchesUser
  );

  const sanitizedContent = DOMPurify.sanitize(post.content || "");
  const MAX_LENGTH = isMobile ? 120 : 300;
  const isLongContent = sanitizedContent.length > MAX_LENGTH;
  const previewContent = isLongContent && !expanded
    ? (isMobile ? sanitizedContent.slice(0, 100) : sanitizedContent.slice(0, MAX_LENGTH)) + "..."
    : sanitizedContent;

  const [translatedTitle, setTranslatedTitle] = useState("");
  const [translatedContent, setTranslatedContent] = useState("");
  const [translating, setTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }

    if (translatedContent) {
      setIsTranslated(true);
      return;
    }

    setTranslating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      let transTitle = "";
      if (cleanTitle) {
        const titleRes = await axios.post(`${apiUrl}/api/user/translate`, { text: cleanTitle });
        transTitle = titleRes.data?.translatedText || cleanTitle;
      }

      let transContent = "";
      if (post.content) {
        const contentRes = await axios.post(`${apiUrl}/api/user/translate`, { text: post.content });
        transContent = contentRes.data?.translatedText || post.content;
      }

      setTranslatedTitle(transTitle);
      setTranslatedContent(transContent);
      setIsTranslated(true);
    } catch (err) {
      console.error("Post translation failed:", err);
      toast.error("Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  const displayedContent = isTranslated
    ? (isLongContent && !expanded ? DOMPurify.sanitize(translatedContent).slice(0, MAX_LENGTH) + "..." : DOMPurify.sanitize(translatedContent))
    : previewContent;


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
  const displayedTitle = isTranslated ? translatedTitle : cleanTitle;


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
  rounded-2xl shadow p-3 sm:p-4 mb-4 w-full max-w-[850px] mx-auto transition-all overflow-hidden"
      >

        {/* 🔁 Shared By Banner */}
        {post.isSharedPost && post.sharedBy && (
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-100 dark:bg-slate-800 
                          border border-slate-200 dark:border-slate-700 
                          rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 mb-2 sm:mb-3">
            <FiShare2 className="text-blue-500 text-xs sm:text-sm" />
            <img
              src={post.sharedBy?.profilePicture?.url || "/avatar.png"}
              alt="shared by"
              className="w-6 h-6 sm:w-8 h-8 rounded-full object-cover border border-[#748dff]"
            />
            <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              Shared by{" "}
              <span className="font-semibold">
                {post.sharedBy?.userName || "User"}
              </span>
            </span>
          </div>
        )}

        {/* Header: Admin Info + Important Pill + Resolution Proof Pill + Verify Resolution Button + Urdu Translate Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-full">
            <img
              src={post.adminId?.profilePicture?.url || "/avatar.png"}
              alt="admin"
              className="border border-[#748dff] w-8 h-8 sm:w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-100 leading-tight truncate">
                {post.adminId?.userName || "Admin"}
              </h3>
              <p className="text-[10px] sm:text-xs text-[#748dff]">{timeAgo(post.createdAt)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-full justify-start sm:justify-end">
            {/* 🛡️ Resolution Proof Pill */}
            {localPost.isResolutionProof && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shadow-2xs">
                <FiShield className="text-emerald-600 dark:text-emerald-400 text-[11px] sm:text-xs shrink-0" />
                <span>{t("resolution_proof") || "Resolution Proof"}</span>
              </span>
            )}

            {/* 🔖 Admin Important Pill */}
            {isStillImportant(localPost) && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full bg-red-500 text-white shadow-2xs whitespace-nowrap">
                {t("important") || "Important"}
              </span>
            )}

            {/* 🛡️ Concerned User Verification Button / Rating Pill */}
            {localPost.isResolutionProof && (
              localPost.resolutionVerification?.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 whitespace-nowrap shadow-2xs">
                  <FiStar className="fill-amber-400 text-amber-400 text-[11px] sm:text-xs shrink-0" />
                  <span>{t("verified") || "Verified"} ({localPost.resolutionVerification.rating || 5}/5)</span>
                </span>
              ) : isTargetResident ? (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 whitespace-nowrap"
                >
                  <FiCheckCircle className="text-[11px] sm:text-xs shrink-0" />
                  <span>{t("verify_resolution") || "Verify Resolution"}</span>
                </button>
              ) : null
            )}

            {/* Urdu Translation Button */}
            <button
              onClick={handleTranslate}
              disabled={translating}
              className={`cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border transition-all duration-200 shadow-2xs whitespace-nowrap ${
                isTranslated
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 active:scale-95"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95"
              }`}
              title={isTranslated ? "Show original text" : "Translate post to Urdu"}
            >
              <FiGlobe className={`text-[11px] sm:text-xs shrink-0 ${translating ? "animate-spin text-blue-400" : ""}`} />
              <span>
                {translating ? (
                  "Translating..."
                ) : isTranslated ? (
                  <>
                    <span className="hidden sm:inline">View in </span>English
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">View in </span>Urdu
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 break-words whitespace-pre-wrap leading-snug">
          {displayedTitle}
        </h2>



        {/* Post Content */}
        <div className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 break-words">
          <div
            className={!expanded ? "line-clamp-2 sm:line-clamp-none" : ""}
            dangerouslySetInnerHTML={{ __html: displayedContent }}
          />

          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="cursor-pointer mt-0.5 text-blue-500 hover:underline text-[11px] sm:text-xs md:text-sm font-medium"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div
            className={`grid gap-1.5 sm:gap-2 mb-2 sm:mb-3 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
          >
            {post.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="post"
                loading="lazy"
                onClick={() => onImageClick(post.images, idx)}
                className={`rounded-xl object-cover w-full cursor-pointer ${post.images.length === 1
                  ? "h-48 sm:h-80"
                  : post.images.length === 3 && idx === 2
                    ? "col-span-2 h-40 sm:h-64"
                    : "h-32 sm:h-48"
                  }`}
              />
            ))}
          </div>
        )}


        {/* Likes, Comments, Shares */}
        <div className="flex justify-between text-slate-500 text-[10px] sm:text-xs md:text-sm mb-1.5 sm:mb-2">
          <span>{likesCount} likes</span>
          <span>{commentsCount} comments</span>
          <span>{sharesCount} shares</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-around border-t border-slate-200 dark:border-slate-700 pt-1.5 sm:pt-2 gap-2 text-xs sm:text-sm">

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

      <VerifyResolutionModal
        isOpen={showVerifyModal}
        post={localPost}
        onClose={() => setShowVerifyModal(false)}
        onVerifiedSuccess={(updatedPost) => {
          setLocalPost(updatedPost);
        }}
      />

    </>
  );
};

export default PostCard;
