const mongoose = require('mongoose');

const studentSchema =  new mongoose.Schema({
    batch:{
        type: String, 
        requried: true,
    },
    college:{
        type: String,
    },
    name:{
        type: String, 
        requried: true,
    },
    email:{
        type: String, 
        requried: true,
        unique:true
    },
    contact:{
        type: Number,
    },
    score: {
        type: {
            dsa: { type: Number, required: true },
            fe: { type: Number, required: true },
            node: { type: Number, required: true },
            react: { type: Number, required: true }
        },
        required: true
    },
    status:{
        type: String, 
        // enum: ['On Hold', 'Placed', 'Pending', 'Not Placed', 'Did not Attempt'],
        requried: true,
    },
    //list of all interviews scheduled for the student, for diff companies
    interviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'interview'
        }
    ]
});


const student = mongoose.model('student', studentSchema);

module.exports  = student;