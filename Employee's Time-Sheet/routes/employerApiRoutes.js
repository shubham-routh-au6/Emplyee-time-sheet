const express = require('express');
const controller = require('../controller/employerApiCon');
const middleware = require('../middleware/employerAuth');
const router = express.Router();

// router.get('/employer_dashboard', middleware.authentication, controller.dashboardEmployer);
router.post('/assignTask', middleware.authentication, controller.postDashEmployer);

module.exports = router;