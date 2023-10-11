import nodemailer from "nodemailer";
import config from "../config/config.js"
import Mailgen from "mailgen";
import { TicketService } from "../services/services.js";
// import { UserService } from "../services/services.js";


const nodemailerUSER = config.nodemailerUSER
const nodemailerPASS = config.nodemailerPASS


export const getbillController = async (req, res) => {
    const codeTicket = req.params.code //code viene de api/carts/:cid/purchase
    const tickets = await TicketService.getAll()
    const ticketEnArray = tickets.filter((data) => data.code === codeTicket)
    const ticket = ticketEnArray[0]

    // console.log(ticket)
    // console.log(ticket.purcharser)

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

    let content = {
        body: {
            intro: "Su compra está registrada",
            signature: false,
            table: {
                data: [
                    {
                        Idticket: `${(ticket._id).toString()}`,
                        _: ` `,
                        Código: `${(ticket.code).toString()}`,
                        MontoTotal: `${(ticket.amount).toString()}`,
                        Fecha: `${(ticket.purchase_datetime).toString()}`
                    }
                ]
            },
            outro: "Que tengas el mejor de los días. Y recuerda siempre mirar hacia adentro."
        }
    }
    let mail = MailGenerator.generate(content)

    let message = {
        from: `${nodemailerUSER}`,
        to: `"${ticket.purcharser}"`,
        subject: "Gracias por tu compra",
        html: mail
    }
    transporter.sendMail(message)
        .then(() => res.status(201).json({ status: "success" }))
        .catch((err) => res.status(412).json({ err }))
}

