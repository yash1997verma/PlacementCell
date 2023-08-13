const mongoose = require('mongoose');
//we can create a drive for any company and schedule 
//multiple interviews on that date for the company
const companySchema = new mongoose.Schema({
    driveDate:{
        type: Date,
        required: true,
    },
    company:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type:String,
    },
    role:{
        type: String,
        require:true,
    },
    noOfVacancy:{
        type:Number,
        required: true,
    },
   
    // ref to all the interviews for the company,
    // so that interview status can be changes
    interviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'interview'
        }
    ]
  
   
});

const company = mongoose.model('company', companySchema);
module.exports = company;