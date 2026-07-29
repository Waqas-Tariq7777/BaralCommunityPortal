import { Router } from "express";
import { deleteComplaint, deleteResolvedComplaint, getAllComplaints, getUserComplaints, markComplaintAsRead, resolvedComplaint, submitComplaint, updateComplaintStatus, updateResolvedResources, updateUserComplaint, getUnreadComplaintsCount } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.route('/user/submitComplaint').post(verifyJWT, submitComplaint)
router.route('/user/getUserComplaint').get(verifyJWT, getUserComplaints)
router.route('/user/updateUserComplaint/:complaintId').put(verifyJWT, updateUserComplaint)
router.route('/deleteComplaint/:complaintId').delete(verifyJWT, deleteComplaint)
router.route('/admin/unread-count').get(verifyJWT, isAdmin, getUnreadComplaintsCount)
router.route('/admin/getAllComplaints').get(verifyJWT, isAdmin, getAllComplaints)
router.route('/admin/updateStatus/:complaintId').put(verifyJWT, isAdmin, updateComplaintStatus)
router.route('/admin/resolvedComplaints/:complaintId').put(verifyJWT, isAdmin, resolvedComplaint)
router.route('/admin/updateResources/:complaintId').put(verifyJWT, isAdmin, updateResolvedResources)
router.route('/admin/markAsRead/:complaintId').patch(verifyJWT, isAdmin, markComplaintAsRead)
router.route('/admin/deleteResolved/:complaintId').delete(verifyJWT, isAdmin, deleteResolvedComplaint);
export default router;
