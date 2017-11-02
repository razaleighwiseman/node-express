var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'email.northport.com.my',
    port: 25,
    //secure: true, // use SSL
    auth: {
        user: 'razaleigh@northport.com.my',
        pass: 'RAza9897'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Northport Mobile" <razaleigh@northport.com.my>', // sender address
    to: 'razaleigh@northport.com.my', // list of receivers
    subject: 'Account Activation - Email Verification', // Subject line
    text: 'Hello world', // plaintext body
    html: '<p>Hi,</p><p>Thank you for signing up to Northport Mobile</p>' + 
	  '<p>Please activate your account by clicking on the link below: <br />http://10.8.224:3333/activate?code=11428331ea</p>' + 
	  '<p>If you are unable to click on the link above, please copy the full URL and paste it into your browser address bar.</p>' + 
 	  '<p>In the event if you did not request for a Northport Mobile account, kindly ignore this email.</p>' +
	  '<p>Thank You</p><p>Yours sincerely,<br /><i>Northport</i></p>'// html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});
