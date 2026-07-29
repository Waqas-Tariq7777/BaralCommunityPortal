import { useEffect, useState, useRef } from "react";
import { FiX, FiThumbsUp, FiMessageCircle, FiTrash2, FiSend, FiEdit3 } from "react-icons/fi";
import { usePostStore } from "../../../Store/PostStore.js";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../../../Store/AuthStore.js";
import axios from "axios";

const CommentModal = ({ post, onClose, onCommentAdded }) => {
  const {
    getCommentsByPost,
    addComment,
    replyToComment,
    likeComment,
    likeReply,
    editComment,
    deleteComment,
    deleteReply,
  } = usePostStore();
  const isAdmin = useAuthStore((state) => state.isAdmin);

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
  const [translatedComments, setTranslatedComments] = useState({});
  const [translatingIds, setTranslatingIds] = useState({});

  const handleTranslate = async (id, text) => {
    if (translatedComments[id]) {
      setTranslatedComments(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }

    setTranslatingIds(prev => ({ ...prev, [id]: true }));
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/user/translate`, { text });
      const translated = res.data?.translatedText;
      if (translated) {
        setTranslatedComments(prev => ({ ...prev, [id]: translated }));
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslatingIds(prev => ({ ...prev, [id]: false }));
    }
  };

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

  const handleDelete = async (commentId, replyId = null) => {
    try {
      if (replyId) {
        await deleteReply(post._id, commentId, replyId);
      } else {
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
        className={`flex gap-2 sm:gap-3 mt-3 min-w-0 ${level > 0 ? "sm:ml-8 ml-0" : ""}`}
      >
        <img
          src={reply.userId?.profilePicture?.url || "/avatar.png"}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-slate-800"
          alt="Avatar"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm border border-slate-200/20 dark:border-slate-700/20">
            <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {reply.userId?.userName || "User"}
            </p>

            {editingReplyId === reply._id ? (
              <div className="flex gap-2 mt-2">
                <input
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#748dff] focus:border-[#748dff]"
                />
                <button
                  disabled={editingLoading}
                  className="text-[#748dff] hover:text-indigo-500 font-semibold text-xs cursor-pointer px-2"
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
                  className="text-slate-400 hover:text-red-500 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 break-words leading-relaxed">
                {translatedComments[reply._id] || reply.reply}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-1.5 px-2 text-[11px] text-slate-500 font-medium">
            <button
              onClick={() => handleLikeReply(commentId, reply._id)}
              className={`cursor-pointer flex items-center gap-1.5 transition-colors ${
                reply.likedByCurrentUser ? "text-[#748dff]" : "hover:text-[#748dff]"
              }`}
            >
              <FiThumbsUp />
              <span>{reply.numberOfLikes}</span>
            </button>
            
            <button
              onClick={() => handleTranslate(reply._id, reply.reply)}
              disabled={translatingIds[reply._id]}
              className="cursor-pointer hover:text-[#748dff] transition-colors"
            >
              {translatingIds[reply._id] ? "..." : translatedComments[reply._id] ? "Original" : "Translate"}
            </button>

            <button
              onClick={() => {
                const depth = getReplyDepth(comments, reply._id);
                if (depth >= 4) {
                  setToastMessage("Replies are limited here. Please reply to the top-level comment.");
                  setTimeout(() => setToastMessage(""), 2500);
                  return;
                }
                setReplyingTo(reply._id);
              }}
              className="cursor-pointer flex items-center gap-1.5 hover:text-[#748dff] transition-colors"
            >
              <FiMessageCircle />
              <span>Reply</span>
            </button>

            {reply.userId._id === post.currentUserId && (
              <button
                onClick={() => {
                  setEditingReplyId(reply._id);
                  setEditingText(reply.reply);
                }}
                className="cursor-pointer hover:text-[#748dff] transition-colors flex items-center gap-1"
              >
                <FiEdit3 /> Edit
              </button>
            )}

            {(reply.userId._id === post.currentUserId || isAdmin) && (
              <button
                onClick={() => handleDelete(commentId, reply._id)}
                className="cursor-pointer hover:text-red-500 text-rose-500 transition-colors flex items-center gap-1"
              >
                <FiTrash2 /> Delete
              </button>
            )}
          </div>

          {replyingTo === reply._id && (
            <div className="flex gap-2 mt-2 flex-wrap items-center">
              <input
                autoFocus
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#748dff] focus:border-[#748dff]"
              />
              <button
                onClick={() => handleReply(commentId, reply._id)}
                className="text-[#748dff] hover:text-indigo-500 font-bold text-xs px-2"
              >
                Send
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-red-500 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          {reply.replies && renderReplies(reply.replies, commentId, level + 1)}
        </div>
      </div>
    ));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:px-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[85vh] sm:h-[80vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/50 dark:border-slate-800/80 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#748dff]/10 text-[#748dff] flex items-center justify-center">
              <FiMessageCircle className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white">
                Comments
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {comments.length} items on this thread
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <FiX className="text-xl cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 sm:space-y-6 bg-white dark:bg-slate-900 scrollbar-thin">
          {loading ? (
            <div className="flex justify-center py-20 items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-bounce bg-[#748dff]"></span>
              <span className="w-2.5 h-2.5 rounded-full animate-bounce delay-100 bg-[#748dff]"></span>
              <span className="w-2.5 h-2.5 rounded-full animate-bounce delay-200 bg-[#748dff]"></span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 gap-2">
              <FiMessageCircle className="text-4xl opacity-50" />
              <p className="text-sm font-medium">No comments yet. Start the conversation!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-2.5 sm:gap-3.5 min-w-0">
                <img
                  src={comment.userId?.profilePicture?.url || "/avatar.png"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover flex-shrink-0 border border-slate-200 dark:border-slate-800"
                  alt="Avatar"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-slate-200/20 dark:border-slate-700/20 shadow-sm">
                    <p className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {comment.userId?.userName || "User"}
                    </p>

                    {editingCommentId === comment._id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          autoFocus
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#748dff] focus:border-[#748dff]"
                        />
                        <button
                          disabled={editingLoading}
                          className="text-[#748dff] hover:text-indigo-500 font-bold text-xs cursor-pointer px-2"
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
                          className="text-slate-400 hover:text-red-500 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 break-words leading-relaxed">
                        {translatedComments[comment._id] || comment.comment}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 px-2 text-xs font-medium text-slate-500">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className={`cursor-pointer flex items-center gap-1.5 transition-colors ${
                        comment.likedByCurrentUser ? "text-[#748dff]" : "hover:text-[#748dff]"
                      }`}
                    >
                      <FiThumbsUp />
                      <span>{comment.numberOfLikes}</span>
                    </button>

                    <button
                      onClick={() => handleTranslate(comment._id, comment.comment)}
                      disabled={translatingIds[comment._id]}
                      className="cursor-pointer hover:text-[#748dff] transition-colors"
                    >
                      {translatingIds[comment._id] ? "Translating..." : translatedComments[comment._id] ? "Original" : "Translate"}
                    </button>

                    <button
                      onClick={() => setReplyingTo(comment._id)}
                      className="cursor-pointer flex items-center gap-1.5 hover:text-[#748dff] transition-colors"
                    >
                      <FiMessageCircle />
                      <span>Reply</span>
                    </button>

                    {comment.userId._id === post.currentUserId && (
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditingText(comment.comment);
                        }}
                        className="cursor-pointer hover:text-[#748dff] transition-colors flex items-center gap-1"
                      >
                        <FiEdit3 /> Edit
                      </button>
                    )}

                    {(comment.userId._id === post.currentUserId || isAdmin) && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="cursor-pointer hover:text-rose-600 text-rose-500 transition-colors flex items-center gap-1"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment._id)}
                        className="cursor-pointer text-indigo-500 hover:text-indigo-600 font-semibold"
                      >
                        {expandedReplies[comment._id] ? "Hide Replies" : `View Replies (${comment.replies.length})`}
                      </button>
                    )}
                  </div>

                  {expandedReplies[comment._id] && renderReplies(comment.replies || [], comment._id)}

                  {replyingTo === comment._id && (
                    <div className="flex gap-2 mt-3 flex-wrap items-center">
                      <input
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#748dff] focus:border-[#748dff]"
                      />
                      <button
                        onClick={() => handleReply(comment._id)}
                        className="text-[#748dff] hover:text-indigo-500 font-bold text-xs px-2"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="text-slate-400 hover:text-red-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 items-center">
          <input
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#748dff] focus:border-[#748dff] shadow-inner placeholder-slate-400 dark:placeholder-slate-500"
          />

          <button
            onClick={handleAddComment}
            className="p-2 sm:p-2.5 rounded-full bg-[#748dff] hover:bg-indigo-600 text-white transition-colors duration-300 shadow-md shadow-indigo-500/20 flex items-center justify-center cursor-pointer"
            aria-label="Send Comment"
          >
            <FiSend className="text-sm" />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-6 right-6 bg-[#748dff] text-white px-5 py-3 rounded-2xl shadow-xl text-sm z-[9999] border border-white/20 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CommentModal;
