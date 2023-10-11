import passport from "passport" //traigo libreria
import local from 'passport-local' //traigo estrategia de la libreria
import GitHubStrategy from "passport-github2"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"
import passport_jwt from "passport-jwt"
import { createHash, isValidPassword, extractCookie, generateToken } from '../utils.js'
import config from "./config.js"
import { UserService, CartService } from "../services/services.js"
import nodemailer from "nodemailer"

//variables entorno
const JWT_PRIVATE_KEY = config.keyPrivateJWT
const nodemailerUSER = config.nodemailerUSER
const nodemailerPASS = config.nodemailerPASS
const ADMIN_EMAIL = config.ADMIN_EMAIL


const LocalStrategy = local.Strategy        //estrategia local
const JWTStrategy = passport_jwt.Strategy   //estrategia jwt
const ExtractJWT = passport_jwt.ExtractJwt  //extrae token de cookie


const initializePassport = () => {

    // CONFIG REGISTER
    passport.use('registerPass', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body

        try {
            // BUSCA USUARIO YA REGISTRADO 
            const user = await UserService.getUserEmail({ email: username })
            if (user) {
                console.log('Usuario ya existe')
                return done(null, false)
            }
            // SI NO EXISTE USUARIO, SE REGISTRA UNO NUEVO
            const cartForNewUser = await CartService.createCart({}) //creamos un CARRITO
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                role,
                status: (email == ADMIN_EMAIL) ? "VERIFIED" : "UNVERIFIED",
                password: createHash(password),
                cart: cartForNewUser._id, //al nuevo usuario le asignamos el carrito que armamos mas arriba
                servicio: "local",
                file: "usuario.jpg",
            }

            const result = await UserService.create(newUser)

            //ENVÍO DE EMAIL AL REGISTRARSE
            let configNodemailer = {
                service: "gmail",
                auth: {
                    user: nodemailerUSER,
                    pass: nodemailerPASS
                }
            }
            let transporter = nodemailer.createTransport(configNodemailer)

            let message = {
                from: nodemailerUSER,
                to: email,
                subject: "🍀Validación de cuenta🍀",
                html: `Bienvenido usuario ${email}. Haz click en el siguiente enlace para verificar tu cuenta:
          <a href="http://localhost:8080/api/session/verify-user/${email}">Click Aquí</a>`
            }
            if(email== ADMIN_EMAIL){
                return done(null, result)
            }else{
                
                await transporter.sendMail(message)
                return done(null, result)
            }
        } catch (err) {

        }
    }))

    // CONFIG LOGIN
    passport.use('loginPass', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserService.getUserEmail({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            if(user.status == "UNVERIFIED"){
                console.log("Verifique la cuenta, haciendo click en el link que se envió a su email")
                return done(null, false)
            } 

            const token = generateToken(user) //generatetoken importado de utils, donde mete los datos del user en un token
            user.token = token //a user le agrego este atributo token, asi el user que me devuelve passport ya esta dentro de un token
            return done(null, user)
        } catch (err) {

        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.d5fe56e994ba152a",
        clientSecret: "3ae4422147ceb4569eeec50d72d28d2a78a1e29a",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserService.getUserEmail({ email: profile._json.email })
            if (user) {
                const token = generateToken(user)
                user.token = token
                return done(null, user)
            } else {
                const cartForNewUser = await CartService.createCart({})

                const newUser = await UserService.create({
                    first_name: profile._json.name,
                    last_name: null,
                    email: profile._json.email,
                    password: " ",
                    role: "user",
                    servicio: "GitHub",
                    file: profile._json.avatar_url,
                    cart: cartForNewUser._id
                })
                const token = generateToken(newUser)
                newUser.token = token
                return done(null, newUser)
            }
        } catch (err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))


    passport.use("googlePass", new GoogleStrategy({
        clientID: "677009444232-m39194megnhvte4295dih3j2hhjit2cf.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/api/session/googlecallback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // busca usuarios ya registrados
                const user = await UserService.getUserEmail({ email: profile._json.email })
                // console.log(profile) //profile tiene todos los datos del user de google
                if (user) {
                    const token = generateToken(user)
                    user.token = token
                    if (user) return done(null, user)
                    // registra nuevos usuarios
                } else {
                    const cartForNewUser = await CartService.createCart({})
                    const newUser = await UserService.create({
                        first_name: profile._json.name,
                        last_name: profile._json.family_name,
                        email: profile._json.email,
                        password: " ",
                        role: "user",
                        servicio: "Google",
                        file: profile._json.picture,
                        cart: cartForNewUser._id
                    })

                    const token = generateToken(newUser)
                    newUser.token = token
                    return done(null, newUser)
                }
            } catch (err) {
                return done(`Error to login with Google => ${err.message}`)
            }
        }
    )
    );

        //JWT ESTRATEGY
    // esta estrategia se usa en un middleware asi: ruta, middleware("jwt"), router
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]), //extractCookie importado de utils
        secretOrKey: JWT_PRIVATE_KEY                               //constante de clave secreta importada de config .env
    }, async (jwt_payload, done) => {
        done(null, jwt_payload)                                     //devuelve contenido del jwt
    }))




    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getUserById(id)
        done(null, user)
    })
}

export default initializePassport