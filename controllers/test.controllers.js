import jwt from "jsonwebtoken"
export const shouldBeLoggedIn = async(req, res) =>{
    //const token = req.cookies.token
    console.log("userID:", req.userId)
    res.status(201).json({
        message: "you are Authenticated" 
    })
}

export const shouldBeAdmin = async(req, res) =>{
    const token = req.cookies.token
    console.log("token:", token)

    if(!token || token === undefined) return res.status(401).json({message: "Not authenticated"})
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) =>{
        if(err) return res.status(403).json({message: "Invalid token!"})
        
        if(!payload.isAdmin){
            return res.status(403).json({message: "You are not authorised!"})
        }
        
        res.status(201).json({
            message: "you are Authenticated" 
        })
    })  
}