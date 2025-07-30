const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aniket.jadhav20703@gmail.com',
    pass: 'hwafkzjdqljaphxt' // No spaces
  }
});

const mailOptions = {
  from: 'aniket.jadhav@gmail.com',
  to: 'aniket.jadhav20703@gmail.com',
  subject: 'Test email from Node.js',
  text: 'If you see this, nodemailer is working!'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    return console.error('Error sending email:', err);
  }
  console.log('Test Email sent:', info.response);
});
