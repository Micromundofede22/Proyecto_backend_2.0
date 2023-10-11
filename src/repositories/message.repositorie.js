export default class MessageRepositorie{
    constructor(dao){
        this.dao= dao
    }
    getAll= async()=> await this.dao.getAll()
}