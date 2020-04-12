// Middleware function to Check if User is an Employee

// import models from '../models';
// const {verify} = require('jsonwebtoken');

// var middleware={};

//  middleware.authentication=async (req, res, next) => {
//     var authToken = req.header('Authorization')
//     if(authToken){
//         try {
//             const decode = verify(authToken, process.env.EMAIL_SECRET);
//             console.log(decode.email)
//             const user = await models.User.findOne({
//                  where: { 
//                      email:decode.email
//                     } 
//             })
//             if(user.isEmployee && user.isLoggedIn){
//                 req.user = user
//                 next()
//             } 
//             else{
//                 return res.status(401).json({message:"Access denied, please login first to access this route"})
//             }          
//         }
//         catch (e) {
//             return res.send(e.message);
//         }
//         // return res.status(200).json({message:"email verified, you can log in now"})
//         // //   return res.redirect('http://localhost:8180/login');
//     }
//     else{
//         return res.status(401).json({message:"Access denied"})
//     }
// };



// module.exports=middleware


//Middleware to check if user is an employee and TL of assignedTask

const User = require('../models/User');
const Task = require('../models/Task');
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
            if(user.isEmployee && user.isLoggedIn){
                const Tl= await Task.findOne({
                    where:{
                        taskTL:user.email
                    }
                })
                if(Tl){
                    req.user = Tl
                    next()
                }
                else{
                    return res.status(401).json({message:"Only Team leader has access to submit report"})
                }
            } 
            else{
                return res.status(401).json({message:"You're not authorized to access this route"})
            }          
        }
        catch (e) {
            return res.send(e.message);
        }
        // return res.status(200).json({message:"email verified, you can log in now"})
        // //   return res.redirect('http://localhost:8180/login');
    }
    else{
        return res.status(401).json({message:"Access denied"})
    }
};



module.exports=middleware
