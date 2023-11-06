import AppRouter from "./appRouter.js";
import { passportCall } from "../middleware/passportCall.js";
import {
    createSessionController,
    successPaymentController,
    cancelPaymentController
} from "../controllers/payment.controller.js";


export default class PaymentRouter extends AppRouter {
    init() {
        this.get("/create-checkout-session",passportCall("jwt"), createSessionController);
        this.get("/success",passportCall("jwt"), successPaymentController);
        this.get("/cancel",passportCall("jwt"), cancelPaymentController);

    };
};