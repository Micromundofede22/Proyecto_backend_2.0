import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },                 //codigo auto incremental
    purchase_datetime: { type: Date, default: Date.now, required: true }, //fecha y hora
    amount: { type: Number, required: true },                              //monto total
    purcharser: { type: String, required: true },                          //email usuario
    products: {

        type: [{

            product: {
                _id: false,
                type: mongoose.Schema.Types.ObjectId,
                ref: `products`
            },
            quantity: Number

        }],
        default: [],
        _id: false
    }
});

ticketSchema.pre("findOne", function () {
    this.populate("products.product");
});

mongoose.set("strictQuery", false);

export const ticketModel = new mongoose.model("ticket", ticketSchema);