import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Servicio de correo
  auth: {
    user: "email@gmail.com", // correo electrónico
    pass: "contraseña", //  contraseña de correo
  },
});

// Función para simular el envío de correos
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "email@gmail.com",
    to,
    subject,
    text,
  };

  // Simulación del envío de correo
  console.log("Simulación de envío de correo:");
  console.log("De:", mailOptions.from);
  console.log("Para:", mailOptions.to);
  console.log("Asunto:", mailOptions.subject);
  console.log("Cuerpo del mensaje:", mailOptions.text);

  /*
    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo: ', error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
    */
};
