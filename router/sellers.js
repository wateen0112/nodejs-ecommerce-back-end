const AuthenticationMiddleware= require('../middleware/auth')
const AdminAuthenticationMiddleware= require('../middleware/admin')
const upload = require('../services/file-manager')
const express = require('express');
const router = express.Router();
const {getSellerProducts ,editProfileByAdmin,verifyEmail,getProfile,removeSeller ,getAllSellers, editProfile,getSellerData} = require('../controllers/sellers')
router.route('/profile').get(getProfile).post([AuthenticationMiddleware,upload.single('profile_image')],editProfile)
router.route('/:id').get(getSellerData).delete(AdminAuthenticationMiddleware, removeSeller)
router.route('/').get(AdminAuthenticationMiddleware,getAllSellers)
router.route('/products/:id').get(getSellerProducts)
router.route('/modify').post([AdminAuthenticationMiddleware , upload.single('profile_image')],editProfileByAdmin)
router.route('/verify_email').post(AdminAuthenticationMiddleware,verifyEmail)
module.exports = router