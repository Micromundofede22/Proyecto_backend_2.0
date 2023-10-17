import nodemailer from "nodemailer";
import config from "../../config/config.js";
import Mailgen from "mailgen";
import moment from "moment/moment.js";

const nodemailerUSER = config.nodemailerUSER
const nodemailerPASS = config.nodemailerPASS


export const sendEmailValidation = async (email) => {
    //ENVÍO DE EMAIL AL REGISTRARSE
    let configNodemailer = {
        service: "gmail",
        auth: {
            user: nodemailerUSER,
            pass: nodemailerPASS
        }
    }
    let transporter = nodemailer.createTransport(configNodemailer)

    let message = {
        from: nodemailerUSER,
        to: email,
        subject: "🍀Validación de cuenta🍀",
        html: `Bienvenido usuario ${email}. Haz click en el siguiente enlace para verificar tu cuenta:
  <a href="http://localhost:8080/api/session/verify-user/${email}">Click Aquí</a>`
    }
    await transporter.sendMail(message)
}



export const sendEmailRestPassword = async (email, token) => {

    let configNodemailer = {
        service: "gmail",
        auth: {
            user: nodemailerUSER,
            pass: nodemailerPASS
        }
    }
    let transporter = nodemailer.createTransport(configNodemailer)

    let message = {
        from: nodemailerUSER,
        to: email,
        subject: "Restablecer contraseña ",
        html: `<h1>Restablece tu contraseña</h1><hr /> Haz click en el siguiente enlace:
          <a href="http://localhost:8080/api/session/verify-token/${token}">Click Aquí</a>`
    }
    await transporter.sendMail(message)
}




export const sendEmailTiketPurchase = async (ticket) => {

    let configNodemailer = {
        service: "gmail",
        auth: {
            user: nodemailerUSER,
            pass: nodemailerPASS
        }
    }
    let transporter = nodemailer.createTransport(configNodemailer)

    let MailGenerator = new Mailgen({
        theme: "cerberus",
        product: { //encabezado
            name: "Micromundo terrarios",
            link: "http://micromundo.terrarios.com" //link clikeable a pagina web 
        }
    })

    let productsData = ticket.products.map((data) => ({
        title: data.product.title,
        price: data.product.price,
        quantity: data.quantity,
    }))

    let content = {
        body: {
            name: ticket.purcharser,
            intro: `Su compra está registrada con el código ${ticket.code}`,
            dictionary: {
                Fecha: moment(ticket.purchase_datetime).format("DD/MM/YYYY HH:mm:ss"),
            },

            table: {
                data: productsData,
                columns: {
                    customWidth: {
                        title: "50%",
                        quantity: "20%",
                        price: "30%",
                    },
                }
            },
            outro: `MontoTotal: ${(ticket.amount)}`,
            signature: false
        }
    }
    let mail = MailGenerator.generate(content)

    let message = {
        from: `${nodemailerUSER}`,
        to: `"${ticket.purcharser}"`,
        subject: "Gracias por tu compra",
        html: mail
    }
    try {
        await transporter.sendMail(message)
    } catch (error) {
        logger.error(error)
    }

    // .then(() => res.status(201).json({ status: "success" }))
    // .catch((err) => res.status(412).json({ err }))
}