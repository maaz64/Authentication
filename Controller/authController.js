// importing required files and modules
const session = require("express-session");
const User = require('../Models/user');
const passport = require('passport');
const passportLocal = require('../Config/passport-local-strategy');
const bcrypt = require('bcrypt');

// function to render the page page
module.exports.Profile = (req,res)=>
{
    if(req.isAuthenticated()){

        return res.render('profile',{
         title: 'Auhentication | Profile'
        });
    }
    return res.redirect('/login');
}

// function to render the page page
module.exports.Home = (req,res)=>
{
    const isAuth = req.isAuthenticated();
    return res.render('home',{
        isAuth,
        title: 'Auhentication | Home'
    });
}


// function to render the Register page
module.exports.Register = (req,res)=>
{
    if(req.isAuthenticated())
    {
        return res.redirect('/profile');
    }
    return res.render('register',{
        title: 'Auhentication | Sign Up'
    });
}

// function to render the login page
module.exports.Login = (req,res)=>
{
    if(req.isAuthenticated())
    {
        return res.redirect('/profile');
    }
    res.render('login',{
        title: 'Auhentication | Login'
    });
}

// this function will create the user in database when user signup
module.exports.createUser =async (req,res)=>{

    // destructuring the user input from registration page form using req.body
    const{username,email,password,confirm_password}=req.body;

    // compairirng the password and confirm password and if it doesn't match then return back to the same page
    if(password != confirm_password)
    {
        req.flash('error',"Password doesn't match");

        return res.redirect('/register');
    }

    // checking if user already existed or not 
    const user = await User.findOne({email});
    if(user)
    {
        req.flash('error',"User already existed");
        return res.redirect('/login');
    }

    // encrypting the user password to save the encrypted password in database
    const hashedPassword = await bcrypt.hash(password,12);

    // creating the user in database
    const userCreated = await User.create({
        username,
        email,
        password:hashedPassword
    })

    // showing notification when user is is succesfully registerd
    req.flash('success',"Registerd succesfully");

    // redirectng to the login page after the registration is successfull
    return res.redirect('/login');

}

// function to handle user sign in
module.exports.userLogin = async(req,res)=>{
    req.flash('success','Signed in successfully');
    return res.redirect('/profile');

}

// function to handle user logout
module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err)
        }
        req.flash('success','You have logged out');
        return res.redirect('/');
    });
}

// this function will render the reset password page
module.exports.resetPasswordPage = (req,res)=>
{
    if(req.isAuthenticated()){

        return res.render('reset_password',{
         title: 'Auhentication | Reset Password'
        });
    }
    return res.redirect('/login');
}

// function to update the password
module.exports.changePassword= async(req,res)=>{
    
    // destructuring the user input from reset password page using req.body
    const{email,password,confirm_password}=req.body;

    // compairirng the password and confirm password and if it doesn't match then return back to the same page
    if(password != confirm_password)
    {
        req.flash('error',"Password doesn't match");

        return res.redirect('/reset-password');
    }

    // encrypting the password using bcrypt library 
    const hashedPassword = await bcrypt.hash(password,12);
 
    // updating the password
    const updatedUser = await User.findOneAndUpdate({email},{password:hashedPassword});

    // if updation is not successfull then return back to the same page
    if(!updatedUser)
    {
        req.flash('error',"Something went wrong");
        return res.redirect('/reset-password');
    }
    
    // showing notification when reset password is succesfull
    req.flash('success',"Password updated successfully");

    // if updation is successfull then redirect to the user profile page
    return res.redirect('/profile');

}