const cartLink = document?.getElementById("cart"); //me traigo el id cart del enlace a
const hrefValue = cartLink?.getAttribute("href"); //getAtribute devuelve el value de un atributo específico, en este caso del href
const cart = hrefValue?.match(/\/cart\/views\/(.+)/)[1] //match busca coincidencias y devuelve un array con la coincidencia. \/esto borra lo que no me interesa que busque


const eliminateProduct = async (_id) => {
    try {
        const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
            method: "DELETE", // ruta DELETE de la API CART
        })
        const result = await res.json()
        if (result.status === "error") throw new Error(result.error) //si el json, que ahora esta
        //  dentro de la const result, da error en su status, me tira un nuevo error y throw detiene la
        // ejecucion siguiente 
        // else socket.emit("item", result)
    } catch (error) {
        console.log(error)
    }
}

