import dayjs from "dayjs";
import UserDTO from "../dto/Users.DTO.js";
import logger from "../loggers.js";
import { UserService } from "../services/services.js";
import { CartService } from "../services/services.js";
import { sendEmailUserOffline } from "../services/nodemailer/nodemailer.js";
import { generateToken } from "../utils.js";
import config from "../config/config.js";
import { signedCookie } from "cookie-parser";

//variable de entorno en carpeta config, archivo config
const JWT_COOKIE_NAME = config.cookieNameJWT;
const JWT_PRIVATE_KEY = config.keyPrivateJWT;

//VISTA CAMBIO DE ROL
export const viewChangeController = (req, res) => {
    try {
        const user = req.user.user;
        // console.log(typeof user)
        res.render("changeRole", { user });

    } catch (error) {
        res.sendServerError(error.message);
    };
};

//LÓGICA CAMBIO ROL
export const changeRolController = async (req, res) => {
    try {
        const newRole = req.body.role;
        const id = req.params.uid;

        const user = await UserService.getUserById(id);
        //si se quiere cambiar a premium, pedir documentación requerida
        if (newRole == "premium") {
            const documentsUpload = user.documents.filter((item) => item.name.includes("identificacion") || item.name.includes("domicilio") || item.name.includes("comprobante"));
            // console.log(documentsUpload);
            if (documentsUpload.length === 3) {
                await UserService.updateUser(id, { role: newRole });
                //actualizacion de token con nueva info
                req.user.user.role = newRole;
                const user = req.user.user;
                const token = generateToken(user);
                return res
                    .cookie(JWT_COOKIE_NAME, token, signedCookie(JWT_PRIVATE_KEY)) //genera nueva cookie con el nuevo token 
                    .sendSuccess("Rol cambiado exitosamente");
            } else {
                let missingDocuments = [];
                if (!documentsUpload.some(item => item.name.includes("identificacion"))) {
                    missingDocuments.push("Identificación");
                };
                if (!documentsUpload.some(item => item.name.includes("domicilio"))) {
                    missingDocuments.push("Domicilio");
                };
                if (!documentsUpload.some(item => item.name.includes("comprobante"))) {
                    missingDocuments.push("Comprobante");
                };
                return res
                    .sendRequestError(`Faltan cargar los siguiente documentos para ser premium: ${missingDocuments}`);
            };
        } else {
            await UserService.updateUser(id, { role: newRole });
            //actualizo token
            req.user.user.role = newRole;
            const user = req.user.user;
            const token = generateToken(user);

            res
                .cookie(JWT_COOKIE_NAME, token, signedCookie(JWT_PRIVATE_KEY))
                .sendSuccess("Nuevo rol asignado: User");
        };
    } catch (error) {
        logger.error(error);
        res.sendServerError(error.message);
    };
};

export const viewDocumentsController = async (req, res) => {
    try {
        const userID = req.user.user._id.toString();
        // console.log(user)
        res.render("uploadDocuments", {userID} );
    } catch (error) {
        
        res.sendServerError(error.message);
    }

};

