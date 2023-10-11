import CustomError from "../services/errors/custom_error.js";
import { informationNotFound } from "../services/errors/info_error.js";
import { MessageService } from "../services/services.js";

export const  getMessageController= async(req, res, next)=>{ //siempre que pongo un custom error, debo convertir la funcion en un middleware con un next
    try {
        const messages= await MessageService.getAll()

        if(!messages){
            CustomError.createError({
                name: "Error en la búsqueda de mensajes",       
                cause: informationNotFound(), 
                message: "Mensajes no disponibles",
                code: EErrors.DB_ERROR
            })
        }

        res.render("chat", {messages})

    } catch (error) {
        next (error)
    }

}