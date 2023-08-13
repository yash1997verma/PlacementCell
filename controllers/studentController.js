const Student = require('../models/student');
const Interview = require('../models/interview');

module.exports.studentList = async(req,res)=>{
    const students = await Student.find({});
    res.render('studentList',{
        title: "Placement Cell",
        students: students,
    });
}
//add student page
module.exports.addStudentForm = async(req, res)=>{
    res.render('addStudentForm', {
        title: 'Student Form'
    })
}

//submit add student form
module.exports.addStudent = async(req, res)=>{
   try{
    const{batch,college,name,email,contact,dsa,fe,node,react,status } = req.body;
    //if student already exist with same id
    const existingStudent = await Student.findOne({ email: email });
    if(existingStudent){
        req.flash('error', 'Student already exist');
        return res.redirect('/studentList/addStudentForm');
    }

    //create a new student
    const newStudent = await Student.create({
        batch,
        college,
        name,
        email,
        contact,
        score: {
            fe,
            dsa,
            node,
            react
        },
        status,
    });

    if(newStudent){
        req.flash('success', 'Student added');
        return res.redirect('/studentList')
    }
   }catch(err){
    console.log(`error occured while adding student ${err}`);
    req.flash('error', 'Error occured, try again');
    return res.redirect('back')
   }
    
    
}

//update status
module.exports.updateStatus = async(req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        const student = await Student.findById(id);
        student.status = status;
        await student.save();
        res.status(200);
    }catch(err){
        console.log(`error occured while adding student ${err}`);
        req.flash('error', 'Error occured, try again');
        return res.redirect('back')
    }   
}

//delete student
module.exports.deleteStudent = async (req,res)=>{
    //delete interview associated with student, clear ref to these interviews from all companies
    try{
        const studentId = req.params.id;
        const student  = await Student.findById(studentId)
        .populate({
            path: 'interviews',
            populate: [
                { path: 'student'},
                { path: 'company'}
            ]
        });
        for (const interview of student.interviews) {
                const id = interview._id.toString(); // Convert ObjectId to string
                
                // Update references in company's interviews array
                if (interview.company) {
                    interview.company.interviews = interview.company.interviews.filter(
                        interviewId => interviewId.toString() !== id
                    );
                    await interview.company.save();
                }
        
                // delete interview
                await Interview.deleteOne(interview);
            }
        await Student.deleteOne(student);


        res.redirect('back');
      


    }catch(err){
    console.log(`error occured while deleting student ${err}`);
    req.flash('error', 'Error occured, try again');
    return res.redirect('back')
   }
}

