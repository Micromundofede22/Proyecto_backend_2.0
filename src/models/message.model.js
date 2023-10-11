import mongoose from "mongoose";

const messagesCollection= "messages";

const messageSchema= new mongoose.Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
})

mongoose.set("strictQuery", false)
export const messagesModel= mongoose.model(messagesCollection, messageSchema)
