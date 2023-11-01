import { ProductService } from "../services/services.js";
import {sendEmailDeleteProduct} from "../services/nodemailer/nodemailer.js"
// testing errores
import CustomError from "../services/errors/custom_error.js"; //clase que crea errores
import EErrors from "../services/errors/enums_error.js"; //diccionario errores
import {
    generateProductsErrorInfo,
} from "../services/errors/info_error.js" //info de errores al generar products
import logger from "../loggers.js";



// busqueda por query todos los productos
export const getAllProductsController = async (req, res) => {
    try {
        // const result = await getProduct(req, res)
        const result = await ProductService.getAllPaginate(req, res);
        logger.info("Success");
        res
            .status(200)
            .json({
                status: "success",
                payload: result,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            })
    } catch (error) {
        res.sendServerError(error.message);
    }
}

// busqueda por params
export const getProductByIdController = async (req, res) => {
    try {
        const id = req.params.pid;
        const result = await ProductService.getById(id);

        if (id === null || id < 0) {
            return res.sendRequestError(`El id ${id} no es un caracter aceptable`);
        } else {
            logger.info("success");
            res.sendSuccess(result);
            req.app.get("socketio").emit("updateProducts", await ProductService.getAll()); //socketio (servidor), emite un objeto updateProducts al cliente, cuyo socket escucha en el script de la vista realTime
        }
    } catch (error) {
        res.sendServerError(error.message);
    }
}

// crear productos
export const createProductController = async (req, res, next) => { //next, para que error pase al middleware del error
    try {
        const data = req.body;
        //si usuario premium crea el producto, se guarda su email en el campo owner
        if (req.user.user.role == "premium") data.owner = req.user.user.email;
        //si hay file, se guara en thumbnails
        if (req.file) data.thumbnails = req.file.filename;

        // GESTION DE ERRORES MEDIANTE EL MIDDLEWARE DE ERRORES
        if (!data.title ||
            !data.description ||
            !data.price ||
            !data.code ||
            !data.stock ||
            !data.category) {
            logger.error("Error al crear el producto");
            CustomError.createError({                   //custom creador del error
                name: "Error al crear Productos",       // nombre error
                cause: generateProductsErrorInfo(data), //en cause va la info que genere en info
                message: "Error al crear un producto",  //mensaje corto
                code: EErrors.INVALID_TYPES_ERROR       //tipo de error numerado en diccionario
            });
        };

        const result = await ProductService.create(data);
        logger.info("success");
        res.createdSuccess(result);
        // SOKETIO
        const updateProducts = await ProductService.getAll();
        req.app.get("socketio").emit("updateProducts", updateProducts);
    } catch (error) {
        next(error);
    }
}

// ACTUALIZAR PRODUCTOS
export const updateProductController = async (req, res) => {
    try {
        //USUARIO PREMIUM
        if (req.user.user.role === "premium") {
            const id = req.params.pid;
            const data = req.body;
            const product = await ProductService.getById(id);
            if (product == null) {
                logger.error(`El producto con id ${id} no se encontró`);
                return res.sendRequestError(`El producto con id ${id} no se encontró`);
            }
            if (product.owner == req.user.user.email) {
                const result = await ProductService.update(id, data);
                logger.info("success");
                res.sendSuccess(result);
                req.app.get("socketio").emit("updateProducts", await ProductService.getAll());
            } else {
                return res.unauthorized("El producto no es de su autoría");
            };
        };
        //ADMINISTRADOR
        const id = req.params.pid;
        const data = req.body;
        const product = await ProductService.getById(id);
        if (product == null) {
            return res.sendRequestError(`El producto con id ${id} no se encontró`);
        } else {
            const result = await ProductService.update(id, data);
            logger.info("success");
            res.sendSuccess(result);
            req.app.get("socketio").emit("updateProducts", await ProductService.getAll());
        }
    } catch (error) {
        logger.error("error");
        res.sendServerError(error.message);
    }
}

// ELIMINAR PRODUCTOS
export const deleteProductController = async (req, res) => {
    try {
        //USUARIO PREMIUM
        if (req.user.user.role == "premium") {
            const id = req.params.pid;
            const product = await ProductService.getById(id);
            // console.log(product)
            if (product == null) {
                return res.sendRequestError(`El producto con id ${id} no se encontró`);
            }
            if (product.owner === req.user.user.email) {
                const result = await ProductService.delete(id);
                logger.info("success");
                res.sendSuccess(result);
            } else {
                logger.info("error, no autorizado");
                return res.unauthorized("El producto no es de su autoría"); //respuesta proviene class AppRouter
            }
        }
        //ADMINISTRADOR
        const id = req.params.pid;
        const product = await ProductService.delete(id);
        const email= product.owner;
        if (product == null) return res.sendRequestError(`El producto con id ${id} no se encontró`);
        if (product.owner != "admin") sendEmailDeleteProduct(product, email);
        res.sendSuccess(product);
        logger.info("success");
        req.app.get("socketio").emit("updateProducts", await ProductService.getAll());

    } catch (error) {
        res.sendServerError(error.message);
    }
}