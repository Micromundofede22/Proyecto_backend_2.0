import AppRouter from "./appRouter.js";
import { passportCall } from "../middleware/passportCall.js";
import { uploader } from "../middleware/multer.js";
import { handlePolicies } from "../middleware/auth.middleware.js";
import {
    changeRolController,
    documentController,
    viewChangeController,
    viewDocumentsController,
    allUserController,
    offlineUserController,
    viewModifiesController,
    findUserController,
    userModifiesController,
    deleteUserController
} from "../controllers/users.controller.js";


export default class UserRouter extends AppRouter {
    init() {
        //VISTA cambio de rol
        this.get("/rolechange",
            passportCall("jwt"),
            viewChangeController);

        //API para cambiar rol 
        this.post("/premium/:uid",
            passportCall("jwt"),
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

        //TRAE TODOS LOS USUARIOS
        this.get("/alluser",
            handlePolicies(["ADMIN"]),
            allUserController);

        //ELIMINA USUARIOS OFFLINE
        this.delete("/offlineuser",
            handlePolicies(["ADMIN"]),
            offlineUserController);

        //vista para admin editar perfiles
        this.get("/modifies",
            handlePolicies(["ADMIN"]),
            viewModifiesController);

        //admin busca usuario a editar
        this.post("/modifies/user",
            handlePolicies(["ADMIN"]),
            findUserController);

        //admin cambia rol al usuario
        this.post("/usermodifies/:uid",
            handlePolicies(["ADMIN"]),
            userModifiesController);

        //admin elimina usuario
        this.post("/useroff/:uid",
            handlePolicies(["ADMIN"]),
            deleteUserController);
    };
}; 