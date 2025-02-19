import express from "express"
import {login,logout,getMe,signup} from "../controllers/AuthController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router  = express.Router()

router.post("/login",login)
router.post("/signup",signup)
router.post("/logout",logout)
router.get("/me",authMiddleware,getMe)

export default router