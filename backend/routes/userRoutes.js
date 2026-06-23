import { auth } from "../middlewares/auth.js";
import express from "express"
import { getUserCreations,getPublishedCreaitons,toggleLikeCreations} from "../controllers/userController.js";
const userRouter= express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations)
userRouter.get('/get-published-creations',auth,getPublishedCreaitons)
userRouter.post('/toggle-like-creation',auth,toggleLikeCreations)

export default userRouter