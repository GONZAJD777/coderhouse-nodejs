import nodemailer from "nodemailer"
import {logger} from "./logger.config.js"
import {MAILER_USER,MAILER_PASS} from "./config.js"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure:true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: MAILER_USER,
      pass: MAILER_PASS,
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  export async function mailSender (recivers,subject,message) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"CoderEcommerce" <gonzajd777@gmail.com>', // sender address
      to: recivers, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: "<p>Para reestablecer su contraseña por favor haga click en el siguiente link valido temporalmente.\n" +
                "<a href="+ message +">" +
                     " Haz Click Aquí " +
                "</a>"+
            "</p>"// html body
    });
  
    logger.log( 'info',"Message sent: %s"+ info.messageId+ " | " + message + " | "  );
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }