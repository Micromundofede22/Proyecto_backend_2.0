import winston from "winston";
import config from "./config/config.js";
import moment from "moment";

const createLogger = env => {
    if (env == "PROD") { //environment de PRODUCCION
        return winston.createLogger({
            levels: {        //niveles de logs a guardar
                fatal: 0,    //el nivel más alto
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5     //nivel mas bajo
            },
            transports: [
                new winston.transports.File({ //transporta logs en un archivo
                    filename: './logs/errors.log', //esta carpeta ponerla en .gitignore
                    level: "error",
                    format: winston.format.combine(
                        winston.format.timestamp({
                            format: moment().format("DD/MM/YYYY HH:mm:ss")
                        }), //guarda fecha y hora del log
                        // winston.format.simple()     //guarda en formato de texto simple, sino json
                    )
                }),
                new winston.transports.Console({ // imprime  en consola 
                    level: "info",
                    format: winston.format.combine(
                        winston.format.colorize(), // aplica colores a los niveles
                        winston.format.timestamp({
                            format: moment().format("DD/MM/YYYY HH:mm:ss")
                        }),
                        winston.format.simple()
                    )
                })
            ]
        });
    } else { //environment de desarrollo (dev en .env)
        return winston.createLogger({
            levels: {
                fatal: 0,
                error: 1,
                warning: 2,
                info: 3,
                http: 4,
                debug: 5
            },
            transports: [
                new winston.transports.Console({ // imprime solo en consola 
                    level: "debug",
                    format: winston.format.combine(
                        winston.format.colorize(), // aplica colores a los niveles
                        winston.format.timestamp({
                            format: moment().format("DD/MM/YYYY HH:mm:ss")
                        }),
                        winston.format.simple()
                    )
                })
            ]
        });
    };
};

const logger = createLogger(config.environment);

export default logger;