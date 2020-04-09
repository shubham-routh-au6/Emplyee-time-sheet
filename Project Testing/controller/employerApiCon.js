import models from '../models';
const controller = {};

// controller.dashboardEmployer=(req, res)=>{
//     const employer = req.user
//     console.log(employer)
//     let employees = []
//     models.User.findAll({where:{
//         companyName:employer.companyName,
//         isEmployee:true,
//         isEmailVerified:true,
//         isEmailVerifiedByEmployer:true
//     }})
//     .then(d=>{
//         for(let i=0; i<d.length; i++){
//             employees.push(`id: ${d[i].id}, name: ${d[i].username}, email: ${d[i].email}`)
//         }
//         console.log(employees)
//         res.json({employees:employees})
        
//     })
//     .catch(e=>console.log(e.message))
// }

controller.postDashEmployer= async (req, res)=>{
    const owner = req.user
    console.log(typeof(owner.id))
    var str = req.body.taskMembers;
    const memb = str.split(" ")
    // console.log(req.body.taskTitle)
    console.log(memb)
    let errors1 = []
    let verifiedEmails =[]
    for(let employeeEmail of memb) {
        var test = await models.User.findOne({where:{
            email:employeeEmail,
            isEmailVerified:true,
            isEmailVerifiedByEmployer:true
        }})
        if(test){
            verifiedEmails.push(test.email)
        }
        else{
            errors1.push(employeeEmail)
        }
        
    }
    // res.json({Registered_email:errors, Email_not_registered:errors1})
    
    const data ={
        taskTitle:req.body.taskTitle,
        taskMembers:verifiedEmails,
        taskTL:req.body.taskTL,
        taskDetails:req.body.taskDetails,
        taskOwner:owner.id
    }
    let{taskTitle, taskTL, taskMembers, taskDetails, taskOwner}=data
    models.Task.create({
        taskTitle, taskTL, taskMembers, taskDetails, taskOwner
    })
    .then(data=>{
        res.json({Registered_email:verifiedEmails, Email_not_registered:errors1, confirmation:data})
    })
    .catch(e=>console.log(e.message))
}

module.exports = controller;