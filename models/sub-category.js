const mongoose = require('mongoose');
const subCategorySchema  = mongoose.Schema({
    title_en: {
        type :String  , 
        required :[true , 'you  must provide  a title in en']
    },
    title_ar: {
        type :String  , 
        required :[true , 'you  must provide  a title in ar']
    },
    parent_id :{
        type :mongoose.Schema.Types.ObjectId ,
        ref:'subCategories'
        
            },
    image : {type:String,
    required : [true , 'please select an image']}
})
module.exports = mongoose.model('subCategories',subCategorySchema)