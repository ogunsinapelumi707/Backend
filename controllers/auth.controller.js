import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) =>{
    try {
    console.log('register routes.....')
    const {username, email, password} = req.body


    const user = await prisma.user.findFirst({
        where:{
            OR:[
                {username},
                {email}
            ]
        } 
    })

    if(user) {
        res.status(500).json({message: "Username Already exist!"})
    }


    var salt = bcrypt.genSaltSync(10);
    const hashedPassword =  bcrypt.hashSync(password, salt)
    const newUser = await prisma.user.create({
        data:{
            username,
            email, 
            password: hashedPassword
        }
    });
    console.log(newUser)
    res.status(200).json({
        message:"User created successfully..."
    })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "failed to create user..."
        })
    }
}
export const login = async (req, res) =>{
    const {username, password} = req.body
    try {
        const user = await prisma.user.findUnique({
            where:{username}
        })

        if(!user) {
            res.status(500).json({message: "Invalid Credentials!"})
        }
            
       
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) {
            res.status(401).json({message: "Invalid Credentials!"})
        } 
        console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
        const age = 1000 * 60 * 60 * 24 * 7
        const token = jwt.sign({
            id: user.id, 
            isAdmin: false 
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: age
        })
        const {password: userPassword, ...userInfo} = user
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age
           // secure: true
        }).status(200).json({ userInfo});

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Failed to login!"})
    }
}
export const logout = (req, res) =>{
    res.clearCookie('token').status(201).json({
        message: "Logout Successfully"
    })
}
