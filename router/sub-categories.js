const AdminAuthenticationMiddleware  = require('../middleware/admin')
const upload = require('../services/file-manager')
const  {
    getAllSubCategories,
    editSubCategory,
    getSubCategoryById,
    createSubCategory,
    deleteSubCategory
}  = require('../controllers/sub-category')

const express = require('express');
const router  = express.Router();
 router.route('/').get(getAllSubCategories).post([upload.single('image'), AdminAuthenticationMiddleware],createSubCategory)
 router.route('/:id').get(getSubCategoryById).delete(AdminAuthenticationMiddleware , deleteSubCategory).patch([AdminAuthenticationMiddleware , upload.single('image')],editSubCategory)
 module.exports = router ;