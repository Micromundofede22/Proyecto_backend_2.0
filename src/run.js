import { handlePolicies } from "./middleware/auth.middleware.js";
import { passportCall } from "./middleware/passportCall.js";
import ProductRouter from "./routers/product.r.js";
import CartRouter from "./routers/cart.r.js";
import SessionRouter from "./routers/session.r.js";
import SessionViewsRouter from "./routers/session.view.r.js";
import ProductViewRouter from "./routers/product.view.r.js";
import CartViewRouter from "./routers/cart.view.r.js";
import ChatRouter from "./routers/chat.r.js";
import MockRouter from "./routers/mock.r.js";
import LoggerRouter from "./routers/logger.r.js";
import { messagesModel } from "./models/message.model.js";
import errorMiddleware from "./middleware/error.middleware.js";
import UserRouter from "./routers/users.r.js";
import PaymentRouter from "./routers/payment.r.js";




const run = (io, app) => {
    app.use((req, res, next) => {
        req.io = io;
        next();
    });

    //Instancia de routers
    const sessionRouter = new SessionRouter();
    const productRouterClass = new ProductRouter();
    const cartRouter = new CartRouter();
    const userRouter = new UserRouter();
    const sessionViewsRouter = new SessionViewsRouter();
    const productViewRouter = new ProductViewRouter();
    const cartViewRouter = new CartViewRouter();
    const chatRouter = new ChatRouter();
    const mockRouter = new MockRouter();
    const loggerRouter = new LoggerRouter();
    const paymentRouter= new PaymentRouter();

    app.get("/", (req, res) => { res.render("sessions/login") });

    //ENDPOINT con routers
    app.use("/api/session", sessionRouter.getRouter());                            //getRouter() viene de la clase padre AppRouter, e inicializa el router                                         
    app.use('/api/products', passportCall("jwt"), productRouterClass.getRouter());
    app.use('/api/carts', passportCall("jwt"), cartRouter.getRouter());
    app.use('/api/users', passportCall("jwt"), userRouter.getRouter());
    app.use('/api/payment', paymentRouter.getRouter());
    app.use("/session", sessionViewsRouter.getRouter());
    app.use("/products", passportCall("jwt"), productViewRouter.getRouter());
    app.use("/cart", passportCall("jwt"), cartViewRouter.getRouter());
    app.use("/chat", passportCall("jwt"), handlePolicies(["USER", "PREMIUM"]), chatRouter.getRouter());
    app.use("/mockingproducts", mockRouter.getRouter());
    app.use("/loggerTest", loggerRouter.getRouter());
    // app.use("/cluster", clusterRouter)

    app.use(errorMiddleware);  //custom errors siempre al final de todos los use y routers, ya que atrapa los custom errors




    //CONEXIÓN SOCKET-IO
    io.on('connection', async (socket) => { //servidor escucha cuando llega una nueva conexion

        // console.log("nuevo cliente")
        // IO escucha el evento products emitido por el cliente socket
        socket.on('products', data => {
            //IO emite el evento updateProducts a todos los clientes socket
            io.emit('updateProducts', data);
        });
        socket.on('item', data => {
            io.emit('updateCart', data);
        });

        //CHAT
        let messages = (await messagesModel.find()) ? await messagesModel.find() : [];
        socket.broadcast.emit('alerta'); //es una 3era emisión que avisa a todos menos a quien se acaba de conectar. (las otras dos son socket.emit y io.emit) io es el servidor y socket el cliente
        socket.emit('logs', messages); //solo emite a ese cliente el historial, (no a todos, sino se repetiria el historial)
        socket.on('message', data => { //cuando cliente me haga llegar un mensaje, lo pusheo
            messages.push(data);
            messagesModel.create(messages);
            io.emit('logs', messages); // y el servidor io emite a todos el historial completo
        });
    });
};

export default run;



