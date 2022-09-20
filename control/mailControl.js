const mail = require("../model/mailModel");
const mailsent = require("../model/mailSent");
const nodemailer = require("nodemailer");

//create new mail  
const store = (req,res,next) => {
    console.log(req.body)
       
       if(req.body.Time != null){
        let newmail = new mail({
            Email: req.body.Email,
            Subject: req.body.Subject,
            Message: req.body.Message,
            Time: req.body.Time
       });
        newmail.save()
        .then(user =>{
            
            res.status(200).json({
                message: user
            })
        })
        .catch(err => {
            res.status(501).json({
                message:"An Error occured!"
            })
        })
       }
       else{
          mailElement(req.body).then((x) => {
            if(x == "error") {
                res.status(501).json({
                    message:"An Error occured!"
                })
             }
             else{
                res.status(200).json({
                    message: x
                })
             }
          })
       }
}


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


   const mailElement = async  (element) => {
    let  mailOptions = {
      from: 'yashsm01@gmail.com',
      to : element.Email,
      subject:  element.Subject,
      text: element.Message
  };
  
    transporter.sendMail(mailOptions ).then(async (res) => {
      console.log("email " + res.response )
      let sent = new mailsent({
        Email: element.Email,
        Subject: element.Subject,
        Message: element.Message,
        Time: element.Time
        });
        console.log(sent,"63")
        let x = await sent.save()
        .then(async (user) =>{
            console.log(user,"66")
            return user;
        })
        .catch(err => {
            return "error";
        })
        return x;
      
    }).catch(err => {
        console.log(err);
    });
  }

   const getList = (req,res,next) => {
    mail.find({})
    .then((response) => {
        res.status(200).json({
            message:"successfully get mail... ",
            response
        })
    })
    .catch(err => {
        res.status(501).json({
            message:"An Error occured!"
        })
    })
}

const getfilter = (req,res,next) => {
    mail.find({
        Time: {
            $gte: req.body.start, 
            $lt: req.body.end
        }
    })
    .then((response) => {
        res.status(200).json({
            message:"successfully get mail... ",
            response
        })
    })
    .catch(err => {
        res.status(501).json({
            message:"An Error occured!"
        })
    })
}


const destroy = (id) => {
    mail.deleteMany({_id:id})
    .then(user =>{
        // res.status(200).json({
        //     message:"Delete Successfully",
        //     user: user
        // })
    })
    .catch(err => {
        // res.status(501).json({
        //     message:"An Error occured!"
        // })
    })
}

   module.exports = {store,getList,getfilter,destroy}