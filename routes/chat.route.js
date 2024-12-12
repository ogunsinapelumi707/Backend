import express from "express"
import {getChats, getChat, addChat, readChat} from "../controllers/chat.controllers.js"
import { verifyToken } from "../middlewares/verifyToken.js"
const chatRouter = express.Router()



chatRouter.get("/", verifyToken, getChats)
chatRouter.get("/:id", verifyToken, getChat)
chatRouter.post("/", verifyToken, addChat)  
chatRouter.put("/read/:id", verifyToken, readChat) 
  
 


export default chatRouter  