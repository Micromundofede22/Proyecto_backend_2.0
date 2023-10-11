import fs from "fs"


export class ProductManager {
    constructor(path) {
        this.path = path,
            this.formato = "utf-8"
    }

    // GENERA ID
    generateId = async () => {
        let arrayProductos = await this.getProduct()
        return (arrayProductos.length === 0)
            ? 1
            : arrayProductos[arrayProductos.length - 1].id + 1
    }

    // AGREGA PRODUCTOS
    addProduct = async (title, description, code, price, status, stock, category, thumbnails) => {
        const producto = await this.getProduct()
        producto.push({ id: await this.generateId(), title, description, code, price, status, stock, category, thumbnails })
        return await fs.promises.writeFile(this.path, JSON.stringify(producto, null, '\t'))
    }

    // TRAE PRODUCTOS
    getProduct = async () => {
        return JSON.parse(await fs.promises.readFile(this.path, this.formato))
    }

    // TRAE PRODUCTOS POR ID
    getProductById = async (id) => {
        let arrayProductos = await this.getProduct()
        const idProducto = arrayProductos.find(item => item.id == id)
        return idProducto
    }

    // ACTUALIZA LOS PRODUCTOS
    updateProduct = async (id, newData) => {
        const products = await this.getProduct(id);
        const found = products.find(item => item.id == id)
        if (found) {
            const productIndex = products.findIndex(item => item.id == id)
            products[productIndex] = { ...products[productIndex], ...newData }
            return await fs.promises.writeFile(
                this.path,
                JSON.stringify(products, null, "\t")
            );
        } else {
            return "error"
        }
    };

    // BORRA PRODUCTOS
    deleteProduct = async (id) => {

        const products = await this.getProduct();

        const found = products.find((item) => item.id == id);

        return found
            ? await fs.promises.writeFile(
                this.path,
                JSON.stringify(products.filter(item => item.id != id), null, "\t")
            ) : "error"
    };
}

const productoConstruido = new ProductManager("./Productos.json")
// await productoConstruido.addProduct("Berlín", "terrario abierto", 3500, 12, 20, "http")
// await productoConstruido.addProduct("París", "terrario abierto", 8500, 16, 20, "http")
// await productoConstruido.addProduct("Ámsterdam", "terrario abierto", 9000, 16, 20, "http")
// await productoConstruido.addProduct("Argentina", "terrario abierto", 9000, 16, 20, "http")
// productoConstruido.getProduct()
// productoConstruido.getProductById(2)
// await productoConstruido.updateProduct(2, "title", "Fancia")
// await productoConstruido.deleteProduct(3)