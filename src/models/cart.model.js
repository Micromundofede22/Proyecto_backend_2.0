import mongoose from "mongoose";


const cartsSchema = new mongoose.Schema({
    products: {                                         //products de tipo array, que contiene subdocumentos

        type: [{

            product: {                                     //cada product es un documento
                _id: false,                                // esto es para que mongoose no le cree un id al documento, ya que el id se lo ponemos nosotros
                type: mongoose.Schema.Types.ObjectId,      //para que se muestren todas las propiedades del documento product dentro del carrito
                ref: `products`                           //aquí van a ir los datos de cada product
            },
            quantity: Number

        }],
        default: [],
        _id: false
    }
})

// cartsSchema.post("findOne", function(){            //los this solo se leen en funciones tradicionales
//     this.populate("products.product")
// })

mongoose.set("strictQuery", false)

export const cartsModel = mongoose.model("carts", cartsSchema)
