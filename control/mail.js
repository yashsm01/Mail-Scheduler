const nodemailer = require("nodemailer");
const cron = require('node-cron');
const mail = require("../model/mailModel");
const mailsent = require("../model/mailSent");
const mailcontrol = require("./mailControl");

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service:'gmail',
    port: 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'yashsm01@gmail.com', // generated ethereal user
      pass: 'xugwyhqfbqajxsun', // generated ethereal password
    },
  });

  const mails = () => {
    let d1 = new Date ()
    console.log(new Date(d1.getTime() + 1000*60*60*5+1000*60*30 ))
    mail.find({
      Time: {
          $lt: new Date(d1.getTime() + 1000*60*60*5+1000*60*30 ).toISOString()
      }
  })
  .then((response) => {
      console.log(response.length)
      if(response.length == 0) {console.log("no Data"); return };
      response.forEach(async (element) => {
        console.log(element)
       await mailElement(element)
      });
    
  })
  .catch(err => {
      res.status(501).json({
          message:"An Error occured!"
      })
  })
  
  
  };

  const mailElement = (element) => {
    let  mailOptions = {
      from: 'yashsm01@gmail.com',
      to : element.Email,
      subject:  element.Subject,
      text: element.Message
  };
  
    transporter.sendMail(mailOptions ).then((res) => {
      console.log("email " + res.response )
      let sent = new mailsent({
        Email: element.Email,
        Subject: element.Subject,
        Message: element.Message,
        Time: element.Time
        });
        sent.save()
        .then(user =>{
         console.log("done")
        })
        .catch(err => {
            console.log("error")
        })
      mailcontrol.destroy(element._id);
      
    }).catch(err => {
        console.log(err);
    });
  }
module.exports = {mails};
 