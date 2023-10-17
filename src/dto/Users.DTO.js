//los dto sirven para maquillar la info, solo devolver al front cierta info, no todo el json completo
//se usa en la ruta current de session
export default class UserDTO{
    constructor(user){
        this.fullname= `${user.first_name || " "} ${user.last_name || " "}`
        this.email= user.email
        this.servicio= user.servicio
        this.file= user.file
        this.role= user.role
    }
}