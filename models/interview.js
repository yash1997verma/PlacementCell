const mongoose = require('mongoose');
//one interview will be related to one company,
//and one student only
//both company and student will have ref to interview
//student will store interviews of diff companies
//company will store interview of diff students
//since it has info about both
const interviewSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student', 
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    timeOfInterview:{
        type: String,
        require:true,
    },
    result:{
        type: String,
        enum: ['Pass', 'Fail', 'On Hold', 'Did not attempt']
    }


});

const interview = mongoose.model('interview', interviewSchema);
module.exports = interview;
