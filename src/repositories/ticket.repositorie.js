export default class TicketRepositorie{
    constructor(dao){
        this.dao= dao
    }
    create= async(data)=> await this.dao.create(data)
    getById= async(id) => await this.dao.getById(id)
    getAll= async()=> await this.dao.getAll()
    getByData= async(data) => await this.dao.getByData(data)
}