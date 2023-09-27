//  setting up the cloud mongodb database
const mongoose = require('mongoose');
const env = require('./environment');
const MongoUrl = env.mongo_url;

mongoose.connect(MongoUrl).then(()=>{
    console.log('Connected to database successfully');
}).catch((err)=>{
    console.log('Error in connecting to database',err);
});