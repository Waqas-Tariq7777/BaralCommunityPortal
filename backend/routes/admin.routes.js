import { Router } from "express";
import { addUser, uploadUserViaCSV, getUsers, updateUsers, deleteUsers } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { uploadCSV } from "../middlewares/uploadCSV.middleware.js";
const router = Router()

router.route('/addUser').post(verifyJWT, isAdmin, addUser)
router.route('/uploadUserViaCSV').post(verifyJWT, uploadCSV.single("file"), isAdmin, uploadUserViaCSV)
router.route('/getUsers').get(verifyJWT, isAdmin, getUsers)
router.route('/updateUsers/:id').put(verifyJWT, isAdmin, updateUsers)
router.route('/deleteUsers/:id').delete(verifyJWT, isAdmin, deleteUsers)
export default router;  