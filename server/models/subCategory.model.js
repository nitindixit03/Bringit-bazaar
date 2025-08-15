import mongoose, { model, Schema } from "mongoose";

const subCategorySchema = new Schema({
    name : {
        type : String,
        default : ""
    },
    image : {
        type : String,
        default : ""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId, 
            ref : "category"
        }
    ]
},{
    timestamps : true
})

const SubCategoryModel = model('subCategory', subCategorySchema)

export default SubCategoryModel