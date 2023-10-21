import AppRouter from "./appRouter.js";
import { passportCall } from "../middleware/passportCall.js";
import { uploader } from "../middleware/multer.js";
import {
    changeRolController,
    documentController,
    viewChangeController,
    viewDocumentsController
} from "../controllers/users.controller.js";



export default class UserRouter extends AppRouter {
    init() {
        //VISTA cambio de rol
        this.get("/rolechange",
            passportCall("jwt"),
            viewChangeController);

        //API para cambiar rol 
        this.post("/premium/:uid",
            changeRolController);


        //Vista subir documentos para cambiar al rol premium
        this.get("/:uid/documents",
            passportCall("jwt"),
            viewDocumentsController);

        //API subir documentos para cambiar al rol premium
        this.post("/:uid/documents",
            passportCall("jwt"),
            uploader.fields([{ name: "identificacion" }, { name: "domicilio" }, { name: "comprobante" }]),
            documentController);
    };
}; 