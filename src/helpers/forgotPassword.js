const nodemailer = require('../configs/nodemailer');
const forgotpw = require('../template/templateForgotPassword');

const sendEmailForgotPw = (toEmail, token, name) => {
  nodemailer
    .sendMail({
      from: `Zembrani <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Reset password',
      attachments: [
        {
          filename: 'logoZembrani.png',
          path: './src/assets/image/logoZembrani.png',
          cid: 'forgotpw',
        },
      ],
      html: forgotpw(`http://localhost:3000/auth/changepassword/${token}`, name),
    })
    .then((result) => {
      console.log('Nodemailer success');
      console.log(result);
    })
    .catch((err) => {
      console.log(`Nodemailer Error : ${err}`);
    });
};
module.exports = sendEmailForgotPw;
