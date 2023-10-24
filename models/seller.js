const mongoose = require('mongoose');
const SellerSchema  = mongoose.Schema({
    first_name : {
        type:String , 
        required:[true , 'please provide your first name ']
    },
    last_name : {
        type:String , 
        required:[true , 'please provide your last name ']
    },
    email : {
        type:String , 
        required:[true , 'please provide your email  ']
    },
    password : {
        type:String , 
        required:[true , 'please provide your password  ']
    },
    is_email_verified :{
        type:Boolean , default:false
    },
    stripe_key :String , 
    bio:String , 
    address:String , 
    cards :Array,
    profile_image:String,
    confirm_code:String ,
    password_code:String ,

})
module .exports = mongoose.model('sellers',SellerSchema)