const session = require("express-session");
const User = require('../Models/user');
const passport = require('passport');
const passportLocal = require('../Config/passport-local-strategy');
const bcrypt = require('bcrypt');

module.exports.Profile = (req,res)=>
{
    if(req.isAuthenticated()){

        return res.render('profile',{
         title: 'Auhentication | Profile'
        });
    }
    return res.redirect('/login');
}
module.exports.Home = (req,res)=>
{
    // const isAuth = req.session.isAuth;
    const isAuth = req.isAuthenticated();
    return res.render('home',{
        isAuth,
        title: 'Auhentication | Home'
    });
}



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

module.exports.createUser =async (req,res)=>{

    const{username,email,password,confirm_password}=req.body;

    if(password != confirm_password)
    {
        req.flash('error',"Password doesn't match");

        return res.redirect('/register');
    }

    const user = await User.findOne({email});
    if(user)
    {
        req.flash('error',"User already existed");
        return res.redirect('/login');
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const userCreated = await User.create({
        username,
        email,
        password:hashedPassword
    })
    req.flash('success',"Registerd");
    return res.redirect('/login');

}

module.exports.userLogin = async(req,res)=>{
    req.flash('success','Signed in successfully');
    return res.redirect('/profile');

}

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


module.exports.resetPasswordPage = (req,res)=>
{
    if(req.isAuthenticated()){

        return res.render('reset_password',{
         title: 'Auhentication | Reset Password'
        });
    }
    return res.redirect('/login');
}

module.exports.changePassword= async(req,res)=>{
    
    const{email,password,confirm_password}=req.body;

    if(password != confirm_password)
    {
        req.flash('error',"Password doesn't match");

        return res.redirect('/reset-password');
    }
    // const user = await User.findOne({email});
    const hashedPassword = await bcrypt.hash(password,12);
    // const updatedUser = await User.findByIdAndUpdate(user._id,{
    //     username:user.username,
    //     email,
    //     password:hashedPassword
    // })

    const updatedUser = await User.findOneAndUpdate({email},{password:hashedPassword});

    if(!updatedUser)
    {
        req.flash('error',"Something went wrong");
        return res.redirect('/reset-password');
    }

    req.flash('success',"Password updated successfully");
    return res.redirect('/profile');

}