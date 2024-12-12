import express from "express"
import { addMessage} from "../controllers/message.controllers .js"
import { verifyToken } from "../middlewares/verifyToken.js"
const messageRouter = express.Router()



 
messageRouter.post("/", verifyToken, addMessage)   

export default messageRouter  