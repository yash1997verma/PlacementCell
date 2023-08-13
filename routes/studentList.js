const express = require('express');
const router = express.Router();

//studentController
const studentController = require('../controllers/studentController');
router.get('/', studentController.studentList );

//add student
router.get('/addStudentForm', studentController.addStudentForm);
router.post('/addStudent', studentController.addStudent);
//delete student
router.get('/deleteStudent/:id', studentController.deleteStudent);
//update status
router.put('/updateStatus/:id', studentController.updateStatus);

module.exports = router;