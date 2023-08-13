const mongoose = require('mongoose');
require('dotenv').config();
(async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);

        console.log(`connected to DB`)
    }catch(err){
        console.log(`error in connectin to DB ${err}`);
    }
})();



