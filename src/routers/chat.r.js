import AppRouter from "./appRouter.js";
import { getMessageController } from "../controllers/message.controller.js";

export default class ChatRouter extends AppRouter{
    init(){
        //trae mensajes del chat
        this.get("/", getMessageController)
    }
}