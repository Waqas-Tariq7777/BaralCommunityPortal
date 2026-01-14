import { Router } from "express";
import { deleteComplaint, getAllComplaints, getUserComplaints, submitComplaint, updateComplaintStatus, updateUserComplaint } from "../controllers/complaint.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.route('/user/submitComplaint').post(verifyJWT, submitComplaint)
router.route('/user/getUserComplaint').get(verifyJWT, getUserComplaints)
router.route('/user/updateUserComplaint/:complaintId').put(verifyJWT, updateUserComplaint)
router.route('/deleteComplaint/:complaintId').delete(verifyJWT, deleteComplaint)
router.route('/admin/getAllComplaints').get(verifyJWT, isAdmin, getAllComplaints)
router.route('/admin/updateStatus/:complaintId').put(verifyJWT, isAdmin, updateComplaintStatus)
export default router;
