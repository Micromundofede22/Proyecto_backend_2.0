import AppRouter from "./appRouter.js";
import { passportCall } from "../middleware/passportCall.js";
import {
    createSessionController,
    pendingController,
    receiveWebhookController
} from "../controllers/payment.MP.controller.js"

export default class PaymentMPRouter extends AppRouter{
    init(){
        this.post("/create-session",passportCall("jwt"), createSessionController);
    
        this.get("/pending", pendingController);

        this.post("/webhook", receiveWebhookController);

    };
};