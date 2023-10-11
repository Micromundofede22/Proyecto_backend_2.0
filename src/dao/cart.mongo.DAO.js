import { cartsModel } from "../models/cart.model.js";

export default class CartMongoDAO{
    getById= async(id)=> await cartsModel.findById(id)
    getByIdPopulate= async(id)=> await cartsModel.findById(id).populate("products.product").lean().exec()
    createCart= async(data) => await cartsModel.create(data)
    updateCart= async(id, data) => await cartsModel.updateOne(id, data,{ returnDocument: "after" })
}