export const documentController = async (req, res) => {
    try {
        
        const id = req.params.uid.toString()
        // console.log(id)
        const documentsUpload = req.files; //objeto, y cada archivo que tiene es un array
        console.log(documentsUpload)

        const user = await UserService.getUserById(id)
        // console.log(typeof documentsUpload)

        const documents = user.documents;
        //DOCUMENTOS DE IDENTIFICACION
        //si no existe, lo pushea
        if (documentsUpload.identificacion && !documents.some(item => item.name.includes("identificacion"))) {
            documents.push({
                name: documentsUpload.identificacion[0].filename,
                reference: documentsUpload.identificacion[0].path,
            });
        //si ya existe, lo sobreescribe    
        } else if (documentsUpload.identificacion) { 
            documents.map(data => {
                if (data.name.includes("identificacion")) {
                    data.name = documentsUpload.identificacion[0].filename,
                        data.reference = documentsUpload.identificacion[0].path //ruta al archivo
                };
            });
        };


        //DOCUMENTOS DE DOMICILIO
        if (documentsUpload.domicilio && !documents.some(item => item.name.includes("domicilio"))) {
            documents.push({
                name: documentsUpload.domicilio[0].filename,
                reference: documentsUpload.domicilio[0].path,
            });
        } else if (documentsUpload.domicilio) {
            documents.map(data => {
                if (data.name.includes("domicilio")) {
                    data.name = documentsUpload.domicilio[0].filename,
                        data.reference = documentsUpload.domicilio[0].path
                };
            });
        };

        //DOCUMENTOS DE COMPROBANTE DE CUENTA
        if (documentsUpload.comprobante && !documents.some(item => item.name.includes("comprobante"))) {
            documents.push({
                name: documentsUpload.comprobante[0].filename,
                reference: documentsUpload.comprobante[0].path,
            });
        } else if (documentsUpload.comprobante) {
            documents.map(data => {
                if (data.name.includes("comprobante")) {
                    data.name = documentsUpload.comprobante[0].filename,
                        data.reference = documentsUpload.comprobante[0].path
                };
            });
        };

        // console.log(documents)
        await UserService.updateUser(id, { documents: documents });
        res.send("Documentos cargados exitosamente");
        // res.redirect("/api/users/rolechange")

    } catch (error) {
        console.log("por aca")
        res.sendServerError(error.message);
    };
};

//TRAE TODOS LOS USUARIOS
export const allUserController = async (req, res) => {
    try {
        const allUser = await UserService.getUser();
        const allUserDto = allUser.map(item => new UserDTO(item));
        res.sendSuccess(allUserDto);
    } catch (error) {
        res.sendServerError(error.message);
    };
};

//BORRA USUARIOS FUERA DE LINEA HACE 2 DIAS 
export const offlineUserController = async (req, res) => {
    try {
        const users = await UserService.getUser();
        const currentDate = dayjs();        //fecha actual

        const offlineUser = users.map(async (item) => {
            const lastConnection = dayjs(item.last_connection); //ultima conexión
            const difference = currentDate.diff(lastConnection, "day"); //calcula diferencias entre dos fechas(hoy y ultima conexion)
            // console.log(difference);

            if (difference > 2) {
                await sendEmailUserOffline(item.email, lastConnection.format('DD/MM/YYYY'));
                await CartService.deleteCart(item.cart.toString());
                await UserService.deleteUser((item._id).toString());
            };
        });

        Promise.all(offlineUser)
            .then(() => {
                res.sendSuccess("Cuentas eliminadas con éxito");
            })
            .catch((error) => {
                return res.sendError(error);
            })
    } catch (error) {
        res.sendServerError(error.message);
    };
};

export const viewModifiesController = (req, res) => {
    try {
        res.render("admin/modifies");
    } catch (error) {
        res.sendServerError(error.message);
    }
};

//busca usuario y lo muestra en vista
export const findUserController = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await UserService.getUserEmail({ email });
        res.render("admin/userModifies", { user });
    } catch (error) {
        res.sendServerError(error.message);
    }
};

//cambia rol al usuario
export const userModifiesController = async (req, res) => {
    try {
        const id = req.params.uid;
        const newRole = req.body.role;

        const user = await UserService.updateUser(id, { role: newRole.toString() });
        res.render("admin/userModifies", { user });
        // res.sendSuccess(user);
    } catch (error) {
        res.sendServerError(error.message);
    };
};

//elimina al usuario
export const deleteUserController = async (req, res) => {
    try {
        const id = req.params.uid;
        await UserService.deleteUser((id).toString());
        res.sendSuccess("Usuario eliminado");
    } catch (error) {
        res.sendServerError(error.message);
    };
};