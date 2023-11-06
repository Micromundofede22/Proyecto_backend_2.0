
import { CartService } from "../services/services.js"


// VISTA CARRITO CON PRODUCTOS
export async function cartViewController (req, res) {
    try {
        const cid = req.params.cid;
        const cartSinPop = await CartService.getById(cid); //muestra carrito con su id y products
        
        const cart= await cartSinPop.populate("products.product");//aplico populate acá
       if (cart){
        const cartProducts= { products: cart.products.map(prod => prod.toObject())}; //hago un nuevo objeto por cada producto, y le aplico la propiedad products. toObject me permite enviar el json a formato objeto para visualizarlos
        const user = req.user.user; 
        res.render("cart", { cartProducts,user, lean: true});
    }else{
        res.status(401).render("errors/base", {error:"No existe carrito"});
    };
    } catch (error) {
        res.render("Error del servidor");
    };
};


export const cartRealTimeController = async (req, res) => {
    //NO RENDERIZA BIEN
    const cid = req.params.cid;
    const cartSinPop= await CartService.getById(cid);

    const cart= await cartSinPop.populate("products.product");
    // console.log(cartSinPop)
    if (cart){
        const cartProducts= { products: cart.products.map(prod => prod.toObject())}; 
        // console.log(cartProducts.products);
        const products= cartProducts.products;
        req.app.get("socketio").emit("updateCart", products);
        const user = req.user.user; 
        res.render("realTimeCart", { products, user, lean: true });
    }else{
        res.status(401).render("errors/base", {error:"No existe carrito"});
    }
};