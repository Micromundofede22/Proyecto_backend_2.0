import logger from "../loggers.js";
import { UserService } from "../services/services.js";

//VISTA CAMBIO DE ROL
export const viewChangeController = (req, res) => {
    try {
        const user = req.user.user;
        // console.log(user)
        res.render("changeRole");

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
        const documentsUpload = user.documents.filter((item) => item.name.includes("identificacion") || item.name.includes("domicilio") || item.name.includes("comprobante"));
        console.log(documentsUpload);
        if (documentsUpload.length === 3) {
            await UserService.updateUser(id, { role: newRole });
            // console.log(userModificado)
            // res.redirect("/products/views");
            return res.sendSuccess("Rol cambiado exitosamente")
        } else {
            return res.sendRequestError("Faltan cargar documentos para ser premium");
        }
    } catch (error) {
        logger.error(error);
        res.sendServerError(error.message);
    };
};

export const viewDocumentsController = async (req, res) => {
    try {
        // const user= req.user.user
        // console.log(user)
        res.render("uploadDocuments");
    } catch (error) {
        res.sendServerError(error.message);
    }

}

export const documentController = async (req, res) => {
    try {
        const id = req.params.uid
        const documentsUpload = req.files; //objeto, y cada archivo que tiene es un array
        const user = await UserService.getUserById(id)
        // console.log(typeof documentsUpload)
        
        const documents = user.documents;
        //DOCUMENTOS DE IDENTIFICACION
        if (documentsUpload.identificacion && !documents.some(item => item.name.includes("identificacion"))) {
            documents.push({
                name: documentsUpload.identificacion[0].filename,
                reference: documentsUpload.identificacion[0].path,
            });
        } else if (documentsUpload.identificacion) { //si se sube el documento, que sobreescriba sobreescribe el que ya  existe
            documents.map(data => {
                if (data.name.includes("identificacion")) {
                    data.name = documentsUpload.identificacion[0].filename,
                        data.reference = documentsUpload.identificacion[0].path
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
        res.createdSuccess("Documentos cargados exitosamente");

    } catch (error) {
        res.sendServerError(error.message);
    }
};