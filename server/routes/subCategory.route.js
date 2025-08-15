import { Router } from 'express'
import auth from '../middleware/auth.js'

import { AddSubCategoryController, deleteSubCategoryCOntroller, getSubCategoryController, updateSubCategoryCOntroller } from '../controllers/subCategory.controller.js'

const subCategoryRouter = Router()

subCategoryRouter.post('/create', auth, AddSubCategoryController)
subCategoryRouter.post('/get', getSubCategoryController)
subCategoryRouter.put('/update', auth, updateSubCategoryCOntroller)
subCategoryRouter.delete('/delete', auth, deleteSubCategoryCOntroller)

export default subCategoryRouter