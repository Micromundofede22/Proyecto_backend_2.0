import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema= new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true}, //default true, significa que no es requerido, ya que viene por defecto
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    owner: {type: String, default: "admin"},
    thumbnails: {type: [String], default:[]} // por default viene vacío, por lo que no es requerido
});

productSchema.plugin(mongoosePaginate) //para que acepte la paginación
mongoose.set("strictQuery", false) //se puede subir a la db sin ser estricto el modelo

export const productModel= mongoose.model("products", productSchema)