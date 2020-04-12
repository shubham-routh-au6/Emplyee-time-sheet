const TaskSubmitted = require('../models/Tasksubmitted');
const User = require('../models/User');
const Task = require('../models/Task');
const datauri = require("../utilities/bufferToString");


const controller ={};

controller.submitTask = async (req, res)=>{
    //console.log(req.body, 'req.body at submitReportImage 1')
    
    try {
        const user = req.user
        console.log(user)
        // let {user} = req.body
        let {taskId} = req.params
      
        //console.log(req.file, "req.file")
      
        let {
            originalname,
            buffer
        } = req.file


        const cloudinary = require("../config/cloudinaryConfig")

        cloudinary.uploader.upload(datauri(originalname, buffer))
        .then(async response => {

            console.log(response, "response from cloudinary uploader")
            

            // DailyTasksList = await funcDailyTasks(user.email)
            
            // await DailyTasksList.findOneAndUpdate({
            //     date: todayDate,
                
            // },{
            //      $push: {"tasks.$[task].report": response.secure_url}
            // },{
            //     arrayFilters: [{"task._id": taskId}],
            //     new: true
            // })

            // const result = await
            console.log(req.file)
            const data = {
                taskId:user.id,
                taskMembers:user.taskMembers,
                taskCompleted:true,
                reportUrl:response.secure_url
            }
            let{taskId, taskMembers, taskCompleted, reportUrl} = data

            const savedFile = await TaskSubmitted.create({
                taskId, taskMembers, taskCompleted, reportUrl
            })
            res.json({message:savedFile})
            
            
            // next()


        })
        .catch(reject => console.log(reject))
    
    } catch(err) {
        console.log(err.message)
    }
    // const user = req.user
    // console.log(user)

}


module.exports = controller;