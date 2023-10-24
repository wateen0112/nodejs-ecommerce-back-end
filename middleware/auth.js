const errorHandler = require('../middleware/error-handler');
const Seller = require('../models/seller')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const  AuthenticationMiddleware = async (req , res , next)=>{
const authHeader  = req.headers.authorization;

if (! authHeader || !authHeader.startsWith('Bearer ')){

errorHandler(res ,401, 'not Authorized !')
}
else {
   try {
    const token = authHeader.split(' ')[1]

    const decoded  = jwt.verify(token , process.env.JWT_SECRET_KEY);

   const doc  =await Seller.findOne({_id:decoded.id , email:decoded.email});
   if (doc){
      next()
   }
else {
   errorHandler(res ,401, 'not Authorized !')
}
   } catch (error) {

    errorHandler(res ,401, 'not Authorized !')
   }
    
}

}
module.exports=AuthenticationMiddleware