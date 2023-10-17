const socket = io() //del lado del cliente, a io le ponemos nombre socket

const cartLink = document?.getElementById("cart"); //me traigo el id cart del enlace a
const hrefValue = cartLink?.getAttribute("href"); //getAtribute devuelve el value de un atributo específico, en este caso del href
const cart = hrefValue?.match(/\/cart\/views\/(.+)/)[1] //match busca coincidencias y devuelve un array con la coincidencia. \/esto borra lo que no me interesa que busque

const tableBody = document.getElementById("tabla");

console.log("pasando por aca realTimeCart")
socket.on("updateCart", (data) => { //socket escucha el updateCart del server y responde con esto
    const dataenArray = [data]
    // console.log("paso1")
    const arrayIterable = dataenArray[0].products
    console.log(arrayIterable)

    tableBody.innerHTML = ` `
    for (let item of arrayIterable) {
        console.log("paso 2")
        const documentFragment = document.createDocumentFragment() //para que un elemento reciba varios appendchild
        const tdFragmentada = document.createDocumentFragment()

        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")
        let btn = document.createElement("button")

        td1.innerHTML = `${item.product.title}`
        td2.innerHTML = `${item.product.price}`
        td3.innerHTML = `${item.product.thumbnails}`
        btn.innerHTML= `hola `
        console.log(item.product.title,item.product.price,item.product.thumbnails)
    

        documentFragment.appendChild(tr) //mi fila tr es la fragmentada
        tdFragmentada.appendChild(td4)
        td4.appendChild(btn)
        tr.appendChild(td1, td2, td3, td4)
        
        console.log(td1,td2,td3, td4)

        tableBody.appendChild(documentFragment) //luego a la tabla le añado el documento fragmentado (que es la fila tr)
    }
});

//BOTÓN ELIMINAR PRODUCTO DEL CARRITO
const eliminateProduct = async (_id) => {
    try {
        const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
            method: "DELETE", // ruta DELETE de la API CART
        });
        const result = await res.json();
        // socket.emit("item", result.payload);

        // console.log(result);
        if (result.status === "error") throw new Error(result.error); //si el json, que ahora esta
        //  dentro de la const result, da error en su status, me tira un nuevo error y throw detiene la
        // ejecucion siguiente 
        // else socket.emit("item", result)
    } catch (error) {
        console.log(error);
    }
}