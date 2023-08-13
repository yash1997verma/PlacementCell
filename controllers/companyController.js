const Company = require('../models/company');
const Student = require('../models/student');
const Interview = require('../models/interview');

module.exports.companiesPage = async(req,res)=>{
    const companies = await Company.find({});
    res.render('companiesPage', {
        title:'Companies',
        companies:companies,
    })
}

module.exports.companyForm = async(req,res)=>{
    
    res.render('companyForm',{
        title:'Add Company',
        
    });
}

module.exports.addNewCompany = async(req,res)=>{
   try{
    const {driveDate, company, role, noOfVacancy} = req.body;
    //if company already exist
    const existingCompany = await Company.findOne({company:company});
    if(existingCompany){
        //check if the the interview is on same date
        req.flash('error', 'Company already exist');
        return res.redirect('/companies/companyform')
    }
    //creact company interview
    const newCompany = await Company.create({
        driveDate:driveDate,
        company:company,
        role: role,
        noOfVacancy: noOfVacancy,
    });
    if(newCompany){
        req.flash('success', 'Company added');
        res.redirect('/companies');
    }
   }catch(err){
    console.log(`err in adding company ${err}`);
   }
}


//delete company
module.exports.deleteCompany = async (req,res)=>{
    try{
        const companyId = req.params.id;
        //find company and interviews associated with it
        const company = await Company.findById(companyId)
        .populate({
          path: 'interviews',
          populate: [
            { path: 'student'},
            { path: 'company'}
          ]
        })
        .exec();    
        // Delete each interview associated with the company
        for (const interview of company.interviews) {
            const id = interview._id.toString(); // Convert ObjectId to string
            console.log(id);
            console.log(interview);

            //update reference in studentes interview
            if (interview.student) {
                interview.student.interviews = interview.student.interviews.filter(
                    interviewId => interviewId.toString() !== id
                );
                await interview.student.save();
            }
            
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
        
        //delete the company
        await Company.deleteOne({ _id: companyId }); 
        return res.redirect('back');

    }catch(err){
        console.log(`err in deleting company ${err}`);
    }
}

//single company page
module.exports.companyPage = async(req,res)=>{
    try{
        const {id} = req.params;
        // find company
        const company = await Company.findById(id)
        .populate({
            path: 'interviews',
            populate: {
                path: 'student', 
            },
            
        });
    //    console.log(company.interviews)
        

        //if company does not exist
        if(!company){
            req.flash('error','Company does not exist');
            res.redirect('/companies')
        }
        if(company){            
            res.render('companyPage',{
                title: 'Single company page',
                company: company,
            });
        }
    }catch(err){
        console.log(`error in loading single company page${err}`);
    }
}

//schedule interview for this company page
module.exports.addNewInterview = async(req,res)=>{
    try{
        const {id} = req.params;

        return res.render('addInterviewForm',{
            title: 'Add Interview',
            companyid: id,
        })
    }catch(err){
        console.log(`error in loading scheduling interview page ${err}`);
    }
}

//we will create a new interview for the company with student details
//every interview will have the reference to company and 
module.exports.scheduleInterview = async (req,res)=>{
    try{
        const {email, name, time} = req.body;
        const {id} = req.params;
        //find the company
        const company = await Company.findById(id);
        
        //find details of interview candidate
        const interviewCandidate = await Student.findOne({email:email});
        //candidate is not in the student list
        if(!interviewCandidate){
            req.flash('error', 'Candidate does not exist');
            return res.redirect(`/companies/interviewform/${id}`);
        }

        //else create a new interview
        if(interviewCandidate){
            // creating a new interview
            const newInterview = await Interview.create({
                company: company._id,
                student: interviewCandidate._id,
                date: company.driveDate,
                timeOfInterview: time,
                result: 'On Hold',
            })
            // Update the company's interviews array
            company.interviews.push(newInterview._id);
            await company.save();

            // Update the student's interviews array
            interviewCandidate.interviews.push(newInterview._id);
            await interviewCandidate.save();

            req.flash('success', 'Interview scheduled successfully');
            return res.redirect(`/companies/singleCompanyPage/${id}`);
        }
    }catch(err){
        console.log(`error in scheduling interview ${err}`);
    }
}
//Update result property of interview
module.exports.updateResult = async (req,res)=>{
    try{
        //get interview id
        const {id} = req.params;
        const {result} = req.body;
      
        
        // find interview and update
        const updatedInterview = await Interview.findById(id).populate('student').populate('company');
       
        // Update result property of the interview
        updatedInterview.result = result;
        await updatedInterview.save();

        res.status(200);
    }catch(err){
        console.log(`error in updating result of interview ${err}`);
    }
}


//delete a interview
module.exports.deleteInterview = async(req,res)=>{
    try{
        //get interview id
        const {id} = req.params;
        const interview = await Interview.findById(id).populate('student').populate('company');
      
        //update reference in studentes interview
        if (interview.student) {
            interview.student.interviews = interview.student.interviews.filter(
                interviewId => interviewId.toString() !== id
            );
            await interview.student.save();
        }
        
        // Update references in company's interviews array
        if (interview.company) {
            interview.company.interviews = interview.company.interviews.filter(
                interviewId => interviewId.toString() !== id
            );
            await interview.company.save();
        }

        //delete interview
        await Interview.deleteOne(interview);
        
        res.redirect('back');
    }catch(err){
        console.log(`error in deleting interview ${err}`);
    }

}

