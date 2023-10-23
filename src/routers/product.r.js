import AppRouter from "./appRouter.js";
import { handlePolicies } from "../middleware/auth.middleware.js";
import { uploader } from "../middleware/multer.js";
import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controller.js";


export default class ProductRouter extends AppRouter {
    init() { //sobreescribe el método init del padre AppRouter. 
        this.get("/", getAllProductsController);

        this.get("/:pid", getProductByIdController);

        this.post('/', handlePolicies(["ADMIN", "PREMIUM"]), uploader.single("thumbnails"), createProductController);

        this.put("/:pid", handlePolicies(["ADMIN", "PREMIUM"]), updateProductController);

        this.delete("/:pid", handlePolicies(["ADMIN", "PREMIUM"]), deleteProductController);
    }
}