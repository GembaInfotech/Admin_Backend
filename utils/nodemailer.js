import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendVerificationEmail(Admin, emailTemplate) {
    console.log(Admin);
    const mailOptions = {
      from: process.env.EMAIL,
      to: Admin.mail,
      subject: "Parkar-Verify Your Email",
      html: emailTemplate,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
}

export default sendVerificationEmail;
