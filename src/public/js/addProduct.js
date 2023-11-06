
const cartLink = document?.getElementById("cart"); //me traigo el elemento a
const hrefValue = cartLink?.getAttribute("href"); //getAtribute devuelve el value de un atributo específico, en este caso del href, donde esta contenido el id del carrito
const cart = hrefValue?.match(/\/cart\/views\/(.+)/)[1] //match busca coincidencias y devuelve un array con la coincidencia. \/esto borra lo que no me interesa que busque



const addLink = async (_id) => {
    try {
        const res = await fetch(`/api/carts/${cart}/product/${_id}`, {
            method: "POST", // ruta post de la viewcart
        })
        const result = await res.json()
        if (result.status === "error") throw new Error(result.error) //si el json, que ahora esta
        //  dentro de la const result, da error en su status, me tira un nuevo error y throw detiene la
        // ejecucion siguiente 
    } catch (error) {
        console.log(error)
    }
}
