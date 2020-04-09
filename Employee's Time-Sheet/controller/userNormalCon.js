import models from '../models';
//const User = require('../models/User');
const {hash, compare} = require('bcryptjs');
const {sign, verify} = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const sequelize = require('sequelize');
const { Op } = require('sequelize');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.G_MAIL,
      pass: process.env.G_PASS
    },
  });

const controller ={};


controller.signUp = async (req, res)=>{
    if((req.body.email===undefined || req.body.username===undefined || req.body.password===undefined || req.body.isEmployer===undefined || req.body.companyName===undefined || req.body.isEmployee===undefined)){
        res.status(200).json({message:'Please fill the required details'})
    }
    else{
        
        models.User.findOne({
            where:{
                email:req.body.email
            }
        })
        .then((data)=>{
            if(!data){
                hash(req.body.password, 10).then(hashedPassword=>{
                    const data = {
                        username:req.body.username,
                        email:req.body.email,
                        password:hashedPassword,
                        isEmployer:req.body.isEmployer,
                        companyName:req.body.companyName,
                        isEmployee:req.body.isEmployee
                    };
                    let{username, email, password, isEmployer, companyName, isEmployee}=data
                    models.User.create({
                        username, email, password, isEmployer,companyName, isEmployee
                    }).then(data1 =>{
                        if(data1.isEmployer == true){
                            const companyData = {
                                Cname:req.body.companyName,
                                owner:data1.id
                            };
                            let{Cname, owner}=companyData
                            models.Company.create({
                                Cname, owner
                            })
                            .then(dat =>console.log(dat))
                            .catch(e=>console.log(e.message))
                            sign(
                                {
                                company:data1.companyName,
                                user: data1.id,
                                },
                                process.env.EMAIL_SECRET,
                                {
                                expiresIn: '1d',
                                },
                                (err, emailToken) => {
                                    if(err)return res.status(500).send('Server error')
                                    const url = `http://localhost:8180/employerConfirmation/${emailToken}`;
                                    const mailOptions = {
                                        from: process.env.G_MAIL,
                                        to: data1.email,
                                        subject: 'Email verification',
                                        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                                    };
                              
                                    transporter.sendMail(mailOptions, function(error, info){
                                        if (error) {
                                        console.log(error);
                                        } else {
                                        console.log('Email sent: ' + info.response);
                                        }
                                    })
                                    return res.json({message:'A link has been sent to your email address for verification'})
                                    },
                                )
                        }
                        else{
                            console.log(data1)
                            // Array

                            // Room.update(
                            //     {'job_ids': sequelize.fn('array_append', sequelize.col('job_ids'), new_jobId)},
                            //     {'where': {'id': roomId}}
                            //    );

                            // await models.User.update({ isEmailVerified: true, isEmailVerifiedByEmployer:true }, { where: { id:decode.user } });
                            
                                        const company = data1.companyName
                            models.User.findOne({where:{
                                isEmployer:true,
                                companyName:company
                            }
                            })
                            .then(adminData=>{
                                // console.log(adminData)
                                if(adminData){
                                    console.log('Found the admin')
                                    sign(
                                        {
                                        id:data1.id,
                                        email:data1.email,
                                        company:data1.companyName
                                        },
                                        process.env.EMAIL_SECRET,
                                        {
                                        expiresIn: '1d',
                                        },
                                        (err, emailToken) => {
                                            if(err)return res.status(500).send('Server error')
                                            const url = `http://localhost:8180/employeeConfirmation/${emailToken}`;
                                            const url1 =`http://localhost:8180/rejectEmployee/${emailToken}`;
                                            const mailOptions = {
                                                from: process.env.G_MAIL,
                                                to: adminData.email,
                                                subject: 'Email verification',
                                                html: `Please click on this link to approve ${req.body.username} with email ${req.body.email}: <a href="${url}">${url}</a> or Click here to reject ${req.body.username} with email ${req.body.email}:<a href="${url1}">${url1}</a>`
                                            };
                                      
                                            transporter.sendMail(mailOptions, function(error, info){
                                                if (error) {
                                                console.log(error);
                                                } else {
                                                console.log('Email sent: ' + info.response);
                                                }
                                            })
                                            return res.json({success:true, message:"Waiting for an approval from Admin, you'll be notified via email"})
                                            },
                                        )
                                }
                                else{
                                    console.log('Your company is not registered')
                                }
                            })
                            .catch(e=>console.log(e.message))
                                    // })
                                    // .catch(e=>console.log(e.message)) 
                        }
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err))    
            }
            else{
                return res.status(200).json({message:'Email is already in use'})
            }
        })
        .catch(err => console.log(err))
    }
    
}


//Confirm Employer's email

controller.employerConfirmation = async (req, res) => {
  console.log(req.params.token)
  try {
    const decode = verify(req.params.token, process.env.EMAIL_SECRET);
    console.log(decode)
    await models.User.update({ isEmailVerified: true, isEmailVerifiedByEmployer:true }, { where: { id:decode.user } });
  } 
  catch (e) {
    return res.status(500).json({message:e.message});
  }
  return res.status(200).json({message:"email verified, you can log in now"})
//   return res.redirect('http://localhost:8180/login');
};



//Confirm Employee's email by employer and send and email to employee for login in

controller.employeeConfirmation = async (req, res) => {
    console.log(req.params.token)
    try {
      const decode = verify(req.params.token, process.env.EMAIL_SECRET);
      console.log(decode)
      await models.User.update({ isEmailVerifiedByEmployer: true }, { where: { email:decode.email } });
      sign(
        {
            id:decode.id,
            user: decode.email,
            company:decode.company
        },
              process.env.EMAIL_SECRET,
        {
            expiresIn: '1d',
        },
        (err, emailToken) => {
            if(err)return res.status(500).send('Server error')
            const url = `http://localhost:8180/employerApproval/${emailToken}`;
            const mailOptions = {
                from: process.env.G_MAIL,
                to: decode.email,
                subject: 'Email verification',
                html: `Please click on this link to confirm your email: <a href="${url}">${url}</a>`,
            };
      
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            })
            return res.json({message:"A link has been sent to Employee's email address for verification"})
            },
        )
    } 
    catch (e) {
      return res.status(500).json({message:e.message});
    }
    // return res.status(200).json({message:"email verified, you can log in now"})
  //   return res.redirect('http://localhost:8180/login');
  };


