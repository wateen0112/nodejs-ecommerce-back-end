const mongoose = require('mongoose');

const CategorySchema =  new mongoose.Schema({
    title_en: {
        type :String  , 
        required :[true , 'you  must provide  a title in en']
    },
    title_ar: {
        type :String  , 
        required :[true , 'you  must provide  a title in ar']
    },
    image :{
   type:     String,
     
    }
,

})
module.exports = mongoose.model('categories', CategorySchema)