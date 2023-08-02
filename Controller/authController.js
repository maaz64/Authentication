const session = require("express-session");
const User = require('../Models/user');
const bcrypt = require('bcrypt');

module.exports.Profile = (req,res)=>
{
   return res.render('profile');
}
module.exports.Home = (req,res)=>
{
    const isAuth = req.session.isAuth;
    return res.render('home',{
        isAuth
    });
}



module.exports.Register = (req,res)=>
{
    if(req.session.isAuth)
    {
        return res.redirect('/');
    }
    return res.render('register');
}

module.exports.Login = (req,res)=>
{
    if(req.session.isAuth)
    {
        return res.redirect('/');
    }
    res.render('login');
}

module.exports.createUser =async (req,res)=>{

    const{username,email,password,confirm_password}=req.body;

    if(password != confirm_password)
    {
        // req.session.error = "";
        req.flash('error',"Password doesn't match");
        // res.session.error =  "Password doesn't match"
        return res.redirect('/register');
    }

    const user = await User.findOne({email});
    if(user)
    {
        // res.session.error = "User already existed";
        return res.redirect('/login');
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const userCreated = await User.create({
        username,
        email,
        password:hashedPassword
    })

    return res.redirect('/login');

}

module.exports.userLogin = async(req,res)=>{

    const{email,password}=req.body;
    const user = await User.findOne({email});

    if(!user)
    {
        // req.session.error = ;
        req.flash('error',"Invalid User/Password");
        console.log('User not found');
        return res.redirect('back');
    }  

    const isPassMatch = await bcrypt.compare(password,user.password);
    if(!isPassMatch)
    {
        // req.session.error = "Invalid User/Password";
        req.flash('error',"Invalid User/Password");
        console.log('Invalid Password');
        return res.redirect('back');
        
    }
    req.session.isAuth = true;
    req.flash('success','Signed in successfully');
    return res.redirect('/profile');

}

module.exports.userLogout = (req,res)=>{
    req.flash('success',"You have logged out");
    req.session.destroy((err)=>{
        if(err)
        {
            throw err;
        }
        return res.redirect('/');
    })
}