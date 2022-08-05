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
    user: "dekhlo30@gmail.com",
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
            from: 'Rachit Khurana <dekhlo30@gmail.com>',
            to: 'rachit.khurana2400@gmail.com',
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

            let msg = ["Hey Ranjana,Happy Birthday!Ye le ek or gift.. thodi creativity dikha rha hu bs hehehehe..! Chalo shuru krte hai!😍Babee Thanks for including me in all your happy times, I will make sure that I will be there in your sad times too. I always got your back. We will fight everything together! 🤗","Even when things go upside down, I will always be with you Ranjana and you don't need to worry about anything🥰 Please saath rehna hamesha.. bahot acha lagta hai tere saath.. 😃","I always want you close to me. You are really very special to me. And your fragrance...... uffffffff itna bhi acha nahi hona chahiye yar. Addiction hogayi hai!!😚 No matter how much time we spend together, it feels so so so so so less.. pta nahi kahi ye life bhi kam na pad jaye 😬","We have planned so many things together and finally we have started completing some of those. I am very excited to do so much more with you Ranjanaaa. I love you sooo muchhhhh❤","Okay babe, hope acha laga ho ye chota sa gift ab bssssss.. Time for a new gift! This is a website with similar features but something more interesting... please have fun and have a great day honeyyyyyyyy!! You will get link in next message. Also humari ek funny photo representing ki kaise pura din che che che che che che karti rehti hai tu mere ear me 😪😪","Hehehhehe chahiye gift matlab.. tabhi click kiya tune😂 lele chal.. cutieee😘 kaise hass rahi hogi abhi iss photo ki tarah.😛 Itni pyaari ku hai tu babe.. ese dekh ke tujhe melt hi hojata hu everytime. Hug krlo bs 24 hrs 7 days a week🥰Link:- https://email2400.herokuapp.com/ have funnn.. stay awesome as you are!"];
            let arr = ["https://user-images.githubusercontent.com/88422857/166897090-add2a6ce-432d-4f86-a852-cc35dca5038a.mp4","https://user-images.githubusercontent.com/88422857/166897117-c8db8073-50c7-4300-a08d-de37d4a4808f.mp4","https://user-images.githubusercontent.com/88422857/166897115-428ec24a-2915-493a-aa54-3d4d6ae1940a.mp4","https://user-images.githubusercontent.com/88422857/166897104-af4aae40-9dee-4098-8407-57fcc3c8edc4.mp4","https://user-images.githubusercontent.com/88422857/167082428-0e268cdf-8885-404e-bd51-f6b3d3546d93.jpg","https://user-images.githubusercontent.com/88422857/167082430-f1f56a1d-21d6-4a5e-8fe4-a61b56f89097.jpg"];
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