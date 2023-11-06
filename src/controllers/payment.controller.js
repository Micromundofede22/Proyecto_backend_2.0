import Stripe from "stripe";
import config from "../config/config.js";
import { CartService, ProductService } from "../services/services.js";
import logger from "../loggers.js";

const KEY_STRIPE = config.KEY_STRIPE;

const stripe = new Stripe(KEY_STRIPE);


export const createSessionController = async (req, res) => {
    try {

        const cid = req.user.user.cart.toString();
        const cart = await CartService.getByIdPopulate(cid);

        const line_items= []

        const promises = cart.products.map(async (item) => {
            const product = await ProductService.getById(item.product._id.toString());
            // // console.log(product)
            if (item.quantity <= product.stock) {
                return line_items.push({
                    price_data: {
                        product_data: {
                            name: item.product.title.toString(),
                            description: item.product.description.toString()
                        },
                        currency: "usd",
                        unit_amount: 900000
                    },
                    quantity: item.quantity
                });
            };
        });
        // console.log(Array.isArray(line_items) )
        

        Promise.all(promises)
            .then(async () => {
                // console.log(line_items)
              const session= await stripe.checkout.sessions.create({

                    line_items: line_items,
                    mode: "payment",
                    success_url: 'http://localhost:8080/api/payment/success',
                    cancel_url: 'http://localhost:8080/api/payment/cancel'
                });

                return res.json(session);
            })
            .catch((error) => console.log(error))

    } catch (error) {
        logger.error(error.message);
        res.sendServerError(error.message);
    };

};

export const successPaymentController = (req, res) => {
    const user= req.user.user;
    res.render("payment/success", {user});
};

export const cancelPaymentController = (req, res) => {
    const user= req.user.user;
    res.render("payment/cancel", {user});
};