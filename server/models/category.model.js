import mongoose, { model, Schema } from "mongoose";

const categorySchema = new Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const CategoryModel = model('category', categorySchema)

export default CategoryModel