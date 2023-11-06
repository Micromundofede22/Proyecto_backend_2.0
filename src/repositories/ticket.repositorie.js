export default class TicketRepositorie{
    constructor(dao){
        this.dao= dao;
    }
    create= async(data)=> await this.dao.create(data);
    getById= async(id) => await this.dao.getById(id);
    getAll= async()=> await this.dao.getAll();
    getAllData= async(data) => await this.dao.getAllData(data);
    getByData= async(data) => await this.dao.getByData(data);
}