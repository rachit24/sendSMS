const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const accountSid = 'AC3102c433e040dc6973d58c6002e3c68a'; 
// const accountSid = process.env.ACCOUNT_SID; 
const authToken = '5f6c7c4029ce55d996ca0479c46598ff'; 
// const authToken = process.env.AUTH_TOKEN; 
const client = require('twilio')(accountSid, authToken); 
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const Value = require("./models/Value.js")

const app = express(); 
// app.use( express.static("public"))
var publicDir = require('path').join(__dirname,'/public'); 
app.use(express.static(publicDir)); 

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "config/config.env" });
}

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
    user: "ID",
    pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
  
app.get('/',async(req, res) => {
    const limit = await Value.findOne({ name: "limit2" });
    const val = limit.value_index;
    res.render('email', {
        limit: val,
    });
});
          
connectDB();
app.post('/verify',async(req,res)=>{
    try {
        ucode=req.body.gcode; 
        const num = await Value.findOne({ name: "code" });
        if(ucode==num.value_index){
            const final = await Value.updateOne(
                { name: "limit2" },
                { $set: { value_index: 0 } }
            );
            console.log("verified!");
            let randomNum = Math.floor(Math.random() * 90000);
            console.log(randomNum);        
            const some = await Value.updateOne(
                { name: "code" },
                { $set: { value_index: randomNum } }
            );
            res.render('popup', {
                comment: 'Code is verified. Welcome back babe!',
            });
        }else{
            console.log("Not verified!");            
            res.render('popup', {
                comment: 'Wrong Code! Try again!',
            });       
        }
        // res.redirect('/');
    } catch (error) {
        res.render('popup', {
            comment: 'BackEnd Error',
        });
        console.log(error);
        process.exit(1);
    }
});

app.post('/code',async (req,res)=>{
    try {
        let randomNum = Math.floor(Math.random() * 80000);
        console.log(randomNum);        
        const some = await Value.updateOne(
            { name: "code" },
            { $set: { value_index: randomNum } }
        );

        let messageOptions = {
            from: 'Rachit Khurana <>',
            to: '@gmail.com',
            subject: 'Code',
            html: `The code is: ${randomNum}`
        };

        transporter.sendMail(messageOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.render('popup', {
                comment: 'Rachit has received the code. Take the code from him.',
            });
        });

    } catch (error) {
        res.render('popup', {
            comment: 'BackEnd Error',
        });
        console.log(error)
        process.exit(1);
    }    
});


app.post('/sendmail',async (req, res) => {
    try{
        const limit = await Value.findOne({ name: "limit2" });
        const val = limit.value_index;
        console.log(val);
        if(val<=3){
            const position = await Value.findOne({ name: "Incrementor2" });
            let i = position.value_index;
            console.log(i);

            let msg = ["MSG"];
            let arr = ["Github uploads url"];
            client.messages
            .create({ 
                // mediaUrl: [arr[i]],
                body: msg[i], 
                from: process.env.FROM_NO,       
                to: process.env.TO_NO 
            }).then(message => console.log(message.sid)).done();

            client.messages
            .create({ 
                mediaUrl: [arr[i]],
                // body: msg[i], 
                from: process.env.FROM_NO,       
                to: process.env.TO_NO 
            }).then(message => console.log(message.sid)).done();
    
            const result = await Value.updateOne(
                { name: "Incrementor2" },
                { $inc: { value_index: 1 } }
            );
            const final = await Value.updateOne(
                { name: "limit2" },
                { $inc: { value_index: 1 } }
            );
            res.redirect("/")
        }else{
            res.render('popup', {
                comment: 'Limit exceeded!'
            });
            console.log("Limit exceeded!");
        }
    }catch(error){
        res.render('popup', {
            comment: 'BackEnd Error'
        });
        console.log("Sending SMS Failed💥 "+error);
        process.exit(1);
    }
});
   
// Server Listening
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

// r9X-cQRfrZQzLqmEwwfaVWGvbLhmCZbkEkweA31p
