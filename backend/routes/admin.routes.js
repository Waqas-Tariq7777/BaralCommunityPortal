import { Router } from "express";
import { addUser, uploadUserViaCSV, getUsers, updateUsers, deleteUsers, getUsersCount, getComplaintStats, getUserStats, getMonthlyComplaintStats, getYearlyCategoryStats, getMessagesCount, getResolutionProofStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { uploadCSV } from "../middlewares/uploadCSV.middleware.js";
import { getAnnouncementsCount } from "../controllers/admin.controller.js";
const router = Router()

router.route('/addUser').post(verifyJWT, isAdmin, addUser)
router.route('/uploadUserViaCSV').post(verifyJWT, uploadCSV.single("file"), isAdmin, uploadUserViaCSV)
router.route('/getUsers').get(verifyJWT, isAdmin, getUsers)
router.route('/updateUsers/:id').put(verifyJWT, isAdmin, updateUsers)
router.route('/deleteUsers/:id').delete(verifyJWT, isAdmin, deleteUsers)
router.get("/getUsersCount", verifyJWT, isAdmin, getUsersCount);
router.get("/getAnnouncementsCount", verifyJWT, isAdmin, getAnnouncementsCount);
router.get("/getComplaintStats", verifyJWT, isAdmin, getComplaintStats);
router.get("/getUserStats", verifyJWT, isAdmin, getUserStats);
router.get("/getMonthlyComplaintStats", verifyJWT, isAdmin, getMonthlyComplaintStats);
router.get(
  "/getYearlyCategoryStats",
  verifyJWT,
  isAdmin,
  getYearlyCategoryStats
);
router.get(
  "/getMessagesCount",
  verifyJWT,
  isAdmin,
  getMessagesCount
);
router.get(
  "/getResolutionProofStats",
  verifyJWT,
  isAdmin,
  getResolutionProofStats
);
export default router;  