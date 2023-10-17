import { productModel } from "../models/product.model.js";

//DAO DE MONGO. 
export default class ProductMongoDAO {
    getAll = async () => await productModel.find().lean().exec();
    getById = async (id) => await productModel.findById(id).lean().exec();
    getAllPaginate = async (req, res) => {
        try {
            const limit = req.query.limit || 10          //limite products 
            const page = req.query.page || 1             //navegar por páginas 
            const sort = req.query.sort || 0             //ordenar por precio
            const stock = req.query.stock || 0           //buscar por disponibilidad
            const category = req.query.category || " "   //buscar categoria

            let query = {};
            if (category) {
                query.category = { $regex: new RegExp(category), $options: "i" }
            };
            if (stock) {
                query.stock = { $lte: stock }
            };

            const result = await productModel.paginate(query, {
                limit: limit, page: page, sort: { price: Number(sort) },
                lean: true,//lean pasa datos con formato de mongo a objetos de js
            })
            result.limit = limit;

            result.prevLink = result.hasPrevPage //link pagina previa, solo si hay pag previa
                ? `/products/views?page=${result.prevPage}&limit=${limit}` //la ruta a la q me lleva
                : "";

            result.nextLink = result.hasNextPage //link pag siguiente, solo si hay pag sig
                ? `/products/views?page=${result.nextPage}&limit=${limit}`
                : "";

            return result;
        } catch (err) {
        }
        res.status(500).json({ status: "error", error: err.message });
    };
    create = async (data) => await productModel.create(data);
    update = async (id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: "after" }); //returnDocument me retorna el documento actualizado luego de actualizar, sino devuelve el documento original
    delete = async (id) => await productModel.findByIdAndDelete(id);
};