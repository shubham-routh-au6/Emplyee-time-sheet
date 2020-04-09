const express = require('express');
const controller = require('../controller/employeeApiCon');
const middleware = require('../middleware/employeeAuth');
const {multerUpload} = require('../middleware/multerUpload')

const router = express.Router();

//router.get('/employee_dashboard', middleware.authentication, controller.dashboardEmployee);
router.post('/submitTask', middleware.authentication,multerUpload.single('reportUrl'), controller.submitTask);

module.exports = router;