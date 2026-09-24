import { Router } from "express";
import { addComment, addPost, deletePost, deleteReply, deleteTopLevelComment, editComment, editPost, getCommentsByPost, getPostsForUser, replyToComment, sharePost, toggleLikeComment, toggleLikePost, toggleLikeReply, unsharePost, verifyResolutionPost, getUnreadVerifiedCount, markVerifiedPostAsRead } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { uploadPic } from "../middlewares/uploadImage.middleware.js";

const router = Router();

router.route("/admin/addPost").post(verifyJWT, isAdmin, uploadPic.array("images", 5), addPost);
router.route("/admin/unread-verified-count").get(verifyJWT, isAdmin, getUnreadVerifiedCount);
router.route("/admin/:postId/mark-verified-read").patch(verifyJWT, isAdmin, markVerifiedPostAsRead);
router.route("/user/posts").get(verifyJWT, getPostsForUser);
router.route("/:postId/like").post(verifyJWT, toggleLikePost);
router.route("/:postId/addComment").post(verifyJWT, addComment);
router.route("/:postId/getComments").get(verifyJWT, getCommentsByPost);
router.route("/:postId/comment/:commentId/reply").post(verifyJWT, replyToComment);
router.route("/:postId/comment/:commentId/like").patch(verifyJWT, toggleLikeComment);
router.route("/:postId/comment/:commentId/reply/:replyId/like").patch(verifyJWT, toggleLikeReply);
router.route("/:postId/comment/:commentId/edit").put(verifyJWT, editComment);
router.route("/:postId/comment/:commentId").delete(verifyJWT, deleteTopLevelComment);
router.route("/:postId/comment/:commentId/reply").delete(verifyJWT, deleteReply);
router.route("/:postId/share").post(verifyJWT, sharePost);
router.route("/:postId/unshare").delete(verifyJWT, unsharePost);

router.route("/:id/verify-resolution").post(verifyJWT, verifyResolutionPost);

router.route("/admin/posts").get(verifyJWT, isAdmin, getPostsForUser);
router.route("/admin/:postId/edit").put(verifyJWT, isAdmin, uploadPic.array("images", 5), editPost);
router.route("/admin/:postId/delete").delete(verifyJWT, isAdmin, deletePost);

export default router;
