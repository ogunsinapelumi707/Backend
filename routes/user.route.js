import express from "express"
import { updateUser, getUsers, getUser, deleteUser, savePost, profilePosts } from "../controllers/user.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"
const userRouter = express.Router()



userRouter.get("/",  getUsers)
//userRouter.get("/:id", verifyToken, getUser)   
userRouter.put("/:id", verifyToken, updateUser)   
userRouter.delete("/:id", verifyToken, deleteUser)   
userRouter.post("/save", verifyToken, savePost)   
userRouter.get("/profilePosts", verifyToken, profilePosts)   
 

export default userRouter  