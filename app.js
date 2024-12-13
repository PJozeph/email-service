const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { name, website, email, message } = req.body;

    if (!email || !message || !name) {
        return res.status(400).send({
            error: 'Please provide all required fields: name, email, and message.',
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Message from Portfiolio Website',
            text: `Name: ${name}\nWebsite: ${website}\nEmail: ${email}\nMessage: ${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({
            error: 'Failed to send email. Please try again later.',
        });
    }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
