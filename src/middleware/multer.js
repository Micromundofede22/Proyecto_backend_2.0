import multer from "multer";
import { __dirname } from "../utils.js";
// import logger from "../loggers.js";

// CONFIGURACIÓN MULTER
const storage= multer.diskStorage({ // acá le digo que se grabe en disco de almacenamiento
    
    destination: function(req, file,cb){
                cb(null, __dirname + "/public/assets")  //acá le digo que se guarde en carpeta public
    },
    filename: function(req, file,cb){
        // logger.info(file)
        cb(null, file.originalname) //y acá que se guarde con el nombre original con el que viene
    }
})


export const uploader= multer({storage})

// USARLO ASÍ ENTRE UNA RUTA Y SU FUNCION CONTROLLER
// uploader.single("file")
