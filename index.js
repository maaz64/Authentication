const express = require('express');
const app = express();
const session = require("express-session");
const flash = require('connect-flash');
const flashMiddleware = require('./Config/flash_middleware');
const MongoDBStore = require('connect-mongodb-session')(session);
const db = require('./Config/mongoose');
require('dotenv').config();
const MongoUrl = process.env.MongoUrl;

const Port = 3000;

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.urlencoded({extended:true}));

const store = new MongoDBStore({
    uri: MongoUrl,
    collection: 'mySessions'
  });

app.use(session({
  secret: 'somethingsomething',
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:(1000*60*60*24)
  },
  store:store,
}))

app.use(flash());
app.use(flashMiddleware.setFlash);

app.use('/',require('./routes/index.js'));

app.listen(Port,(err)=>{
    if(err){
        console.log("Error occured while running the server");
    }
    console.log(`Server is up and running on port ${Port}`);
})