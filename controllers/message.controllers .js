import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs"

export const addMessage = async(req, res) =>{
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
