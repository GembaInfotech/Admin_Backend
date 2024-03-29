import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ayushguptass14@gmail.com",
      pass: "itcyffmwyptpjhbt",
    },
  });

function sendVerificationEmail(Admin, emailTemplate) {
    console.log("dfhbhjfbghj.....");
    console.log(Admin);
    const mailOptions = {
      from: "ayushguptass14@gmail.com",
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
