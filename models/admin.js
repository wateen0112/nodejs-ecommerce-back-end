const mongoose = require('mongoose');
const AdminSchema = mongoose.Schema({
email : {
    type:String   ,
    required:[true , 'please provide an email']
},
password:{
    type:String , 
required:[true , 'please provide a password'],

}

})
module.exports  = mongoose.model('admins', AdminSchema)