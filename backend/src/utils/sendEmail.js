import nodemailer from 'nodemailer';

const sendEmail = async(options) => {
    try {
        
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 465 , // use 587 for STARTTLS
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass:  process.env.EMAIL_PASSWORD,
            },
          });

          const  mailOptions = ({
            from: 'VidShare <noreplay@vidshare.com>', 
            to: options.email,
            subject: options.subject,
            text: options.message
            
          });

          const info = await transporter.sendMail(mailOptions);

        
          console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.log(error);
    }

}

export default sendEmail;