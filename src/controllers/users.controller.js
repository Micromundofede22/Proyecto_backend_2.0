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

        const user= await UserService.getUserById(id);
        const documentsUpload= user.documents.filter((item)=> item.name.includes("identificacion") || item.name.includes("domicilio") || item.name.includes("comprobante"));
        console.log(documentsUpload);
        if(documentsUpload.length === 3){
            const userModificado= await UserService.updateUser(id, {role: newRole});
            console.log(userModificado)
            // res.redirect("/products/views");
            return res.sendSuccess("Rol cambiado exitosamente")
        }else{
           return res.sendRequestError("Faltan cargar documentos para ser premium");
        }

        // console.log(result)
        // res.sendSuccess(`Nuevo rol asignado ${newRole}`)
        res.redirect("/products/views");
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
    // const id = req.user.user._id;
    const id = req.params.uid
    const documentsUpload = req.files; //objeto, y cada archivo que tiene es un array
    // console.log(typeof documentsUpload)
    // console.log(documentsUpload.identificacion[0].filename)
    if (!documentsUpload.identificacion &&
        !documentsUpload.domicilio &&
        !documentsUpload.comprobante) {
        return res.sendRequestError("Hay documentos sin subir");
    }
    const documents = [
        {
            name: documentsUpload.identificacion[0].filename,
            reference: documentsUpload.identificacion[0].path,
        },
        {
            name: documentsUpload.domicilio[0].filename,
            reference: documentsUpload.domicilio[0].path,
        },
        {
            name: documentsUpload.comprobante[0].filename,
            reference: documentsUpload.comprobante[0].path,
        }
    ];
    // console.log(documents)
    await UserService.updateUser(id, { documents: documents });
    res.createdSuccess("Documentos cargados exitosamente");
};