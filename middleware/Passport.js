const jwt=require("jsonwebtoken");

const Passport=(req,res,next)=>{
    const token=req.headers['x-token'];
    try {
        
        console.log(token)
        if(!token){
            return res.json({status:400,message:"no token provided"})
        }
        const decode=jwt.verify(token,"UDWBhKJE");
        req.user=decode.user;
        next();
    } catch (error) {
       return res.json({status:500,message:error}); 
    }
}
module.exports=Passport