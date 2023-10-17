// NO ANDA, SOLO DEMOSTRACION PARA USAR EL FACTORY Y COMANDER
import { ProductManager } from "./fsManager/ProductManager.js";

const productManager = new ProductManager("./Productos.json");

export default class ProductMongoDAO {
    getAll = async () => await productManager.getProduct();
    getById = async (id) => await productManager.getProductById(id);
    // getAllPaginate = async (req, res) => 
    create = async (data) => await productManager.addProduct(data);
    update = async (id, data) => await productManager.updateProduct(id, data);
    delete = async (id) => await productManager.deleteProduct(id);
};