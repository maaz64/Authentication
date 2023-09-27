// importing the required files and modules
const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const express = require('express');
const env = require('./Config/environment');
const logger = require('morgan');
const app = express();
const session = require("express-session");
const flash = require('connect-flash');
const flashMiddleware = require('./Config/flash_middleware');
const MongoDBStore = require('connect-mongodb-session')(session);
const PassportGoogle = require('./Config/passport-google-oauth2-strategy');
const passortLocal = require('./Config/passport-local-strategy');
const db = require('./Config/mongoose');
const expressEjsLayouts = require('express-ejs-layouts');
const passport = require('./Config/passport-local-strategy');
const MongoUrl = env.mongo_url;

const Port = process.env.Port || 3000;

// setting static file path
app.use(express.static(env.assets_path));

// using morgan to create production logs
app.use(logger(env.morgan.mode, env.morgan.options));

// setting up ejs layout
app.use(expressEjsLayouts);

// extracting stylesheets and scripts file from partials
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// parseing incoming requests with URL-encoded payloads
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// setting session store in database
const store = new MongoDBStore({
    uri: MongoUrl,
    collection: 'mySessions'
  });

// creating session and storing it
app.use(session({
  name:'Authentication',
  secret: env.session_cookie_secret,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:(1000*60*60)
  },
  store:store,
}))

// using flash to show notification
app.use(flash());

// using custom middleware to set the notification message
app.use(flashMiddleware.setFlash);

// initialising passport and setting session and authenticated user
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

// using routes
app.use('/',require('./routes/index.js'));

// setting view engine
app.set('view engine','ejs');

// setting views folder
app.set('views','./views');


// listening server
app.listen(Port,(err)=>{
    if(err){
        console.log("Error occured while running the server");
    }
    console.log(`Server is up and running on port ${Port}`);
})