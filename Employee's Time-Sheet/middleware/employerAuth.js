// Middleware function to Check if User is an Employer

const User = require('../models/User');
const {verify} = require('jsonwebtoken');

var middleware={};

 middleware.authentication=async (req, res, next) => {
    var authToken = req.header('Authorization')
    if(authToken){
        try {
            const decode = verify(authToken, process.env.EMAIL_SECRET);
            console.log(decode.email)
            const user = await User.findOne({
                 where: { 
                     email:decode.email
                    } 
            })
            if(user.isEmployer && user.isLoggedIn){
                req.user = user
                next()
            } 
            else{
                return res.status(401).json({message:"You're not authorized to access this route"})
            }          
        }
        catch (e) {
            return res.json({message:e.message});
        }
        // return res.status(200).json({message:"email verified, you can log in now"})
        // //   return res.redirect('http://localhost:8180/login');
    }
    else{
        return res.status(401).json({message:"Access denied"})
    }
};



module.exports=middleware

