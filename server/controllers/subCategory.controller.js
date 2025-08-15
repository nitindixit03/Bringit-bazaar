import SubCategoryModel from "../models/subCategory.model.js"

export const AddSubCategoryController = async (req, res) => {
    try {
        const { name, image, category } = req.body

        if (!name && !image && !category[0]) {
            return res.status(400).json({
                message: "Provide name, image, category",
                error: true,
                success: false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return res.json({
            message : "Sub Category Created",
            error : false,
            success : true,
            data : save
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
        return res.json({
            message : "Sub Category data",
            data : data,
            error: false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateSubCategoryCOntroller = async (req, res) => {
    try {
        const { _id, name, image, category } = req.body

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return res.status(400).json({
                message : "Check your _id",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return res.status(200).json({
            message : 'Updated Successfully',
            success : true,
            error : false,
            data : updateSubCategory
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteSubCategoryCOntroller = async (req, res) => {
    try {
        const { _id } = req.body

        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return res.status(200).json({
            message : "Deleted Successfully",
            data : deleteSub,
            success : true,
            error : false
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}