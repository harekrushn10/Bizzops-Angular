import { Router } from "express";
import { changePassword, getCurrentUserDetails, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

// secured routes
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(verifyJWT,changePassword)
router.route('/get-details').get(verifyJWT,getCurrentUserDetails)
router.route('/update-account').post(verifyJWT,updateAccountDetails)

export default router