
const AdminAuthenticationMiddleware = require('../middleware/admin')
const AuthenticationMiddleware = require('../middleware/auth')
const upload = require('../services/file-manager')
// const AuthenticationMiddleware = require('../middleware/auth')
const {
    getAllProducts,getPendingById,changeStatus,getPendingProducts, getProductByID, createProduct, editProduct, deleteProduct ,denyProduct,
    approveProduct

} = require('../controllers/product')
const express = require('express')
const router = express.Router();
router.route('/').get((req , res)=>{
    getAllProducts(req ,res  ,{status:'approved'})
}).post([AuthenticationMiddleware,upload.array('images')],(req , res)=>{
    createProduct(req , res)
})
router.route('/change_status').post(AdminAuthenticationMiddleware,changeStatus)
router.route('/pending').get(AdminAuthenticationMiddleware,getPendingProducts)
router.route('/pending/:id').get(AdminAuthenticationMiddleware,getPendingById)
router.route('/:id').get(getProductByID).patch([AuthenticationMiddleware,upload.array('images')],(req , res)=>{
    editProduct(req , res)
}).delete(AuthenticationMiddleware,deleteProduct),
router.route('/approve/:id').post(AdminAuthenticationMiddleware,approveProduct)
router.route('/deny/:id').post(AdminAuthenticationMiddleware,denyProduct)
router.route('/pending/').get(AdminAuthenticationMiddleware ,(req , res)=>{
    getAllProducts(req , res,{status:'pending'})
})
module.exports = router