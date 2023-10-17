import AppRouter from "./appRouter.js";
import logger from "../loggers.js";

//endpoint para corroborar que logger esta ok. Pero no tiene funcionalidad
export default class LoggerRouter extends AppRouter{
    init(){
        this.get("/", (req,res)=>{
            logger.debug("DEBUG")
            logger.http("HTTP")
            logger.info("INFO")
            logger.warning("WARNING")
            logger.error("ERROR")
            logger.fatal("FATAL")
        
            res.status(404).json({status: "error", error: err})
        })
    }
}