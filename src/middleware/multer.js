import multer from "multer";
import { __dirname } from "../utils.js";


// CONFIGURACIÓN MULTER
const storage = multer.diskStorage({ // acá le digo que se grabe en disco de almacenamiento

    destination: function (req, file, cb) {

        if(file.fieldname == "domicilio" || file.fieldname == "comprobante" || file.fieldname =="identificacion"){
            cb(null, __dirname + "/public/documents"); //acá le digo que se guarde en carpeta public
        };
        if(file.fieldname == "imageprofile"){
            cb(null, __dirname + "/public/profiles");
        };
        if(file.fieldname == "thumbnails"){
            cb(null, __dirname + "/public/products");
        };
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname)
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + uniqueSuffix); //fildname= se guarda con nombre del formulario mas un numero unico
        //filename: nombre del archivo dentro de destination para guardarlo
        //fieldname= nombre del campo del formulario
    }
})


export const uploader = multer({ storage })

// USARLO ASÍ ENTRE UNA RUTA Y SU FUNCION CONTROLLER
// uploader.single("file")
