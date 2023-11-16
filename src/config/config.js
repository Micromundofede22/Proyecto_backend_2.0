import dotenv from "dotenv";  //lee variables de entorno del archivo .env
import { Command } from "commander"; //comander para cambiar persistencia por linea de comandos


dotenv.config();

const program= new Command();

program.option("-p <persistence>", "persistencia de los datos", "MONGO");

program.parse(); //convierte json  a objeto js
const persistenceComander= program.opts().p;
// console.log(persistenceComander)

export default{
    environment: process.env.ENVIRONMENT,
    PORT:process.env.PORT,                            //PUERTO listening
    MONGO_URI: process.env.MONGO_URI,                 //URL CONEXIÓN BASE DATOS
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,         //NOMBRE DE LA 
    persistence: persistenceComander,                  
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,             //EMAIL DE REGISTRO DEL ADMINISTRADOR 
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    cookieNameJWT: process.env.JWT_COOKIE_NAME,       //cookie jwt
    keyPrivateJWT: process.env.JWT_PRIVATE_KEY,       //clave privada cookie
    nodemailerUSER: process.env.NODEMAILER_USER,
    nodemailerPASS: process.env.NODEMAILER_PASS,
    // GIT LOGIN
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    CALLBACKURL: process.env.CALLBACKURL,
    // GOOGLE LOGIN
    GOOGLECLIENTID: process.env.GOOGLECLIENTID,
    GOOGLECLIENTSECRET: process.env.GOOGLECLIENTSECRET,
    GOOGLECALLBACKURL: process.env.GOOGLECALLBACKURL,

    KEY_STRIPE: process.env.KEY_STRIPE,               //clave privada api de pagos stripe
    TOKEN_MP: process.env.TOKEN_MP
};