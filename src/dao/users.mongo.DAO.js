import Usermodel from "../models/user.model.js"

export default class UserMongoDAO{
    getUser= async()=> await Usermodel.find().lean().exec()
    getUserById= async(id) => await Usermodel.findById(id)
    getUserEmail= async(data) => await Usermodel.findOne(data)
    create= async(data) => await Usermodel.create(data)
    updateUser= async(id, data)=> await Usermodel.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean() //.lean()para poder leer el objeto de mongoose, como un json simple
}
