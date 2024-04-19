import nodemailer from "nodemailer"
import {logger} from "./logger.config.js"
import {MAILER_USER,MAILER_PASS, ADMIN_USER} from "./config.js"
import UserManager from "../services/users.manager.js"
import responseErrorHandler from "../middlewares/error.response.middleware.js"
import UsersDTO from "../dao/dto/users.DTO.js"

const um = new UserManager();
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

  export async function mailSender (recivers,subject,message) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"CoderEcommerce" <gonzajd777@gmail.com>', // sender address
      to: recivers, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
      html: message // html body
    });
  
    logger.log( 'info',"Message sent: %s"+ info.messageId+ " | " + message + " | "  );
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  // async..await is not allowed in global scope, must use a wrapper
  export const resetPassNotificator = async (recivers,subject,tokenLink) => {
    try {
            const message = "<p>Para reestablecer su contraseña por favor haga click en el siguiente link valido temporalmente.\n" +
                      "<a href="+ tokenLink +">" +
                          " Haz Click Aquí " +
                      "</a>"+
                  "</p>"// html body
          await mailSender(recivers,subject,message);  
        }catch (error) {
          //responseErrorHandler(error,request,response);
        }
  }

  export const deleteProductNotificator = async (user,product) => {
    try {
        let productOwner={};
        if(product.owner===ADMIN_USER.id) 
             {productOwner={...ADMIN_USER}}
        else {productOwner = await um.getBy(UsersDTO.build({id:product.owner}))}
        
        const receivers = productOwner.email;
        const subject = "Coder Ecommmerce - Producto Eliminado";
        const message = '<p>Estimado usuario '+productOwner.firstName+' '+productOwner.lastName+'\n</p>'+
                        '<p>Nos contactamos con uds para notificarle que el siguiente producto '+ 
                        'ha sido eliminado de la base de datos por usuario '+user.firstName+' '+user.lastName+'.\n</p>'+
                        '<p>***********************************************************************************\n</p>'+
                        '<p>#_id: '+ product._id +'\n<br>'+
                        '#title: '+product.title +'\n<br>'+                  
                        '#description: '+product.description +'\n<br>'+       
                        '#thumbnail: '+product.thumbnail +'\n<br>'+
                        '#status: ' +product.status +'\n<br>'+         
                        '#category: '+product.category +'\n<br>'+
                        '#code: '+product.code +'\n<br>'+                     
                        '#stock: '+product.stock +'\n<br>'+
                        '#price: $'+product.price +'\n<br>'+
                        '#owner: '+product.owner +'\n</p>'+
                        '<p>***********************************************************************************\n</p>'+
                        '<p>Si lo considera pertinente podra crearlo nuevamente con una cuenta premium en nuestra plataforma.\n</p>'+
                        '<p>Este es un mensaje fue generado automaticamente, no es necesario que responda.\n</p>'+
                        '\n<br>'+
                        '<p>Atentanmente el equipo de Coder Ecommerce.-</p><br>';
                        
        if(productOwner.role==="premium")await mailSender(receivers,subject,message);                
            
    }catch (error) {
      logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +error );
    }
}

 
export const purchaseNotificator = async (user,ticket) => {
  try {
      let buyer={};
      
      if(user.id===ADMIN_USER.id){buyer={...ADMIN_USER}}
      else {buyer = await um.getBy(UsersDTO.build({id:user.id}))}
      
      const receivers = buyer.email;
      const subject = "Coder Ecommmerce - Notificacion de Compra";
      const ticketDetail=ticketDetailString(ticket.ticketDetail);
      const message = '<p>Estimado usuario '+buyer.firstName+' '+buyer.lastName+'\n</p>'+
                      '<p>Nos contactamos con uds para enviarle los detalles de la compra que acaba de realizar.</p>'+ 
                      '<p>***********************************************************************************\n</p>'+
                      '<p>**************************** ENCABEZADO DEL TICKET ****************************\n</p>'+
                      '<p>#_id: '+ ticket._id +'\n<br>'+
                      '#code: '+ticket.code +'\n<br>'+                  
                      '#purchase_datetime: '+ticket.purchase_datetime +'\n<br>'+       
                      '<p>******************************* DETALLE DEL TICKET ********************************\n</p>'+
                      ticketDetail
                      +
                      '<p><h2>TOTAL DE LA COMPRA: $'+ticket.amount+'</h2>\n</p>'+
                      '<p>***********************************************************************************\n</p>'+
                      '<p>El vendedor se contactara con uds para coordinar el envio a la brevedad.\n</p>'+
                      '<p>Este es un mensaje fue generado automaticamente, no es necesario que responda.\n</p>'+
                      '\n<br>'+
                      '<p>Atentanmente el equipo de Coder Ecommerce.-</p><br>';
      await mailSender(receivers,subject,message);    
  }catch (error) {
    logger.log('error',new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() + ' - ' +error );
  }
}

function ticketDetailString (ticketDetail) {
  let itemsString = '';
  let subTotal=0;
  ticketDetail.forEach(element => {
    subTotal=element.product.price*element.quantity;

    itemsString= itemsString +
                '<p>#_id: '+ element.product._id +'\n<br>'+
                '#title: '+element.product.title +'\n<br>'+                  
                '#description: '+element.product.description +'\n<br>'+       
                '#code: '+element.product.code +'\n<br>'+                     
                '#price: $'+element.product.price +'\n<br>'+
                'CANTIDAD ADQUIRIDA --> '+element.quantity+' UNIDADES\n<br>'+
                'SUBTOTAL --> $'+subTotal+'\n<br>'+
                '--------------------------------------------------------------------------------------\n</p>';
  });
  
  return itemsString;
}