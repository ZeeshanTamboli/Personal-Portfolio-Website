const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

//Require file
const auth = require('./config/auth');

//Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express-Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Use flash
app.use(flash());

//Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  next();
});

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Number: ${req.body.number}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: auth.user,
      pass: auth.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: `"Portfolio Website" <${auth.user}>`, // sender address
    to: 'zeeshan.tamboli@gmail.com', // list of receivers
    subject: 'Website Contact', // Subject line
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    req.flash(
      'success_msg',
      'Thank you for contacting me - I will get back to you soon!'
    );
    res.redirect('/');
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
