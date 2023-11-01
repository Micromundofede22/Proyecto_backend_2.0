import {
    CartService,
    ProductService,
    TicketService,
    UserService
} from "../services/services.js";
import logger from "../loggers.js";
import { sendEmailTiketPurchase } from "../services/nodemailer/nodemailer.js";

// Crear carrito
export const createCartController = async (req, res) => {
    try {
        const data = req.body;
        const result = await CartService.createCart(data);
        res.createdSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
        logger.error(error.message);
    }
};

// Trae carrito
export const getCartController = async (req, res) => {
    try {
        const id = req.params.cid;
        const result = await CartService.getByIdPopulate(id);
        const user = req.user.user;

        if ((result._id).toString() !== user.cart) return res.sendRequestError("El id del Usuario no coincide con nuestra base de datos")

        if (id == null) return res.sendRequestError(`El id ${id} no se encuentra`);

        res.sendSuccess(result);

    } catch (error) {
        res.sendServerError(error.message);
        logger.error(error.message);
    }
};

//AGREGAR PRODUCTOS AL CARRITO
export const createInCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.user.user;
        const cart = await CartService.getById(cid);
        const product = await ProductService.getById(pid.toString());

        if ((cart._id).toString() !== user.cart) return res.sendRequestError("El id del Usuario no coincide con nuestra base de datos");
        if (user.email == product.owner) return res.sendRequestError("Usted no puede comprar productos de su autoría");
        let acum = 0;
        cart.products.map((datos) => {
            if (datos.product == pid) {
                acum++;
                datos.quantity++;
            };
        });

        if (acum === 0) cart.products.push({ product: pid, quantity: 1 });

        await CartService.updateCart({ _id: cid }, cart);      //1ero actualizo el carrito
        const result = await CartService.getByIdPopulate(cid); //2do lo busco. Populateo la info de product en products para que aparezca en el carrito y asi se relacionen ambas bases de datos(cart y products)
        res.sendSuccess(result);                               //3ero lo mando al json
        req.app.get("socketio").emit("updateCart", await CartService.getByIdPopulate(cid));
    } catch (error) {
        res.sendServerError(error.message);
    };
};

// ELIMINA UN PRODUCTO
export const deleteOneProductController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.user.user;

        let cart = await CartService.getById(cid);
        if ((cart._id).toString() !== user.cart) return res.sendRequestError("El id del Usuario no coincide con nuestra base de datos");

        if (cart == null) {
            logger.error("Carrito no se encuentra");
            return res.sendRequestError(`El id ${cid} no se encuentra`);
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid); //busca indice del product a eliminar
        if (productIndex >= 0) { //esto es por si findIndex no encuentra y tira -1.
            cart.products.splice(productIndex, 1); //splice primer parámetro es el indice desde donde se elimina, 2do parametro cuantos elementos quiero eliminar
            await CartService.updateCart({ _id: cid }, cart);
        }

        const result = await CartService.getByIdPopulate(cid);
        console.log(result)
        req.app.get("socketio").emit("updateCart", result);
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    };
};

//ELIMINA TODOS PRODUCTOS
export const deleteCartController = async (req, res) => {
    try {
        const cid = req.params.cid;
        await CartService.updateCart({ _id: cid }, { products: [] }); //array vacío
        const result = await CartService.getByIdPopulate(cid);
        res.sendSuccess(result);
        req.app.get("socketio").emit("updateCart", await CartService.getByIdPopulate(cid));
    } catch (error) {
        res.sendServerError(error.message);
        logger.error(error.message);
    }
};

// Actualizo cantidades de un producto
export const updateQuantityController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const data = req.body;
        const user = req.user.user;

        const valor = data.quantity; //extraigo el valor de quantity
        const cart = await CartService.getById(cid);

        if ((cart._id).toString() !== user.cart) return res.sendRequestError("El id del Usuario no coincide con nuestra base de datos");

        cart.products.map((data) => {
            if (data.product == pid) {
                data.quantity = valor;
            };
        });
        await CartService.updateCart({ _id: cid }, cart);
        const result = await CartService.getByIdPopulate(cid);
        res.sendSuccess(result);
        req.app.get("socketio").emit("updateCart", await CartService.getByIdPopulate(cid));
    } catch (error) {
        res.sendServerError(error.message);
        logger.error(error.message);
    };
};

//GENERA TICKET DE COMPRA
export const purchaseController = async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartService.getByIdPopulate(cid);

        let montoTotal = [];
        let productsComprados = [];

        const promises = cart.products.map(async (data) => {
            let listProduct = await ProductService.getById((data.product._id).toString())    //traigo el product de la coleccion producto, ya q en cart solo hay referencias. toString()permite que se transforme a string porque esta en formato objeto

            //modifico stock de product en coleccion productos
            if (data.quantity <= listProduct.stock) {                                        //data es de cart y listproduct de coleccion productos
                const quantity = listProduct.stock - data.quantity;
                listProduct.stock = quantity;
                await ProductService.update(listProduct._id, listProduct);                    //stock del producto modificado

                //calculo monto de cada producto
                const mount = (listProduct.price * data.quantity);
                montoTotal.push(mount);

                //ingreso los products comprados a este array antes de eliminarlos del cart
                productsComprados.push({ product: listProduct._id, quantity: data.quantity });
                
                //eliminar products comprados del carrito
                const index = await cart.products.findIndex((item) => item.product.toString() === listProduct._id.toString()); //busca indice del product a eliminar
                // const index= cart.products.indexOf((listProduct._id).toString());
                console.log(index);

                if (index >= 0) {
                    //mayor a 0, por si findIndex no encuentra el producto, tira -1 y me rompe el codigo
                    await cart.products.splice(index, 1);
                    
                    await CartService.updateCart({ _id: (cart._id).toString() }, cart); //solo quedan los productos que no tienen stock
                };
            };
        });

        //cuando todas las promesas anteriores se cumplan...
        Promise.all(promises)
            .then(async () => {
                //DATA TICKET
                //MONTO TOTAL
                const sumaMount = montoTotal.reduce((acc, elem) => acc + elem, 0);

                //EXTRAER EMAIL
                const users = await UserService.getUser(); //traigo usuarios
                const user = users.filter((data) => data.cart == (cart._id).toString()); //filtro el usuario que tiene el carrito en cuestion
                const email = user[0].email; //entro al array que tiene mi user en la posicion 0, y luego a su propiedad email

                //CODE AUTOINCREMENTAL
                const tickets = await TicketService.getAll();
                const code = tickets.length > 0
                    ? Number(tickets[tickets.length - 1].code) + 1  //length es cantidad. al restarle 1, me deja en el indice final, y al code de ese objeto final le sumo 1
                    : 1;


                //CREACIÓN TICKET
                if (sumaMount > 0) {
                    const newTicket = await TicketService.create({
                        code: code.toString(),
                        amount: sumaMount,
                        purcharser: email,
                        products: productsComprados
                    });
                    //busco el ticket en la base de datos
                    const ticket = await TicketService.getByData({ code: newTicket.code });
                    //envio mail con ticket
                    await sendEmailTiketPurchase(ticket);
                    logger.info("Purchase success");
                    req.app.get("socketio").emit("updateCart", await CartService.getByIdPopulate(cid));
                    res.sendSuccess({sinStock: cart.products});
                } else {
                    res.sendRequestError("El monto debe superar los $0");
                }

            }).catch((error) => {
                logger.error(error.message);
                res.sendError("Error en promesas iterables");
            })

    } catch (error) {
        res.sendServerError(error.message);
        logger.error(error.message);
    };
};