const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Replace with your email details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aniket.jadhav20703@gmail.com',
    pass: 'hwafkzjdqljaphxt'  // Use App Password, not your real password
  }
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'aniket.jadhav20703@gmail.com', // Receiver email
    subject: `New message from ${name}`,
    text: message
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ error: 'Email failed to send' });
    } else {
      console.log('Email sent:', info.response);
      return res.status(200).json({ message: 'Message sent successfully!' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
