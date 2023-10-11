import EErrors from "../services/errors/enums_error.js"; //importo diccionario de errores
import logger from "../loggers.js";


export default(error, req, res, next) => {
    // console.log(error.cause)
    switch(error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).json({ status: 'error', error: error.name, cause: error.cause })
            logger.error(error.cause, error.name )
            break

        case EErrors.DB_ERROR:
            res.status(404).json({status: "error", error: error.name, cause: error.cause})
            logger.error(error.cause ) 
            
        default:
            res.status(500).json({ status: 'error', error: 'Unhandled error' })
            break
    }
}

