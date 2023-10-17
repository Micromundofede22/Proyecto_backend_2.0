import config from "../config/config.js";       //aquí esta la variable de entorno persistencia

export let ProductDAOFactory;                   //variable dinámica que se usa en el service, asi el dao se vuelve dinámico

switch (config.persistence) {
    case "MONGO": //si persistencia es mongo, se importa su dao
        const { default: ProductMongoDAO } = await import("../dao/product.mongo.DAO.js"); // importación dinámica del DAO, en este ejemplo es persistencia de los productos en mongo
        ProductDAOFactory = ProductMongoDAO;
        break;

    case "FILE": //NO ANDA, SOLO DE PRUEBA
        const { default: ProductFileDAO } = await import("../dao/product.fs.DAO.js")
        ProductDAOFactory = ProductFileDAO;

    default:
        break;
};