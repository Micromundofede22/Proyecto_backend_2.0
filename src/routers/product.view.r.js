import AppRouter from "./appRouter.js";
import {
    productsViewsController,
    realTimeViewsController
} from "../controllers/product.views.controller.js";


export default class ProductViewRouter extends AppRouter{
    init(){
        //vista productos
        this.get("/views", productsViewsController);

        //vista RealTime Productos
        this.get("/realtimeproducts", realTimeViewsController);
    }
}