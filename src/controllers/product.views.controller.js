import { ProductService} from "../services/services.js";


// VISTA PRODUCTOS 
export const productsViewsController = async (req, res) => {
    try {
        const products = await ProductService.getAllPaginate(req, res)
        
        const user = req.user.user //porque user lo metimos dentro de una variable user en utils, generateToken 
        
        // console.log(user)
        res.render("home", {products, user} );
    } catch (err) {
        res.render("Error del servidor");
    }
};


export const realTimeViewsController = async (req, res) => {
    const products = await ProductService.getAll()
    // console.log(products)
    res.render("realTimeProducts", { products });
};