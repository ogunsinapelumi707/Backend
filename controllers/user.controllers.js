import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs"

export const getUsers = async(req, res) =>{
    try {
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}
export const getUser = async(req, res) =>{
    const id = req.params.id
    try {
        const user = await prisma.user.findUnique({
            where:{
                id
            }
        })
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}

export const updateUser = async(req, res) =>{
    const id = req.params.id
    const tokenUserId = req.userId
    const {password, avatar, ...inputs} = req.body
    if(id !== tokenUserId){
        return res.status(403).json({
            messge: "Not Authorized...."
        })
    }
    let updatePassword = null
    try {
        if(password) updatePassword = await bcrypt.hashSync(password, 10)
        const updateUser = await prisma.user.update({
            where:{id},
            data: {
                ...inputs,
                ...(updatePassword && {password: updatePassword}) ,
                ...(avatar && {avatar}) ,
            },
        }) 
        const {password: userPassword, ...rest} = updateUser
        res.status(200).json(rest) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}
export const deleteUser = async(req, res) =>{
    const id = req.params.id
    const tokenUserId = req.userId
    if(id !== tokenUserId){
        return res.status(403).json({
            messge: "Not Authorized...."
        })
    }
    try {
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({message: "Account deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}
export const savePost = async(req, res) =>{
    const postId = req.body.postId
    const tokenUserId = req.userId
    try {
        const savedPost = await prisma.SavedPost.findUnique({
            where:{
                userId_postId:{
                    userId: tokenUserId,
                    postId
                }
            }
        })
        if(savedPost){
            await prisma.savedPost.delete({
                where:{
                    id: savedPost.id
                }
            })
            res.status(200).json({message: "Post Removed from saved List"})
        }else{
            await prisma.savedPost.create({
                data:{
                    userId: tokenUserId,
                    postId
                }
            })
            res.status(200).json({message: "Post saved"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load users..."
        })
    }
}

export const profilePosts = async(req, res) =>{
    const tokenUserId = req.userId
    try {
        const userPosts = await prisma.post.findMany({
            where:{
                userId: tokenUserId
            }
        })
        const saved = await prisma.savedPost.findMany({
            where:{
                userId: tokenUserId
            },
            include:{
                post: true
            }
        })
        const savedPosts = saved.map(item => item.post)
        res.status(200).json({userPosts, savedPosts})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to load profile Posts..."
        })
    }
}