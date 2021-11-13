// The step by step guide to set up google api and to send email, based on OAuth 2.0.  
// This document focus on deploying in JavaScript
// All you need to do in advance is to set up a sending gmail account and follow below instruvtions.  
// The instructions are on notion, please visit : https://quickest-trollius-ac7.notion.site/Sending-Email-by-Google-API-2fe1ea31ac884b678081644db5f612e8  
const express = require('express');
const dotenv = require('dotenv'); // to access .env file
const nodemailer = require('nodemailer');
const {google} = require('googleapis');

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;

const app = express();
const port = 3001;
app.use(express.json());

// sending-api, convenient for testing
app.get('/send', (req, res) =>{
  let email = 'improjectletter2021@gmail.com';
  // the sender email and should be verified by google before, see notion link above
  sendemail(email, 'Hello', `hihi`);
  // sendemail function, or you can just directly use the format on the belowest
  res.json({"message": "Hello World"});
})

app.listen(port , () => console.log(`Started App on port: ${port}`));

///////////////////////////////////////////////
// Send-email-google-api-OAuth-2.0 starts now//
///////////////////////////////////////////////

const REDIRECT_URI = 'https://developers.google.com.oauthplayground';
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN});

const sendemail = async (email, subject, text) => {
  try{
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAILUSER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      },
    });

    await transporter.sendMail({
      from: process.env.MAILUSER, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      //html: html, // html body
    });

    console.log("email sent sucessfully");
  } catch(error){
    console.log(error, "email not sent");
  }
  
}


// transporter.sendMail({
//   from: '"Ying" <b10430603@gmail.com>', // sender address
//   to: "b10430603@gmail.com, aa77899@gmail.com", // list of receivers
//   subject: "Hello World!", // Subject line
//   text: "There is a new article. It's about sending emails, check it out!", // plain text body
//   html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
// }).then(info => {
//   console.log({info});
// }).catch(console.error);
