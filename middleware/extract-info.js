const jwt = require('jsonwebtoken')
const Seller = require('../models/seller')
const extractInfo =async (req ,moreOptions)=>{
    const authHeader  = req.headers.authorization;
    if (! authHeader || !authHeader.startsWith('Bearer ')){

        errorHandler(res ,401, 'not Authorized !')
        }
        else {
           try {
            const token = authHeader.split(' ')[1]

            const decoded  = jwt.verify(token , process.env.JWT_SECRET_KEY);
       if(!moreOptions) moreOptions=''
       
           const doc  =await Seller.findOne({_id:decoded.id , email:decoded.email}).select('-password '+moreOptions);
           if (doc){
   return doc
           }
        else {
          return null
        }
           } catch (error) {
        
           throw(error)
           }
            
        }
}
module.exports = extractInfo