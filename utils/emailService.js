
import nodemailer from 'nodemailer';


export const generateOtp = () => {
    // return Math.floor(Math.random() * 100000);
     return Math.floor(100000 + Math.random() * 900000).toString();

}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendMail = async (mail, otp) => {

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: mail,
      subject: "Your opt for password reset is",
      html: `<h1>Your One time OTP is ${otp}</h1>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("sending")
        return true;
    } catch (error) {
        return false;
    }
}