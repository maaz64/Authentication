// middleware to check if the user is authorised or not
const session = require('express-session');


module.exports =  (req,res,next)=>
{
    if(req.session.isAuth)
    {
        next();
    }
    else{
     return res.redirect('/login');
    }
}
