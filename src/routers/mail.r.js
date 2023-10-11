import AppRouter from "./appRouter.js";
import {getbillController} from "../controllers/mail.controller.js"

export default class MailRouter extends AppRouter{
    init(){
        //email cuando se realiza la compra
        this.get("/product/getbill/:code", getbillController)
    }
}