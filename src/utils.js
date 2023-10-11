import bcrypt from 'bcrypt'; //hashea contraseñas 
import jwt from "jsonwebtoken"; //JsonWebToken
import config from "./config/config.js"; 
import { fakerES as faker} from '@faker-js/faker'; //testing
//DIRNAME
import {fileURLToPath} from 'url'; // método que decodifica una url en una cadena de ruta
import { dirname, join } from 'path';    // dirnmame devuelve la ruta absoluta donde se encuentra el archivo actual. Join une varios fragmentos en una unica ruta


//variables de entorno
const JWT_COOKIE_NAME = config.cookieNameJWT;
const JWT_PRIVATE_KEY = config.keyPrivateJWT;

//DIRNAME
//1. obtengo la ruta absoluta de mi archivo. fileURLToPath me crea una ruta.
//import.meta.url apunta a mi archivo actual
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename); //ruta de la carpeta del archivo actual
// export const __dirname = join(srcDirname, "..") // agregar fragmentos a la ruta actual



// hashea contraseña
export const createHash = password => { //crea hash y se usa en la config de passport
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //cantidad de caracteres que quiero que tenga
}

// validacion
export const isValidPassword = (user, password) => {   //valida la contraseña y se usa en config de passport
    return bcrypt.compareSync(password, user.password)
}

// generar un token con los datos del user (se usa en passport config)
export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' }) //mete al user dentro de user
    return token
}

//genera un string random, como lo hace la libreria jwt, pero manual, me sirve como token
export const generateRandomString= (num)=>{
    return [...Array(num)].map(()=>{
        const randomNum= ~~(Math.random()* 36)
        return randomNum.toString(36)
    })
    .join("")
    .toUpperCase()
}


// extraer token de cookie (se usa en la estrategy de JWT en passport config)
export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

//FAKER, MOCK DATOS FALSOS PARA PRUEBAS 
export const generateUser= () =>{
    return{

        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(5),
        status:  faker.datatype.boolean(),
        stock: faker.number.int({ max: 50 }),
        category: faker.commerce.productAdjective(),
        thumbnails: [faker.image.avatarLegacy()]
    }

    
}