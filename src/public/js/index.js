let chatBox= document.getElementById("chatBox")



Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Escriba su nick para chatear',
    inputValidator: value => {  //validar que coloque si o si un nombre
        return !value.trim() && 'Por favor, coloca un nick' //.trim() recorta extremos de un string, por ende si no puede recortar (! por eso le ponen este diferente), es porque esta vacío
    },
    allowOutsideClick: false  //no permite que cliente haga click por fuera del mensaje y deshabilite
}).then(result => { 
    user = result.value
    document.getElementById('user').innerHTML = user //así me traigo el span del html y le inserto el nombre (result.value)
   
    let socket = io() //hago el apretón de manos luego de haber realizado la promesa, y ahi accedo a tos mensajes del chat recien

    chatBox.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', {
                    user,
                    message: chatBox.value
                })
                chatBox.value = ''
            }
        }
    })

    socket.on('logs', data => {
        const divLogs = document.getElementById('messagesLogs')
        let messages = ''
        data.reverse().forEach(message => {
            messages += `<p><i>${message.user}</i>: ${message.message}</p>`
        })
        divLogs.innerHTML = messages
    })
    
    socket.on('alerta', () => {
        alert('Un nuevo usuario se ha conectado...')
    }) //avisa cuando se conecta nuevo usuario
})

  
