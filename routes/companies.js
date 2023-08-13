const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

router.get('/',companyController.companiesPage);
router.get('/companyform', companyController.companyForm)
//add new company
router.post('/addnewcompany', companyController.addNewCompany);
//delte company
router.get('/delete/:id', companyController.deleteCompany);
//single company page
router.get('/singleCompanyPage/:id', companyController.companyPage)
//schedule new interview page
router.get('/interviewform/:id',companyController.addNewInterview);
//schedule interview
router.post('/scheduleInterview/:id',companyController.scheduleInterview);
//change interview status
router.put('/updateResult/:id', companyController.updateResult);
//delete interview
router.get('/deleteInterview/:id',companyController.deleteInterview)


module.exports = router;