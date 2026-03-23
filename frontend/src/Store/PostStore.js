import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const usePostStore = create((set, get) => ({
  loading: false,
  posts: [],
  lastId: null,
  hasMore: true,

  resetPosts: () => {
    set({
      posts: [],
      lastId: null,
      hasMore: true,
      loading: false,
    });
  },

  // Add Post
  addPost: async (formData, onSuccess) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${baseUrl}/api/post/admin/addPost`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.status === 201) {
        toast.success("Post added successfully");
        if (onSuccess) onSuccess(res.data.data);
      }
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message;
      toast.error(backendMessage || "Failed to add post");
    }
  },

  getPosts: async ({ search = "", limit = 12, lastId = null, }) => {
    try {
      // console.log("[PostStore] getPosts called:", { search, limit, lastId });

      set({ loading: true });

      const params = { search, limit };
      if (lastId) params.lastId = lastId;
      console.log("last id is:", lastId)
      const res = await axios.get(`${baseUrl}/api/post/user/posts`, {
        params,
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Add this inside your usePostStore
  likePost: async (postId) => {
    try {
      set({ loading: true });

      const res = await axios.post(
        `${baseUrl}/api/post/${postId}/like`,
        {},
        { withCredentials: true }
      );

      const { liked, numberOfLikes } = res.data.data;

      toast.success(liked ? "Post liked!" : "Post unliked!");

      return { liked, numberOfLikes };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

    // Add comment on a post
  addComment: async (postId, comment) => {
    try {
      set({ loading: true });

      const res = await axios.post(
        `${baseUrl}/api/post/${postId}/addComment`,
        { comment },
        { withCredentials: true }
      );

      toast.success("Comment added successfully");

      return res.data.data; // newly created comment
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Get comments of a post
  getCommentsByPost: async (postId) => {
    try {
      set({ loading: true });

      const res = await axios.get(
        `${baseUrl}/api/post/${postId}/getComments`,
        { withCredentials: true }
      );

      return res.data.data; // comments array
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // ✅ FIXED
replyToComment: async (postId, commentId, reply, parentReplyId = null) => {
  try {
    set({ loading: true });
    const body = { reply };
  if (parentReplyId) body.parentReplyId = parentReplyId;
    const res = await axios.post(
      `${baseUrl}/api/post/${postId}/comment/${commentId}/reply`,
      body, // body
      { withCredentials: true } // config
    );

    toast.success("Reply added successfully");

    return res.data.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},


  // Like / Unlike a comment
  likeComment: async (postId, commentId) => {
    try {
      set({ loading: true });

      const res = await axios.patch(
        `${baseUrl}/api/post/${postId}/comment/${commentId}/like`,
        {},
        { withCredentials: true }
      );

      const { liked, numberOfLikes } = res.data.data;

      toast.success(liked ? "Comment liked!" : "Comment unliked!");

      return { liked, numberOfLikes };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Like / Unlike a reply
  likeReply: async (postId, commentId, replyId) => {
    try {
      set({ loading: true });

      const res = await axios.patch(
        `${baseUrl}/api/post/${postId}/comment/${commentId}/reply/${replyId}/like`,
        {},
        { withCredentials: true }
      );

      const { liked, numberOfLikes } = res.data.data;

      toast.success(liked ? "Reply liked!" : "Reply unliked!");

      return { liked, numberOfLikes };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Edit a comment or a reply
editComment: async (postId, commentId, newText, replyId = null) => {
  try {
    set({ loading: true });

    const body = { newText };
    if (replyId) body.replyId = replyId;

    const res = await axios.put(
      `${baseUrl}/api/post/${postId}/comment/${commentId}/edit`,
      body,
      { withCredentials: true }
    );

    toast.success(replyId ? "Reply updated successfully" : "Comment updated successfully");

    return res.data.data; // updated comment or reply
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Delete top-level comment
deleteComment: async (postId, commentId) => {
  try {
    set({ loading: true });

    const res = await axios.delete(
      `${baseUrl}/api/post/${postId}/comment/${commentId}`,
      { withCredentials: true }
    );

    toast.success("Comment deleted successfully");

    return res.data.data; // { commentId }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},


// Delete reply / nested reply
deleteReply: async (postId, commentId, replyId) => {
  try {
    if (!replyId) {
      throw new Error("replyId is required");
    }

    set({ loading: true });

    const res = await axios.delete(
      `${baseUrl}/api/post/${postId}/comment/${commentId}/reply`,
      {
        params: { replyId }, // 👈 matches ?replyId=...
        withCredentials: true,
      }
    );

    toast.success("Reply deleted successfully");

    return res.data.data; // { commentId, replyId }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg);
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Share a post
sharePost: async (postId) => {
  try {
    set({ loading: true });

    const res = await axios.post(
      `${baseUrl}/api/post/${postId}/share`,
      {}, // no body needed
      { withCredentials: true }
    );

    toast.success("Post shared successfully!Please refresh the page");

    return res.data.data; // the shared post
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg || "Failed to share post");
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Unshare a post
unsharePost: async (postId) => {
  try {
    set({ loading: true });

    const res = await axios.delete(
      `${baseUrl}/api/post/${postId}/unshare`,
      { withCredentials: true }
    );

    toast.success("Post unshared successfully!Please refresh the page");

    return res.data.data; // { postId }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg || "Failed to unshare post");
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

//Admin
getPostsForAdmin: async ({ search = "", limit = 12, lastId = null, }) => {
    try {
      // console.log("[PostStore] getPosts called:", { search, limit, lastId });

      set({ loading: true });

      const params = { search, limit };
      if (lastId) params.lastId = lastId;
      console.log("last id is:", lastId)
      const res = await axios.get(`${baseUrl}/api/post/admin/posts`, {
        params,
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg);
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Edit Post (Admin)
editPost: async (postId, formData) => {
  try {
    set({ loading: true });

    const res = await axios.put(
      `${baseUrl}/api/post/admin/${postId}/edit`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    toast.success("Post updated successfully");

    return res.data.data; // updated post
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg || "Failed to update post");
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

// Delete a post (Admin only)
deletePost: async (postId) => {
  try {
    set({ loading: true });

    const res = await axios.delete(
      `${baseUrl}/api/post/admin/${postId}/delete`,
      { withCredentials: true }
    );

    // Remove deleted post from local store
    const posts = get().posts.filter(p => p._id !== postId);
    set({ posts });

    return res.data.data; // { postId }
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    toast.error(msg || "Failed to delete post");
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

}));
