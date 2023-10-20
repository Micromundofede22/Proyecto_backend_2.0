import moment from "moment/moment.js";
import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    role: { type: String, enum: ["user", "premium", "admin"] },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" }, //para que en el carrito del user se pueda ver su contenido
    servicio: { type: String, required: false },
    file: { type: String, required: false },
    verifiedAccount: { type: String, default: "UNVERIFIED" },
    last_connection: { type: String, default: moment().format("DD/MM/YYYY HH:mm:ss"),required: true },
    documents: {
        type: [{
            name: String,
            reference: String
        }],
        default: []
    }
})

mongoose.set("strictQuery", false)
const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel