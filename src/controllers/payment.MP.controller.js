import dayjs from 'dayjs';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { CartService, ProductService } from '../services/services.js';
import config from '../config/config.js';


const TOKEN_MP= config.TOKEN_MP;


export const createSessionController = async (req, res) => {
    try {
        const cid = req.user.user.cart.toString();
        const cart = await CartService.getByIdPopulate(cid);

        const items = []; //productos con stock

        const promises = cart.products.map(async (item) => {
            const product = await ProductService.getById(item.product._id.toString());
            // // console.log(product)
            //solo pasan a ser cobrados los productos que tengan stock disponibles
            if (item.quantity <= product.stock) {
                return items.push({
                    title: item.product.title.toString(),
                    description: item.product.description.toString(),
                    currency_id: "ARS",
                    unit_price: item.product.price,
                    quantity: item.quantity
                });
            };
        });

        Promise.all(promises)
            .then(async () => {
                //se necesitan dos cuentas de pruebas (vendedor y comprador)
                //APP DE CONEXIÓN ESTÁ EN CUENTA DE PRUEBA, NO EN LA REAL!!!
                const client = new MercadoPagoConfig(
                    {
                        //app de prueba del vendedor de prueba
                        accessToken: TOKEN_MP,
                        // options: { timeout: 5000, idempotencyKey: 'abc' }
                    });
                const preference = new Preference(client);
                const result = await preference.create(
                    {
                        body: {
                            items: items,

                            payer: {
                                email: req.user.user.email,
                                date_created: dayjs().format("DD/MM/YYYY HH:mm")
                            },
                            //httpS obtenido del comando en consola ./ngrok.exe http 8080 (ngrok es un aplicable que descargue)
                            //mercado pago exije https con protocolo TSL (ex SSL) 
                            notification_url: "https://7962-186-109-253-73.ngrok.io/api/payment/mercado-pago/webhook",

                            back_urls: {
                                //success y failure redirecciono a rutas hechas de STRIPE
                                success: 'http://localhost:8080/api/payment/success',
                                failure: `http://localhost:8080/api/payment/cancel`,
                                pending: "http://localhost:8080/api/payment/mercado-pago/pending"
                            }
                        }
                    });
                res.send(result);
            });

    } catch (error) {
        res.sendServerError(error.message);
    };
};


export const receiveWebhookController = async (req, res) => {
    //acá mercado pago manda sus  peticiones y notificaciones 
    const client = new MercadoPagoConfig(
        {
            accessToken: 'TEST-6895694728315385-111508-5e8ce9cea08d7576f544cabffb4c4731-1547725386',
            // options: { timeout: 5000, idempotencyKey: 'abc' }
        });
    const pagoMP = new Payment(client);

    //mercado pago manda a mi servidor dos peticiones por query, la segunda type payment la capturo
    const payment = req.query;
    // console.log(payment);
    try {
        if (payment.type === "payment") {
            const data = await pagoMP.get({ id: payment["data.id"] });
            console.log(data)
        }
        res.sendSuccess("ok")
    } catch (error) {
        res.sendServerError(error.message);
    }
}


export const pendingController = (req, res) => {
    res.json({ payload: "pendiente" });
};



