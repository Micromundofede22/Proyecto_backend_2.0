import AppRouter from "./appRouter.js";
import passport from "passport";
import { passportCall } from "../middleware/passportCall.js";
import { uploader } from "../middleware/multer.js";
import {
    postLogin,
    getFailLogin,
    postRegister,
    getFailRegister,
    getGitHub,
    gitHubCallback,
    getGoogle,
    googleCallback,
    getLogout,
    getCurrent,
    roleChange,
    cargaImage,
    postOlvidar,
    verifyToken,
    restablecerContra,
    getVerifyUser
} from "../controllers/session.controller.js"


export default class SessionRouter extends AppRouter {
    init() {
        // API login
        this.post('/login',
            passport.authenticate('loginPass', { failureRedirect: '/api/session/failLogin',  }),
            postLogin)

        this.get('/failLogin', getFailLogin)

        // API register en DB
        this.post('/register',
            passport.authenticate('registerPass', { failureRedirect: '/api/session/failRegister' }),
            postRegister)

        //VERIFICAR CUENTA
        this.get("/verify-user/:user", getVerifyUser)
        this.get('/failRegister', getFailRegister)

        //GIT
        this.get("/github",
            passport.authenticate("github", { scope: ["user:email"] }),
            getGitHub)

        this.get('/githubcallback',
            passport.authenticate('github', { failureRedirect: '/api/session/failLogin' }),
            gitHubCallback
        )

        //GOOGLE
        this.get("/google",
            passport.authenticate("googlePass", {
                scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile"
                ],
                session: false
            }),
            getGoogle)

        this.get("/googlecallback",
            passport.authenticate("googlePass", { failureRedirect: '/api/session/failLogin' }),
            googleCallback)

        //CERRAR SESIÓN
        this.get('/logout', getLogout)

        //DATA CLIENTE
        this.get("/current", getCurrent)

        //Subir foto perfil
        this.post("/current/cargaimage",
        uploader.single("file"), //uploader.single("file") es el middleware de MULTER para subir fotos. "file, porque en el formulario el name es file"
        passportCall("jwt"),
        cargaImage)

        //CAMBIO DE ROL
        this.post("/current/rolechange",
        passportCall("jwt"),
        roleChange)

        //Olvidar contraseña
        this.post("/olvidar-contra", postOlvidar)

        //Verificación token enviado por email
        this.get("/verify-token/:token", verifyToken)

        //Reestablecer contraseña
        this.post("/restablecer-contra/:user", restablecerContra )
    }
}