const express = require('express');
const middleware = require('../middleware/userAuth');
const controller = require('../controller/userNormalCon');
const router = express.Router();


router.post('/signup', controller.signUp);
router.get('/employerConfirmation/:token',controller.employerConfirmation);
router.post('/signin', controller.signin);
router.delete('/signout',middleware.authentication, controller.signOut)
router.get('/employeeConfirmation/:token',controller.employeeConfirmation);
router.get('/employerApproval/:token',controller.employerApproval);
router.get('/rejectEmployee/:token', controller.rejectEmployee);
// router.post('/add', controller.addToCemployee);

module.exports = router;

