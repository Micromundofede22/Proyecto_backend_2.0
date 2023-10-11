import userPasswordModel from "../models/userPassword.model.js";

export default class userPasswordMongoDAO {
    create= async(data) => await userPasswordModel.create(data)
    getUserPassword= async(data) => await userPasswordModel.findOne(data).lean()
    delete=async (data)=> await userPasswordModel.deleteOne(data)
}