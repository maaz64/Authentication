const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../Models/user');


// authenticating the user using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true,
    },
    async function(req,email,password,done)
    {
        const user = await User.findOne({email});
        if(!user)
        {
            req.flash('error',"User not found");
            return done(null,false);
        }

        const isPassMatch = await bcrypt.compare(password,user.password);
        if(!isPassMatch)
        {
            // console.log("Invalid User/Password");
            req.flash('error',"Invalid Email/Password");
            return done(null,false);
        }
        else{
            return done(null,user);
        }


        // User.findOne({email:email}).then((user)=>
        // {
        //     // console.log("user password",user.password);
            
        //     const isPassMatch = bcrypt.compare(password,user.password);
        //     if(!isPassMatch)
        //     {
        //         console.log("Invalid User/Password");
        //         req.flash('error',"Invalid Email/Password");
        //         return done(null,false);
        //     }
        //     else{
        //         return done(null,user);
        //     }

        // }).catch((err)=>{
        //     console.log('Error in finding the user in passort.js');
        //     req.flash('error',"User not found");

        //     return done(null,false);
        // });
    }   
));


// serializing the user to decide which key is to be kept in cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
});


// deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done)
{
    User.findById(id).then((user)=>{
        return done(null,user);
    }).catch((err)=>{
        console.log('Error in deserializing the user',err);
    })
});

passport.checkAuthentication = function(req,res,next)
{
    // check if the user is Authenticated or not 
    if(req.isAuthenticated())
    {
        return next();
    }

    return res.redirect('/login');
}

passport.setAuthenticatedUser = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        // req.user contain the current signed in user from the session cookie so we are just sending it to the response of locals for views to be printed on profile page 
        res.locals.user = req.user;   // because we use user model that why it is store in req as user
    }
    next();
}


module.exports = passport;
