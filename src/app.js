import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session"; //DEPENDENCIA SESSION (guarda cookie)
// import MongoStore from "connect-mongo"; //DEPENDENCIA guardar datos en MONGO
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser"; //crea cookie (para jwt)
import config from "./config/config.js"; //para leer variables de entorno
import cors from "cors";
import logger from "./loggers.js";
import swaggerJsdoc from 'swagger-jsdoc';             //DOCUMENTACIÓN API   
import swaggerUiExpress from 'swagger-ui-express';    //DOCUMENTACIÓN API 
import { __dirname} from "./utils.js";
import run from "./run.js";


//variables de entorno
const PORT = config.PORT;
const MONGO_URI= config.MONGO_URI;
const MONGO_DB_NAME= config.MONGO_DB_NAME;
const JWT_PRIVATE_KEY = config.keyPrivateJWT;

const app = express();

app.use(express.json());                         //server pueda recibir json del cliente
app.use(express.urlencoded({ extended: true })); //server pueda recibir json que llegan por formulario por vista desde el cliente
app.use(cookieParser());                         //crea cookies (se usan para que se guarde el token)
app.use(express.static(__dirname + "/public"));  //Archivos públicos se guarden en carpeta public
app.use(cors());                                 // permite conexiones de front que estan en otros dominios a mi servidor 


//CONFIGURACIÓN DEL MOTOR DE PLANTILLAS
app.engine('handlebars', handlebars.engine({
    helpers: { //permiten realizar if en las plantillas
        igual: function (value, value2) {
            if (value == value2) {
                return true;
            }
        }
    }
}));
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');


// CONFIG PASSPORT
app.use(session({
    secret: JWT_PRIVATE_KEY ,
    resave: true,
    saveUninitialized: true
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//CONFIGURACIÓN DOCUMENTACIÓN API SWAGGER
export const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce Micromundo',
            version: '1.0.0', //versión de la app que estoy documentando
        }
    },
    apis: [
        `./docs/**/*.yaml`, //extensión de archivo que lee swagger. (/**/ significa en cualquier carpeta. (*.yaml)significa cualquier nombre de archivo de extensión yaml )
    ],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


try {
    // CONEXIÓN A LA BASE DE DATOS 
    await mongoose.connect(`${MONGO_URI}${MONGO_DB_NAME}`);

    //INICIO DEL SERVIDOR HTTP
    const serverHTTP = app.listen(
        PORT,
        () => logger.info(`Server up ${PORT}`));

    //CONFIGURACION SOCKET IO
    // instanciO servidor socketio y enlazO al server http
    const io = new Server(serverHTTP)
    //creo el objeto SOCKETIO con el servidor io asi lo uso en toda la app
    //(lo uso para emitir en api/product Y api/cart en cada funcion del controller)    
    app.set("socketio", io)
    //FUNCIONALIDADES DE LA APP E IO
    run(io, app)

} catch (error) {
    logger.error(`No se puede conectar a la base de datos ${error}`);
    process.exit();
}



