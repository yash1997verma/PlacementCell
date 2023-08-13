const express = require('express');
const router = express.Router();
const passport = require('passport');
const Interview = require('../models/interview');

//userController
const userController = require('../controllers/userController');

router.get('/', userController.home);
//sign In
router.get('/signInPage', userController.signInPage);
router.post('/signIn', passport.authenticate(
    'local',
    {failureRedirect:'/signInPage'}
    ),userController.signIn);
//sign Up
router.get('/signUpPage', userController.signUpPage);
router.post('/signUp', userController.signUp);
//sign out
router.get('/signOut',passport.checkAuthentication, userController.signOut);
    
//studentlist
router.use('/studentList',passport.checkAuthentication, require('./studentList.js') )

//all interviews page
router.get('/allInterviews',passport.checkAuthentication, async(req,res)=>{
    const interviewList = await Interview.find({})
    .populate('company')
    .populate('student');
    // console.log(interviewList)
    res.render('interviewsPage',{
        title:'All Interviews',
        Interviews: interviewList,
    })
});

//download report
router.get('/downloadReport',passport.checkAuthentication, userController.downloadReport);

//companies
router.use('/companies',passport.checkAuthentication, require('./companies.js'));
module.exports = router;