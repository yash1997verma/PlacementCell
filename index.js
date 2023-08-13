const express = require('express');
const app = express();
const PORT = 8000;

//passport local
const passport = require('passport');
const passortLocal = require('./config/passport-local-strategy');
//for storing passport encrypted id in cookies
const session = require('express-session');
const MongoStore  = require('connect-mongo');
//for flash messages
const flash = require('connect-flash');
const flashMware = require('./config/flashMiddleware');
//dot env
require('dotenv').config();





//using mongoDB
const db = require('./config/mongoose');

//middlewares
app.use('/assets', express.static('assets'));//Serve static files from the "public" directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'Placement Cell',
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,//when the user is not logged in dont save data
    resave: false,//when the cookie already exist, no resave
    cookie: {
        maxAge: (1000*60*100)
    },
  
    //for mongostore
    store: MongoStore.create(
        {
        mongoUrl:process.env.MONGO_URL,
        autoRemove:'disabled'
    },
    function(err){
        console.log(err|| "Connect-mongo setup ok");
    })
}));
//using passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);



//using flash messages
app.use(flash());
app.use(flashMware.setFlash);

//use express router
app.use('/' , require('./routes/index'));


app.listen(PORT, (err)=>{
    if(err) console.log(`error in starting the server ${err}`);

    console.log(`Server started on port : ${PORT}`);
});