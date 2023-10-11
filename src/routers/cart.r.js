import AppRouter from "./appRouter.js";
import { handlePolicies } from "../middleware/auth.middleware.js";
import { 
    createCartController, 
    getCartController, 
    createInCartController,
    deleteOneProductController,
    deleteCartController,
    updateQuantityController,
    purchaseController
} from "../controllers/cart.controller.js";

export default class CartRouter extends AppRouter{
    init(){
        this.get("/:cid", getCartController);

        this.post('/', createCartController);

        this.post("/:cid/product/:pid",handlePolicies("USER"), createInCartController);

        this.put("/:cid/product/:pid",handlePolicies("USER"), updateQuantityController);

        this.delete("/:cid/product/:pid", deleteOneProductController);

        this.delete("/:cid",deleteCartController);
        
        this.post("/:cid/purchase", purchaseController); 
    }
}