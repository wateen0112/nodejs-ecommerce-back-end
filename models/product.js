const mongoose = require("mongoose");
const Seller  = require("./seller")
const ProductSchema =  new mongoose.Schema({
    owner_id: {
        type :mongoose.Schema.Types.ObjectId,
        ref:'sellers',
    },
title_en: {
    type :String  , 
    required :[true , 'you  must provide  a title in en']
},
title_ar: {
    type :String  , 
    required :[true , 'you  must provide  a title in ar']
},
description_en: {
    type :String  , 
    required :[true , 'you  must provide  a description in en']
},
description_ar: {
    type :String  , 
    required :[true , 'you  must provide  a description in en']
},
images : {
    type:Array  , 
    required :[true , 'you must add at least one image !']
},
price :{
    type:Number , 
    required:[true , 'you must provide a price !'],

},
stripe_id:String ,
tags : Array  , 
category_id: 
{
    type :mongoose.Schema.Types.ObjectId,
    ref:'categories',
    required:[true , "please select at least one category !"]
},
sub_category_id: 
{
    type :mongoose.Schema.Types.ObjectId,
    ref:'subCategories',
    required:[true , "please select at least one category !"]
}
,
featured : {
    type :Boolean,
    default:false ,
} 
,
created_at : {
    type:Date ,
    default: Date.now()
}
,status :{
    type:String,
    enum : ['approved', 'pending', 'denied'],
    default :'pending'
}

});

module.exports = mongoose.model('products',ProductSchema)