const mongoose = require('mongoose');

//  creating the schema 
const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
});

// setting up User Schema
const User = mongoose.model('User', userSchema);

// exporting the User Schema
module.exports = User;
