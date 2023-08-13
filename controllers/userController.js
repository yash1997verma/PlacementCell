const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//for downloading report
const Interview = require('../models/interview');
const fs = require('fs');
const fastcsv = require('fast-csv');
//home page
module.exports.home = async(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/studentList');
    }
    res.render('home',{
        title: 'Placement Cell'
    });
}

//signUpPage
module.exports.signUpPage = async(req,res)=>{
     //if the user is already signed in, redirect back
    if(req.isAuthenticated()){
        return res.redirect('/studentList');
    }
    res.render('signUpPage',{
        title: "Sign Up"
    })
}
module.exports.signUp = async(req,res)=>{
    const {name, email, password, confirmPassword} = req.body;
    if(password !==confirmPassword){
        req.flash('error', 'Passwords do not match');
        console.log('password dont match')
        return res.redirect('back');
    }
    //find user
    const user = await User.findOne({email: email});
    if(user){
        console.log('user already exist');
        req.flash('error', 'User already exist, try a different email');
        return res.redirect('back');
    }
    //if user, does not exist, create user
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = await User.create({
        name,
        email, 
        password: hashPassword

    });
    
   
    if(newUser){ 
        req.flash('success', 'User created successfully');
        return res.redirect('/signInPage');
    }
     
}

//signInPage
module.exports.signInPage = async(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/studentList');
    }
    
    res.render('signInPage',{
        title:'Sign In'
    });
}
module.exports.signIn = async(req,res)=>{
    
    req.flash('success', 'Signed In Successfully');

    res.redirect('/studentList');
}

//for signOut
module.exports.signOut = async (req, res)=>{
    req.flash('success','Signed out successfully');
    //given by passport
    req.logout(function(err){if(err){console.log(err)}});
    res.redirect('/');
}


// dsa: { type: Number, required: true },
//             fe: { type: Number, required: true },
//             node: { type: Number, required: true },
//             react:

//download report
module.exports.downloadReport = async(req,res)=>{
    try{
        const interviews = await Interview.find({})
        .populate('student').populate('company');

        let data = '';
		let no = 1;
        let csv = 'No., Batch, Name, Email, College, Contact, Placement Status, DSA, FE, NODE, REACT, Company, Date, Time Of Interview, Interview Result';
        for (let no = 1; no <= interviews.length; no++) {
            const interview = interviews[no - 1];
            const data =
                no + ',' +
                interview.student.batch +
                ',' +
                interview.student.name +
                ',' +
                interview.student.email +
                ',' +
                interview.student.college +
                ',' +
                interview.student.contact +
                ',' +
                interview.student.status +
                ',' +
                interview.student.score.dsa +
                ',' +
                interview.student.score.fe +
                ',' +
                interview.student.score.node +
                ',' +
                interview.student.score.react +
                ',' +
                interview.company.company +
                ',' +
                interview.company.driveDate.toLocaleDateString() +
                ',' +
                interview.timeOfInterview +
                ',' +
                interview.result;
            csv += '\n' + data;
                
                
        }
        const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
            if (error) {
                console.log(error);
                return res.redirect('back');
            }
            console.log('Report generated successfully');
            return res.download('report/data.csv');
        });
    }catch (error) {
		console.log(`Error in downloading file: ${error}`);
        req.flash('error','Error occures, try again');
        return res.redirect('back');
        
	}
}