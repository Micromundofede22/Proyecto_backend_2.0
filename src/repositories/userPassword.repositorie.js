export default class userPasswordRepositorie{
    constructor(dao){
        this.dao= dao
    }
    create= async(data) => await this.dao.create(data)
    getUserPassword= async(data)=> await this.dao.getUserPassword(data)
    delete= async(data)=> await this.dao.delete(data) 
}