//Reject employee's email by employer
controller.rejectEmployee=async(req, res)=>{
    console.log(req.params.token)
  try {
    const decode = verify(req.params.token, process.env.EMAIL_SECRET);
    console.log(decode)
    console.log(typeof(decode.id))
    await models.User.destroy({ where: { email:decode.email } });
    // models.Company.findOne({
    //     where: {
    //         Cemployee: { $in: decode.id }
    //     }
    // })
    // .then(data=>console.log(data))
    // .catch(e=>console.log(e.message));
  } 
  catch (e) {
    return res.status(500).json({message:e.message});
  }
  return res.status(200).json({message:"Rejected successfully"})
}


//Confirming employee's email after employer's approval

controller.employerApproval= async(req, res)=>{
    console.log(req.params.token)
  try {
    const decode = verify(req.params.token, process.env.EMAIL_SECRET);
    console.log(decode)
    await models.User.update({ isEmailVerified: true, }, { where: { email:decode.user } });
    models.Company.update(
        {'Cemployee': sequelize.fn('array_append', sequelize.col('Cemployee'), decode.id)},
        {'where': {'Cname': decode.company}}
        ).then(data=>{
            console.log(data)
        })
        .catch(e=>console.log(e.message));
  } 
  catch (e) {
    return res.status(500).json({message:e.message});
  }
  return res.status(200).json({message:"email verified, you can log in now"})

}

