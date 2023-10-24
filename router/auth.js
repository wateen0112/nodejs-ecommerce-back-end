const  {sendEmailConfirmCode,createNewAdmin,getAllAdmins,deleteAdmin ,login,register,confirmEmail,forgotPassword,resetPassword,logout} = require('../controllers/auth')
const express = require('express');
const AuthenticationMiddleware = require('../middleware/auth')
const AdminAuthenticationMiddleware = require('../middleware/admin');
const router  =express.Router();
router.route('/login').post((req , res)=>{
    login(req ,res , false)
})
router.route('/login_as_admin').post((req ,res)=>{
    login(req , res , true)
})

router.route('/admins').get(AdminAuthenticationMiddleware,getAllAdmins).delete(AdminAuthenticationMiddleware,deleteAdmin)
router.route('/register').post(register)
router.route('/confirmEmail').post(AuthenticationMiddleware,confirmEmail)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword').post(resetPassword)
router.route('/logout').post(logout),
router.route('/sendConfirmationCode').post(AuthenticationMiddleware,sendEmailConfirmCode)
router.route('/admin/new').post(AdminAuthenticationMiddleware,createNewAdmin)
module.exports = router