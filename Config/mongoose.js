const mongoose = require('mongoose');
require('dotenv').config()
const MongoUrl = process.env.MongoUrl;

mongoose.connect(MongoUrl).then(()=>{
    console.log('Connecte to database successfully');
}).catch((err)=>{
    console.log('Error in connecting to database',err);
});