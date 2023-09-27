// importing required modules 
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


// creating directory to store the production logs
const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// creating log stream for 1 day interval 
const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", 
    path:logDirectory,

  })


//   creating development environments
const development = {
    name:'development',
    assets_path : process.env.ASSETS_PATH,
    session_cookie_secret : process.env.SESSION_COOKIE_SECRET,
    mongo_url : process.env.MONGO_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    call_back_url: process.env.GOOGLE_CLIENT_CALLBACK_URL,
    morgan:{
        mode:'dev',
        options:{stream:accessLogStream}
    }
}

// creating production environment
const production = {
    name:'production',
    assets_path : process.env.ASSETS_PATH,
    session_cookie_secret : process.env.SESSION_COOKIE_SECRET,
    mongo_url : process.env.MONGO_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    call_back_url: process.env.GOOGLE_CLIENT_CALLBACK_URL,
    morgan:{
        mode:'combined',
        options:{stream:accessLogStream}
    }
}

// setting the environment according to the NODE_ENV value
module.exports = eval((process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV));