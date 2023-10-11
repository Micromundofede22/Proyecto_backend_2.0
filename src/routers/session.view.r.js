import AppRouter from "./appRouter.js";
import {
    getLoginViews,
    getRegisterViews,
    getRestablecerViews
} from "../controllers/session.views.controller.js";


export default class SessionViewsRouter extends AppRouter{
    init(){
        // Vista de Login
        this.get('/login', getLoginViews)
        //Vista para registrar usuarios
        this.get('/register', getRegisterViews)
        //Vista olvidar contraseña
        this.get("/olvidar", getRestablecerViews)
    }
}