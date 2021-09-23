const nodemailer = require('../configs/nodemailer');
const email = require('../template/email');

const sendEmail = (toEmail, token, name) => {
  nodemailer
    .sendMail({
      from: `Zembrani <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Email Verification',
      attachments: [
        {
          filename: 'logoZembrani.png',
          path: './src/assets/image/logoZembrani.png',
          cid: 'email',
        },
      ],
      html: email(`http://localhost:3000/verifyemail/${token}`, name),
    })
    .then((result) => {
      console.log('Nodemailer success');
      console.log(result);
    })
    .catch((err) => {
      console.log(`Nodemailer Error : ${err}`);
    });
};
module.exports = sendEmail;
