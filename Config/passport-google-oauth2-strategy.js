const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const generator = require('generate-password');
const User = require('../Models/user');
const bcrypt = require('bcrypt');
const env = require('./environment');

passport.use(new googleStrategy({
    clientID: env.client_id,
    clientSecret: env.client_secret,
    callbackURL: env.call_back_url,
  },
  async function(accessToken, refreshToken, profile, done) {
        try{
            const user =await  User.findOne({ email: profile.emails[0].value })
            if(user){
                return done(null,user);
            }
            else{
                // create user with password
                const password = await hashedPassword();
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
                return done(error, false);
        }

    }
));

// creating encrypted password using genrate-password and bcrypt library
const hashedPassword = async()=>{
    let password = generator.generate({
        length: 10,
        numbers: true
    });
    let encryptedPassword = await bcrypt.hash(password,12);
    return encryptedPassword;
}