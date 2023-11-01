
export default class CartRepository{
    constructor(dao){
        this.dao= dao;
    }
    getById= async(id) => await this.dao.getById(id);
    getByIdPopulate= async(id) => await this.dao.getByIdPopulate(id);
    createCart= async(data) => await this.dao.createCart(data);
    updateCart= async(id,data) => await this.dao.updateCart(id,data);
    deleteCart= async(id) => await this.dao.deleteCart(id);
};