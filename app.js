const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const app = express();
const getmail = require("./control/mail");
const route = require("./routers/mapRoute");

//make Connection with mongodb 
mongoose
  .connect(
    "mongodb+srv://user2:Qaswedfr123@cluster0.q7fla.mongodb.net/myDB?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });


app.use(bodyParser.json());//To allow To parse requested body from frontend
app.use(bodyParser.urlencoded({extended:false}));
app.use('/middleware/images',express.static('middleware/images')); //alllow To get stored img in server
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(  
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials","true");
    next();
  });

  app.use("/api",route);
  cron.schedule('*/10 * * * * *', () => {
    getmail.mails();
 })


//   app.use("/api",AuthRouter);//login Registor Routes
//   app.use("/api/master",ProductMasterRouter);//Product MAster Routes
//   app.use("/api/codes",ProductCodesRouter);//Product Codes Routes

  module.exports = app;