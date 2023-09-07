const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const generator = require('generate-password');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
        try{
            const user =await  User.findOne({ email: profile.emails[0].value })
            console.log("profile ", profile);
            if(user){
                return done(null,user);
            }
            else{
                // create user with password
                const password = await hashedPassword();
                console.log("This is encrypted password :",password);
                const createduser =await User.create({
                    username:profile.displayName,
                    email: profile.emails[0].value,
                    password,
                })

                if(createduser)
                {
                    return done(null,createduser);
                }
            }
        }
        catch(error){
                console.log("Error in googleStrategy",error);
                return done(error, false);
        }

    }
));

const hashedPassword = async()=>{
    let password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log('This is generatedpassword', password);
    let encrypted = await bcrypt.hash(password,12);
    return encrypted;
}