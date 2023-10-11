const socket = io() //del lado del cliente, a io le ponemos nombre socket

const tableBody = document.getElementById("tabla");

// console.log("pasando por aca 1 realTime")
socket.on("updateProducts", (data) => { //socket cuando escucha el updateProducts responde con esto
    tableBody.innerHTML = ` `
    for (products of data) {
        const documentFragment= document.createDocumentFragment() //para que un elemento reciba varios appendchild

        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")
        td1.innerHTML = `${products.title}`
        td2.innerHTML = `${products.description}`
        td3.innerHTML = `${products.price}`
        td4.innerHTML= `${products.thumbnails}`

        documentFragment.appendChild(tr) //mi fila tr es la fragmentada

        tr.appendChild(td1, td2,td3,td4) //le añado varios  appendchild

        tableBody.appendChild(documentFragment) //luego a la tabla le añado el documento fragmentado (que es la fila tr)
    }
});