// Sign in controller for all user(employer and employee)
controller.signin = async (req, res)=>{
    if((req.body.email===undefined || req.body.password===undefined)){
        res.status(200).json({message:'Please fill the required details'})
    }
    else{
        models.User.findOne({
            where:{
                email:req.body.email
            }
        })
        .then((data)=>{
            //checking if the email exist in db
            if(data){
                //checking if user is already logged in
                if(data.isLoggedIn==false){
                    //checking for email verification tru for both the mentioned colums
                    if(data.isEmailVerified && data.isEmailVerifiedByEmployer){
                        //bcrypt password comparision
                        compare(req.body.password, data.password).then((isMatched)=>{
                            if(isMatched){
                                // creating TOKEN
                                sign({
                                    email: data.email,
                                  },
                                  process.env.EMAIL_SECRET,
                                  {
                                    expiresIn: '1d',
                                  },
                                  (err, token) =>{
                                    if(err)return res.status(500).send('Server error')
                                    console.log(`token: ${token}`)
                                    // Setting isLoggedIn to true
                                    models.User.update({ isLoggedIn: true }, { where: { email:req.body.email } })
                                    .then(data1=>{
                                        console.log(data1)
                                        if(data.isEmployer==true){
                                            let employees = []
                                            models.User.findAll({where:{
                                                companyName:data.companyName,
                                                isEmployee:true,
                                                isEmailVerified:true,
                                                isEmailVerifiedByEmployer:true
                                            }})
                                            .then(d=>{
                                                for(let i=0; i<d.length; i++){
                                                    employees.push(`id: ${d[i].id}, name: ${d[i].username}, email: ${d[i].email}`)
                                                }
                                                console.log(employees)
                                                return res.json({message:`Welcome ${data.username}`, employees:employees, token:token})
                                                
                                            })
                                            .catch(e=>console.log(e.message))
                                        }
                                        else{
                                            console.log(typeof(data.email))
                                            models.Task.findOne({
                                                where:{
                                                    taskMembers:{ [Op.contains]: [data.email] }
                                                }
                                            }).then(assignedTask=>{
                                                console.log(assignedTask)
                                                res.status(200).json({message:`Welcome ${data.username}`, Details:{
                                                    'Your username': data.username,
                                                    'Your email': data.email,
                                                    'Your are working for': data.companyName,
                                                    'Your joining date': data.createdAt
                                                }, Task_Assigned:assignedTask, token:token})
                                            })
                                            .catch(e=>console.log(e.message))
                                             
                                        }
                                        //Sending token as json
                                        // return res.status(200).json({success:true, token:token, message:'Logged in successfully'})
                                    })
                                    .catch(e=>console.log(e.message))
                                    
                                  })
                            }
                            else{
                                return res.status(404).json({message:'Invalid credentials'})
                            }
                        })
                        .catch(e=>console.log(e.message))
                    }
                    else{
                        return res.status(400).json({message:'Email verification is required'})
                    }
                }
                else{
                    return res.json({message:"You're already logged in"})
                }
            }
            else{
                return res.status(404).json({message:'Invalid credentials'})
            }
        })
    }
}


//controller for log out (all user)
controller.signOut= async(req, res)=>{
    const user = req.user
    try {
        await models.User.update({ isLoggedIn: false }, { where: { email:user.email } });
        res.status(400).json({message:'Logged out successfully'})
      } 
      catch (e) {
        return res.status(500).json({message:e.message})
      }
    
}

// controller.addToCemployee = async(req, res)=>{
//     const numb = req.body.number
//     models.Company.findOne({
//         where:{
//             Cname:'xyz'
//         }
//     }).then(data=>{
//         data.update({
//             Cemployee:numb
//         },{where:{
//             Cname:'xyz'
//         }}).then(dat=>console.log(dat))
//         .catch(e=>console.log(e.message))
//     })
//     .catch(e=>console.log(e.message))
// }

module.exports = controller;