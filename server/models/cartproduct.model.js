import mongoose, { model, Schema } from "mongoose";

const cartProductSchema = new Schema({
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
},{
    timestamps : true
})

const CartProductModel = model('cartProduct',cartProductSchema)

export default CartProductModel