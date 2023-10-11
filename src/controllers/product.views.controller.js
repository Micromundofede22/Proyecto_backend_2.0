import { ProductService, UserService } from "../services/services.js";


// VISTA PRODUCTOS 
export const productsViewsController = async (req, res) => {
    try {
        const result = await ProductService.getAllPaginate(req, res)
// console.log(result)
        const user = req.user.user //porque user lo metimos dentro de una variable user en utils, generateToken 
        // console.log(user)
        res.render("home", { products: result, user });
    } catch (err) {
        res.render("Error del servidor")
    }
}


export const realTimeViewsController = async (req, res) => {
    const products = await ProductService.getAll()
    // console.log(products)
    res.render("realTimeProducts", { products });
}