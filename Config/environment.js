const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access .log", {
    // size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    path:logDirectory,
    // compress: "gzip" // compress rotated files
  })


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

module.exports = eval((process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV));