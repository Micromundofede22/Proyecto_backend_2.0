import passport from "passport"; //traigo libreria
import local from 'passport-local'; //traigo estrategia de la libreria
import GitHubStrategy from "passport-github2";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import passport_jwt from "passport-jwt";
import { createHash, isValidPassword, extractCookie, generateToken } from '../utils.js';
import config from "./config.js";
import { UserService, CartService } from "../services/services.js";
import { sendEmailValidation } from "../services/nodemailer/nodemailer.js";
import dayjs from "dayjs";


//variables entorno
const JWT_PRIVATE_KEY = config.keyPrivateJWT;
const ADMIN_EMAIL = config.ADMIN_EMAIL;
const CLIENTID= config.CLIENTID;
const CLIENTSECRET= config.CLIENTSECRET;
const CALLBACKURL= config.CALLBACKURL
const GOOGLECLIENTID= config.GOOGLECLIENTID;
const GOOGLECLIENTSECRET= config.GOOGLECLIENTSECRET;
const GOOGLECALLBACKURL= config.GOOGLECALLBACKURL


const LocalStrategy = local.Strategy;        //estrategia local
const JWTStrategy = passport_jwt.Strategy;   //estrategia jwt
const ExtractJWT = passport_jwt.ExtractJwt;  //extrae token de cookie


const initializePassport = () => {

    // CONFIG REGISTER
    passport.use('registerPass', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
            // BUSCA USUARIO YA REGISTRADO 
            const user = await UserService.getUserEmail({ email: username });
            if (user) {
                console.log('Usuario ya existe')
                return done(null, false)
            };
            // SI NO EXISTE USUARIO, SE REGISTRA UNO NUEVO
            const cartForNewUser = await CartService.createCart({}); //creamos un CARRITO
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                role,
                verifiedAccount: (email == ADMIN_EMAIL) ? "VERIFIED" : "UNVERIFIED",
                password: createHash(password),
                cart: cartForNewUser._id, //al nuevo usuario le asignamos el carrito que armamos mas arriba
                servicio: "local",
                file: "usuario.jpg",
            };
            const result = await UserService.create(newUser);

            if (email == ADMIN_EMAIL) return done(null, result);
            else {
                await sendEmailValidation(email,first_name.toUpperCase() );
                return done(null, result);
            };
        } catch (err) {

        };
    }));

    // CONFIG LOGIN
    passport.use('loginPass', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserService.getUserEmail({ email: username });
            if (!user) return done(null, false);
            if (!isValidPassword(user, password)) return done(null, false);
            if (user.verifiedAccount == "UNVERIFIED") {
                console.log("Verifique la cuenta, haciendo click en el link que se envió a su email")
                return done(null, false);
            };
            await UserService.updateUser(user._id, {last_connection: dayjs()} );
            const token = generateToken(user); //generatetoken importado de utils, donde mete los datos del user en un token
            user.token = token; //a user le agrego este atributo token, asi el user que me devuelve passport ya esta dentro de un token
            return done(null, user);
        } catch (err) {

        };
    }));

    passport.use("github", new GitHubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: CALLBACKURL
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserService.getUserEmail({ email: profile._json.email });
            if (user) {
                const token = generateToken(user);
                user.token = token;
                return done(null, user);
            } else {
                const cartForNewUser = await CartService.createCart({});

                const newUser = await UserService.create({
                    first_name: profile._json.name,
                    last_name: null,
                    email: profile._json.email,
                    password: " ",
                    role: "user",
                    servicio: "GitHub",
                    file: profile._json.avatar_url,
                    cart: cartForNewUser._id
                });
                const token = generateToken(newUser);
                newUser.token = token;
                return done(null, newUser);
            }
        } catch (err) {
            return done(`Error to login with GitHub => ${err.message}`);
        };
    }));


    passport.use("googlePass", new GoogleStrategy({
        clientID: GOOGLECLIENTID,
        clientSecret: GOOGLECLIENTSECRET,
        callbackURL: GOOGLECALLBACKURL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // busca usuarios ya registrados
                const user = await UserService.getUserEmail({ email: profile._json.email });
                // console.log(profile) //profile tiene todos los datos del user de google
                if (user) {
                    const token = generateToken(user);
                    user.token = token;
                    if (user) return done(null, user);
                    // registra nuevos usuarios
                } else {
                    const cartForNewUser = await CartService.createCart({});
                    const newUser = await UserService.create({
                        first_name: profile._json.name,
                        last_name: profile._json.family_name,
                        email: profile._json.email,
                        password: " ",
                        role: "user",
                        servicio: "Google",
                        file: profile._json.picture,
                        cart: cartForNewUser._id
                    });

                    const token = generateToken(newUser);
                    newUser.token = token;
                    return done(null, newUser);
                }
            } catch (err) {
                return done(`Error to login with Google => ${err.message}`);
            }
        }));

    //JWT ESTRATEGY
    // esta estrategia se usa en un middleware asi: ruta, middleware("jwt"), router
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),  //extractCookie importado de utils
        secretOrKey: JWT_PRIVATE_KEY                                 //constante de clave secreta importada de config .env
    }, async (jwt_payload, done) => {
        done(null, jwt_payload);                                     //devuelve contenido del jwt
    }));


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getUserById(id);
        done(null, user);
    });
};

export default initializePassport;