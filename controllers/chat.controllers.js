import prisma from "../lib/prisma.js"


export const getChats = async(req, res) =>{
    try {
       
        res.status(200).json([]) 
    } catch (error) {
        console.log(error) 
        res.status(500).json({
            message: "failed to load chats..."
        })
    }
}
export const getChat = async(req, res) =>{
    const tokenUserId = req.userId;
    try {
        const chat = await prisma.chat.findUnique({
            where:{
               id: req.params.id,
               userIDs:{
                hasSome:[tokenUserId],
               }
            },
            include:{
                messages:{
                    orderBy:{
                        createdAt: "asc"
                    }
                }
            }
        })
          
          const updatedSeenBy = chat.seenBy.includes(tokenUserId)
          ? chat.seenBy 
          : [...chat.seenBy, tokenUserId];
        await prisma.chat.update({
            where:{
                id: req.params.id
            },
            data:{
                seenBy:{
                    set:updatedSeenBy
                }
            }
        })
        res.status(200).json(chat)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load chat..."
        })
    }
}
export const addChat = async(req, res) =>{
    const tokenUserId = req.userId
    try {
        const newChat = await prisma.chat.create({
            data:{
                userIDs:[tokenUserId, req.body.receiverId]
            }
        })
        res.status(200).json(newChat)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to send chat..." 
        })
    }
}

export const readChat = async(req, res) =>{
    const id = req.params.id
    const tokenUserId = req.userId
    try {
        const chat = await prisma.chat.update({
            where:{
                userIDs:{
                    hasSome:[tokenUserId]
                }
            },
            data:{
                seenBy:{
                    set:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}
