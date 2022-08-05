const accountSid = 'AC3102c433e040dc6973d58c6002e3c68a'; 
const authToken = '5f6c7c4029ce55d996ca0479c46598ff'; 
const client = require('twilio')(accountSid, authToken); 
 
const random = Math.random(9);

client.messages 
      .create({ 
        mediaUrl: ['https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'],
         body: 'Hello!' + random, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+919910124855' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();