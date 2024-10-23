import jwt from "jsonwebtoken"
export const verifyToken = (req, res, next) =>{
    const token = req.cookies.token
    console.log("token:", token)

    if(!token || token === undefined) return res.status(401).json({message: "Not authenticated"})
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) =>{
        if(err) return res.status(403).json({message: "Invalid token!"})
        req.userId = payload.id
        
        /* res.status(201).json({
            message: "you are Authenticated" 
        }) */
        next()
    })  
}