const socket = io() //del lado del cliente, a io le ponemos nombre socket

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
    

        documentFragment.appendChild(tr) //mi fila tr es la fragmentada
        tdFragmentada.appendChild(td4)
        td4.appendChild(btn)
        tr.appendChild(td1, td2, td3, td4)
        
        console.log(td1,td2,td3, td4)

        tableBody.appendChild(documentFragment) //luego a la tabla le añado el documento fragmentado (que es la fila tr)
    }
});