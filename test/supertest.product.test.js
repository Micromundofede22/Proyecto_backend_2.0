import chai from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import config from "../src/config/config.js";

//variables de entorno
const PORT = config.PORT;
const ADMIN_EMAIL = config.ADMIN_EMAIL;
const ADMIN_PASS = config.ADMIN_PASSWORD;
const COOKIE_NAME = config.cookieNameJWT;


const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing Ecommers Micromundo - Ruta /api/products ", () => {
    let cookie;
    const user = {
        email: ADMIN_EMAIL,
        password: ADMIN_PASS
    }
    const newProduct = {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 1000, max: 10000 }),
        code: faker.string.alphanumeric(8),
        category: faker.commerce.productName(),
        stock: faker.number.int(50),
        status: faker.datatype.boolean(),
    };
    const productId = "6543e753acf81bfbcdbfdb27";

    it("Logueo de user para acceder a los products", async () => {              //testeamos la autorización del endpoint
        const result = await requester.post("/api/session/login").send(user); //solicitante
        const cookieResult = result.headers["set-cookie"][0];
        // console.log(cookieResult);
        expect(cookieResult).to.be.ok;                                        //respuesta esperada
        cookie = {
            name: cookieResult.split("=")[0], //Cookie tiene este formato name=valor
            value: cookieResult.split("=")[1]
        }
        expect(cookie.name).to.be.ok.and.eql(COOKIE_NAME);
        expect(cookie.value).to.be.ok;
    })


    it("- Method GET - Debería devolver Status 200 si existen Productos que mostrar", async () => {
        const response = await requester
            .get("/api/products/")
            .set("Cookie", [`${cookie.name}=${cookie.value}`]); //envío al endpoint la cookie, asi autoriza
        expect(response.status).to.equal(200);
    });

    it('- Method GET BY ID- Debe devolver un producto por su ID', async () => {
        const { _body } = await requester
            .get(`/api/products/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(_body.payload).to.be.ok;
    });


    it('- Method POST - Debe registrar un producto', async () => {
        const response = await requester
            .post("/api/products/")
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
            .send(newProduct)
        expect(response.status).to.equal(201);
    });

    it('- Method PUT / debe editar un producto', async () => {
        const { _body } = await requester //status, _body y ok, son propiedades que me da test
            .put(`/api/products/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`])
            .send({ "title": "Editado TEST" })
        // console.log(_body)
        expect(_body.payload.title).to.equal("Editado TEST");
    });
})

