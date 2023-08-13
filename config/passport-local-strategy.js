const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

passport.use( new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    
    async function(req, email, password,done){
        try{
            //find user
            const user = await User.findOne({email:email});
            if(!user) return done(null, false);//user not signIn
            //verify passwrod
            if(bcrypt.compare(password, user.password)){
                return done(null , user);
            }

            
        }catch(err){
            console.log(`error in passport local strategy ${err}`);
            return done(err);
        }
        
    }
));

//serialize user
passport.serializeUser(function(user, done){
    done(null, user.id);
});
//deserialize user
passport.deserializeUser( async function(id, done){
    try{
     const user = await User.findById(id);
     return done(null, user);
 
    }catch(err){
     console.log(`error in finding the user ${err}`);
     return done(err);
    }
});

//check req user sign in or not 
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

//set user in locals for views
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

module.exports = passport;