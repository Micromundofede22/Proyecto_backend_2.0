import fs from "fs"

export class CartManager {
    constructor(path) {
        this.path = path,
            this.formato = "utf-8"
    }

 // TRAE CARRITO
    getCart = async () => {
        return JSON.parse(await fs.promises.readFile(this.path, this.formato))
    }

    // AÑADE CARRITO
    addCart = async (products) => {
        const cartArray = await this.getCart()
        cartArray.push({ id: await this.generateId(), products })
        return await fs.promises.writeFile(this.path, JSON.stringify(cartArray, null, '\t'))
    }

    // GENERA ID
    generateId = async () => {
        let cartArray = await this.getCart()
        return (cartArray.length === 0)
            ? 1
            : cartArray[cartArray.length - 1].id + 1
    }

    // BUSCA CARRITO POR ID
    getCartById = async (id) => {
        let cartArray = await this.getCart()
        const idCart = cartArray.find(item => item.id == id)
        return idCart.products
    }

    // AÑADE PRODUCTOS AL CARRITO
    addInCart = async(cid, pid)=>{

        const arrayCarts= await this.getCart()
        const found= arrayCarts.find(item => item.id == cid)

        if (found) {
            const arrayCartIndex = arrayCarts.findIndex(item => item.id == cid)
            const arrayProducts= arrayCarts[arrayCartIndex].products

            const arrayProductsIndex= arrayProducts.findIndex(item => item.id == pid)
            
            if (arrayProductsIndex >= 0) {
                // actualizar 
                let {quantity}= arrayProducts[arrayProductsIndex];
                quantity++

                arrayProducts[arrayProductsIndex]= {...arrayProducts[arrayProductsIndex], quantity:quantity}
                arrayCarts[arrayCartIndex]= {...arrayCarts[arrayCartIndex], products: arrayProducts}
        
            }else{
                arrayCarts[arrayCartIndex].products.push({
                    id: Number(pid),
                    quantity: 1
                })
            }
            return await fs.promises.writeFile(this.path, JSON.stringify(arrayCarts, null, '\t'))
        }


        
    }

}


const cartConstruido = new CartManager("./Cart.json")
