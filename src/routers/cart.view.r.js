import AppRouter from "./appRouter.js";
import {
    cartViewController,
    cartRealTimeController
} from "../controllers/cart.views.controller.js";

export default class CartViewRouter extends AppRouter {
    init() {
        //VISTA CARRITO
        this.get("/views/:cid", cartViewController);
        //VISTA CARRITO REALTIME
        this.get("/cartrealtime/:cid", cartRealTimeController);
    }
}