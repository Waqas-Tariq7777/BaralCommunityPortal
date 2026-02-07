import { useEffect, useState, useRef } from "react";
import { FiX, FiThumbsUp, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { usePostStore } from "../../../Store/PostStore.js";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../../../Store/AuthStore.js";

const CommentModal = ({ post, onClose, onCommentAdded }) => {
  const {
    getCommentsByPost,
    addComment,
    replyToComment,
    likeComment,
    likeReply,
    editComment,
    deleteComment, // ✅ top-level delete
    deleteReply,
  } = usePostStore();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  console.log("Admin: ",isAdmin)
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingLoading, setEditingLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await getCommentsByPost(post._id);
      const processed = data.map((c) => ({
        ...c,
        likedByCurrentUser: c.likes.includes(post.currentUserId),
        replies: [],
      }));
      setComments(processed);

      const withReplies = data.map((c) => ({
        ...c,
        likedByCurrentUser: c.likes.includes(post.currentUserId),
        replies: c.replies.map(processReply),
      }));
      setComments(withReplies);
    } finally {
      setLoading(false);
    }
  };

  const processReply = (r) => ({
    ...r,
    likedByCurrentUser: r.likes.includes(post.currentUserId),
    replies: r.replies.map(processReply),
  });

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const tempComment = {
      _id: "temp-" + uuidv4(),
      userId: { userName: "You", profilePicture: { url: "/avatar.png" } },
      comment: commentText,
      likes: [],
      numberOfLikes: 0,
      likedByCurrentUser: false,
      replies: [],
    };

    setComments((prev) => [...prev, tempComment]);
    setCommentText("");
    onCommentAdded?.();

    const newComment = await addComment(post._id, commentText);

    const normalized = {
      ...newComment,
      likedByCurrentUser: false,
      replies: newComment.replies || [],
    };

    setComments((prev) =>
      prev.map((c) => (c._id === tempComment._id ? normalized : c))
    );
  };

  const handleReply = async (commentId, parentReplyId = null) => {
    if (!replyText.trim()) return;

    const tempId = "temp-" + uuidv4();
    const tempReply = {
      _id: tempId,
      userId: { userName: "You", profilePicture: { url: "/avatar.png" } },
      reply: replyText,
      likes: [],
      numberOfLikes: 0,
      likedByCurrentUser: false,
      replies: [],
    };

    const addTempReplyRecursive = (replies) =>
      replies.map((r) => {
        if (r._id === parentReplyId) {
          return { ...r, replies: [...(r.replies || []), tempReply] };
        }

        if (r.replies && r.replies.length) {
          return { ...r, replies: addTempReplyRecursive(r.replies) };
        }

        return r;
      });

    const addTempReply = (commentsList) =>
      commentsList.map((c) => {
        if (c._id === commentId && !parentReplyId) {
          return { ...c, replies: [...(c.replies || []), tempReply] };
        }

        if (parentReplyId) {
          return { ...c, replies: addTempReplyRecursive(c.replies || []) };
        }

        return c;
      });

    setComments((prev) => addTempReply(prev));
    setReplyText("");
    setReplyingTo(null);

    const newReply = await replyToComment(
      post._id,
      commentId,
      replyText,
      parentReplyId
    );

    const normalizedReply = {
      ...newReply,
      likedByCurrentUser: false,
      replies: newReply.replies || [],
    };

    const replaceTempReplyRecursive = (replies) =>
      replies.map((r) => {
        if (r._id === tempId) return normalizedReply;

        if (r.replies && r.replies.length) {
          return { ...r, replies: replaceTempReplyRecursive(r.replies) };
        }

        return r;
      });

    const replaceTempReply = (commentsList) =>
      commentsList.map((c) => {
        if (c._id === commentId && !parentReplyId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r._id === tempId ? normalizedReply : r
            ),
          };
        }

        if (parentReplyId) {
          return {
            ...c,
            replies: replaceTempReplyRecursive(c.replies || []),
          };
        }

        return c;
      });

    setComments((prev) => replaceTempReply(prev));
  };


  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleLikeComment = async (commentId) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
            ...c,
            likedByCurrentUser: !c.likedByCurrentUser,
            numberOfLikes: c.likedByCurrentUser
              ? c.numberOfLikes - 1
              : c.numberOfLikes + 1,
          }
          : c
      )
    );
    await likeComment(post._id, commentId);
  };

  const handleLikeReplyRecursive = (replies, targetId) =>
    replies.map((r) => {
      if (r._id === targetId) {
        return {
          ...r,
          likedByCurrentUser: !r.likedByCurrentUser,
          numberOfLikes: r.likedByCurrentUser
            ? r.numberOfLikes - 1
            : r.numberOfLikes + 1,
        };
      }
      return { ...r, replies: handleLikeReplyRecursive(r.replies || [], targetId) };
    });

  const handleLikeReply = async (commentId, replyId) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, replies: handleLikeReplyRecursive(c.replies, replyId) } : c
      )
    );
    await likeReply(post._id, commentId, replyId);
  };

  const getReplyDepth = (commentsList, targetId, depth = 1) => {
    for (const c of commentsList) {
      if (c._id === targetId) return depth;

      const checkReplies = (replies, currentDepth) => {
        for (const r of replies || []) {
          if (r._id === targetId) return currentDepth;

          const found = checkReplies(r.replies, currentDepth + 1);
          if (found) return found;
        }
        return null;
      };

      const found = checkReplies(c.replies, depth + 1);
      if (found) return found;
    }
    return 1;
  };

  // ✅ FIXED DELETE HANDLER (nested-safe)
  const handleDelete = async (commentId, replyId = null) => {
    try {
      if (replyId) {
        // 🔹 reply / nested reply
        await deleteReply(post._id, commentId, replyId);
      } else {
        // 🔹 top-level comment
        await deleteComment(post._id, commentId);
      }

      const removeReplyRecursive = (replies) =>
        replies
          .map((r) => {
            if (r._id === replyId) return null;

            if (r.replies && r.replies.length) {
              return {
                ...r,
                replies: removeReplyRecursive(r.replies),
              };
            }

            return r;
          })
          .filter(Boolean);

      const removeRecursive = (commentsList) =>
        commentsList
          .map((c) => {
            if (c._id === commentId && !replyId) return null;

            if (replyId) {
              return {
                ...c,
                replies: removeReplyRecursive(c.replies || []),
              };
            }

            return c;
          })
          .filter(Boolean);

      setComments((prev) => removeRecursive(prev));
    } catch (err) {
      console.error(err);
    }
  };


  const renderReplies = (replies, commentId, level = 0) =>
    replies?.map((reply) => (
      <div
        key={reply._id}
        className={`flex gap-2 mt-2 min-w-0 ${level > 0 ? "sm:ml-10 ml-0" : ""}`}
      >
        <img
          src={reply.userId?.profilePicture?.url || "/avatar.png"}
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 break-words whitespace-normal">
            <p className="font-medium text-xs text-slate-800 dark:text-white break-words whitespace-normal">
              {reply.userId?.userName || "User"}
            </p>

            {editingReplyId === reply._id ? (
              <div className="flex gap-2 mt-1">
                <input
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="dark:placeholder-gray-200 dark:text-gray-200 flex-1 px-3 py-1 rounded-full border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-[#748dff]"
                />
                <button
                  disabled={editingLoading}
                  className="text-indigo-500 cursor-pointer text-sm font-medium"
                  onClick={async () => {
                    if (!editingText.trim()) return;
                    setEditingLoading(true);
                    const updated = await editComment(
                      post._id,
                      commentId,
                      editingText,
                      reply._id
                    );
                    const updateRepliesRecursive = (repliesList) =>
                      repliesList.map((r) => {
                        if (r._id === reply._id)
                          return { ...updated, likedByCurrentUser: r.likedByCurrentUser };
                        if (r.replies && r.replies.length)
                          return { ...r, replies: updateRepliesRecursive(r.replies) };
                        return r;
                      });
                    setComments((prev) =>
                      prev.map((c) =>
                        c._id === commentId
                          ? { ...c, replies: updateRepliesRecursive(c.replies) }
                          : c
                      )
                    );
                    setEditingReplyId(null);
                    setEditingText("");
                    setEditingLoading(false);
                  }}
                >
                  {editingLoading ? "..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingReplyId(null);
                    setEditingText("");
                  }}
                  className="text-red-500 cursor-pointer text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 break-words whitespace-normal">
                {reply.reply}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-1 text-xs text-slate-500 flex-wrap">
            <button
              onClick={() => handleLikeReply(commentId, reply._id)}
              className={`cursor-pointer flex items-center gap-1 ${reply.likedByCurrentUser ? "text-blue-500" : "hover:text-indigo-500"
                }`}
            >
              <FiThumbsUp />
              {reply.numberOfLikes}
            </button>
            <button
              onClick={() => {
                const depth = getReplyDepth(comments, reply._id);
                if (depth >= 4) {
                  setToastMessage(
                    "Replies are limited here. Please reply to the top-level comment."
                  );
                  setTimeout(() => setToastMessage(""), 2500);
                  return;
                }
                setReplyingTo(reply._id);
              }}
              className=" cursor-pointer flex items-center gap-1 hover:text-indigo-500"
            >
              <FiMessageCircle />
              Reply
            </button>

           {/* Edit only for owner */}
{reply.userId._id === post.currentUserId && (
  <button
    onClick={() => {
      setEditingReplyId(reply._id);
      setEditingText(reply.reply);
    }}
    className="cursor-pointer flex items-center gap-1 hover:text-indigo-500 text-xs"
  >
    Edit
  </button>
)}

{/* Delete for owner OR admin */}
{(reply.userId._id === post.currentUserId || isAdmin) && (
  <button
    onClick={() => handleDelete(commentId, reply._id)}
    className="cursor-pointer flex items-center gap-1 hover:text-red-500 text-xs"
  >
    <FiTrash2 /> Delete
  </button>
)}

          </div>

          {replyingTo === reply._id && (
            <div className="flex gap-2 mt-2 flex-wrap">
              <input
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="dark:placeholder-gray-200 dark:text-gray-200 flex-1 px-3 py-1 rounded-full border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-[#748dff] min-w-[150px]"
              />
              <button
                onClick={() => handleReply(commentId, reply._id)}
                className="text-indigo-500 cursor-pointer text-sm font-medium"
              >
                Send
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-red-500 cursor-pointer text-sm font-medium"
              >
                ✕
              </button>
            </div>
          )}

          {reply.replies && renderReplies(reply.replies, commentId, level + 1)}
        </div>
      </div>
    ));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl min-w-[300px] h-[85vh] sm:h-[90vh] md:h-[85vh] rounded-xl shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-400">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#748dff" }}>
              <FiMessageCircle className="text-white text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white truncate">
              Comments
            </h3>
          </div>

          <button onClick={onClose}>
            <FiX className="cursor-pointer text-xl text-gray-500 hover:text-gray-700" />
          </button>
        </div>


        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10 items-center gap-1">
              <div className="w-4 h-4 rounded-full animate-bounce bg-[#748dff]"></div>
              <div className="w-4 h-4 rounded-full animate-bounce delay-150 bg-[#748dff]"></div>
              <div className="w-4 h-4 rounded-full animate-bounce delay-300 bg-[#748dff]"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex justify-center py-10 text-slate-500">
              No comments yet. Be the first to comment.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 min-w-0">
                <img
                  src={comment.userId?.profilePicture?.url || "/avatar.png"}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 break-words whitespace-normal">
                    <p className="font-medium text-sm text-slate-800 dark:text-white break-words whitespace-normal">
                      {comment.userId?.userName || "User"}
                    </p>

                    {editingCommentId === comment._id ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          autoFocus
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="dark:placeholder-gray-200 dark:text-gray-200 flex-1 px-3 py-1 rounded-full border dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-[#748dff]"
                        />
                        <button
                          disabled={editingLoading}
                          className="text-indigo-500 text-sm font-medium cursor-pointer"
                          onClick={async () => {
                            if (!editingText.trim()) return;
                            setEditingLoading(true);
                            const updated = await editComment(
                              post._id,
                              comment._id,
                              editingText
                            );
                            setComments((prev) =>
                              prev.map((c) =>
                                c._id === comment._id
                                  ? { ...updated, likedByCurrentUser: c.likedByCurrentUser }
                                  : c
                              )
                            );
                            setEditingCommentId(null);
                            setEditingText("");
                            setEditingLoading(false);
                          }}
                        >
                          {editingLoading ? "..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingText("");
                          }}
                          className="text-red-500 text-sm font-medium cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 dark:text-slate-300 break-words whitespace-normal">
                        {comment.comment}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-1 text-xs text-slate-500 flex-wrap">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`cursor-pointer flex items-center gap-1 ${comment.likedByCurrentUser ? "text-blue-500" : "hover:text-indigo-500"
                        }`}
                    >
                      <FiThumbsUp />
                      {comment.numberOfLikes}
                    </button>

                    <button
                      onClick={() => setReplyingTo(comment._id)}
                      className="cursor-pointer flex items-center gap-1 hover:text-indigo-500"
                    >
                      <FiMessageCircle />
                      Reply
                    </button>

                    {/* Edit only for owner */}
{comment.userId._id === post.currentUserId && (
  <button
    onClick={() => {
      setEditingCommentId(comment._id);
      setEditingText(comment.comment);
    }}
    className="cursor-pointer flex items-center gap-1 hover:text-indigo-500 text-xs"
  >
    Edit
  </button>
)}

{/* Delete for owner OR admin */}
{(comment.userId._id === post.currentUserId || isAdmin) && (
  <button
    onClick={() => handleDelete(comment._id)}
    className="cursor-pointer flex items-center gap-1 hover:text-red-500 text-xs"
  >
    <FiTrash2 /> Delete
  </button>
)}


                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="cursor-pointer flex items-center gap-1 hover:text-indigo-500"
                      >
                        {expandedReplies[comment._id] ? "Hide Replies" : `View Replies (${comment.replies.length})`}
                      </button>
                    )}
                  </div>

                  {expandedReplies[comment._id] && renderReplies(comment.replies || [], comment._id)}

                  {replyingTo === comment._id && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <input
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-1 rounded-full border dark:border-slate-700 dark:placeholder-gray-200 dark:text-gray-200 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-[#748dff] min-w-[150px]"
                      />
                      <button
                        onClick={() => handleReply(comment._id)}
                        className="text-indigo-500 cursor-pointer text-sm font-medium"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-red-500 cursor-pointer text-sm font-medium"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-400 flex gap-2 flex-wrap">
          <input
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 rounded-full dark:text-gray-200 border dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-[#748dff] min-w-[150px] placeholder-gray-400 dark:placeholder-gray-200"
          />

          <button
            onClick={handleAddComment}
            className="text-indigo-500 cursor-pointer font-medium"
          >
            Post
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#748dff] text-white px-4 py-4 rounded-lg shadow-xl text-md z-[9999]">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CommentModal;
