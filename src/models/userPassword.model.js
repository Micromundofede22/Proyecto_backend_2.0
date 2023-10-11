import mongoose from "mongoose";

const userPasswordSchema= new mongoose.Schema({
    email: {type: String, ref: "users"},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expireAfterSeconds: 3600 } //luego de una hora, mongoDB borra este documento

})

mongoose.set("strictQuery", false)

const userPasswordModel= mongoose.model( "PasswordTicket",userPasswordSchema)

export default userPasswordModel