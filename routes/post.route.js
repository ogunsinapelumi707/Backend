import express from "express"
import { verifyToken } from "../middlewares/verifyToken.js"
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controllers.js"
const postRouter = express.Router()

postRouter.get('/', getPosts)
postRouter.get('/:id', getPost)
postRouter.post('/', verifyToken, addPost)
postRouter.put('/', verifyToken, updatePost)
postRouter.delete('/:id', verifyToken, deletePost)   





export default postRouter