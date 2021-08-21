import nodemailer from '../configs/nodemailer.js';
import email from '../template/email.js';

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
      html: email(`${process.env.FRONT_END_ACTIVATION_URL}/verified-accounts/${token}`, name),
    })
    .then((result) => {
      console.log('Nodemailer success');
      console.log(result);
    })
    .catch((err) => {
      console.log(`Nodemailer Error : ${err}`);
    });
};
export default sendEmail;
