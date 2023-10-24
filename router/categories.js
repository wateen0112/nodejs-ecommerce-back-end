
const AdminAuthenticationMiddleware  = require('../middleware/admin')
const upload = require('../services/file-manager')
const {
    getAllCategories,getCategoryByID,createCategory,editCategory,deleteCategory

} = require('../controllers/category')
const express = require('express')
const router = express.Router();
router.route('/').get(getAllCategories).post([AdminAuthenticationMiddleware, upload.single('image')],createCategory)
router.route('/:id').get(getCategoryByID).patch([AdminAuthenticationMiddleware, upload.single('image')],editCategory).delete(AdminAuthenticationMiddleware,deleteCategory)
module.exports = router