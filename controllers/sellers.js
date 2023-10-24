const Seller = require('../models/seller')
const Product  = require('../models/product');
// const fs = require('fs')
const extractInfo = require('../middleware/extract-info')
// const extractInfo = require('../middleware/extract-info')
const errorHandler = require('../middleware/error-handler')
const responseHandler =require('../middleware/response-handler')
const fs = require('fs');
const perPage =  8 ;

const getProfile = async (req , res)=>{
 try {
    const profileData  =await extractInfo(req,'-confirm_code')
  if(profileData){
    responseHandler(res , profileData)
  }
  else 
  errorHandler(res , 400 ,{message :'user not found  !'})
 } catch (error) {
    errorHandler(res , 500 , {error:error.message})
 }
}



const editProfileByAdmin = async (req , res)=>{
  
     const file = req.file ; 
    const body = req.body;
     const id = body._id
     try {
        const user  = await Seller.findById(id);
    if(file){
        const path = file.path.replace('\\','/');
    if(user.profile_image||user.profile_image!==''){
    fs.unlink(''+user.profile_image,()=>{
    
    });
    
    }
    await Seller.updateOne({_id:user._id},{
        ...body,
        profile_image : path
    })
    }
    else {
        await Seller.updateOne({_id:user._id},{
            ...body,
     
        })  
    }
    responseHandler(res , {message :'profile updated successfully !'})
    } catch (error) {
        errorHandler(res ,500  ,{error : error.message})
    }
    }
const editProfile = async (req , res)=>{
const body = req.body ;
const file = req.file ; 

try {
if(file){
    const path = file.path.replace('\\','/');
    const  user= await extractInfo(req);
if(user.profile_image||user.profile_image!==''){
fs.unlink(''+user.profile_image,()=>{

});

}
await Seller.updateOne({_id:user._id},{
    ...body,
    profile_image : path
})
}
else {
    await Seller.updateOne({_id:user._id},{
        ...body,
 
    })  
}
responseHandler(res , {message :'profile updated successfully !'})
} catch (error) {
    errorHandler(res ,500  ,{error : error.message})
}
}
const getSellerData = async (req , res)=>{
 const  {id}  = req.params;

 let {page} = req.query||1
if(!page) page =1
    try {
       const seller = await Seller.findById(id).select('-confirm_code -password -password_code -__v')
     
       if(seller){
       
        responseHandler(res , {
       ...seller._doc , 
         
            
        })
     }
     else {
        errorHandler(res , 404  ,{message :'seller not found !'})
     }
} catch (error) {
    errorHandler(res , 500 , {error :error.message})
}
}
const getSellerProducts  = async (req  ,res)=>{
    const {id} = req.params;
    const {page} = req.query
    try {
        const sellerProducts = await Product.find({owner_id:id}).skip((page-1)*perPage).limit(perPage);
        const count = await Product.find({owner_id:id}).countDocuments();
   responseHandler(res ,{

                pagination:{
                    total :count , 
                    current_page :parseInt(page??1) , 
                    
                    last_page : Math.ceil(count/perPage??1) ==0 ?1 :Math.ceil(count/perPage??1) 
                   } , data:sellerProducts
   })
    } catch (error) {
        
    }
}
const getAllSellers = async (req , res )=>{
    let {page} = req.query??1
    if(!page) page =1
    try {
   const docs = await Seller.find({}).select('-password -cards -confirm_code').skip((page-1)*perPage).limit(perPage);
   const count = await Seller .find({}).countDocuments();
   responseHandler(res , {pagination:{
    total :count , 
    current_page :parseInt(page??1) , 
    
    last_page : Math.ceil(count/perPage??1) ==0 ?1 :Math.ceil(count/perPage??1) ??1
   } , data:docs})
  
  
    } catch (error) {
        errorHandler(res ,500 , {error:error})
    }
}
const removeSeller = async (req ,res)=>{
    const {id} = req.params
try {
    const sellerToBeDeleted  = await Seller.findById(id);
    if (sellerToBeDeleted.profile_image ||sellerToBeDeleted.profile_image!==''){
        fs.unlink(''+sellerToBeDeleted.profile_image,()=>{

        })
    }
    const productsToBeDeleted = await  Product.find({owner_id:id});
   
    const doc = await Seller.deleteOne ({
_id :id ,

    }) 
if(doc.deletedCount==1){
    const sellerProducts = await Product.find({owner_id:id})
    ;
    
    
    sellerProducts.forEach(pr=>{
    pr.images.forEach(img=>{
     fs.unlink(''+img,()=>{
    
     })
    })
    })   
    
    await Product.deleteMany({owner_id:id})
    responseHandler(res , {message :"seller deleted successfully  "})
     
}
else {
errorHandler(res ,404 , {message :'seller not found !'})
}
} catch (error) {
    errorHandler(res , 500 ,{message:error.message})
}
}
const verifyEmail = async (req , res)=>{
    const {id}= req.body  ; 
    try {
  const doc =await Seller.updateOne({_id:id},{is_email_verified:true})

if(doc.modifiedCount>0){
    responseHandler(res , {message:'seller email verified successfully !'})
  
}
else 
{
    errorHandler(res,400, {message:'Seller not found !'})
}
} catch (error) {
        errorHandler(res,500, {error:error.message})
    }
}
module.exports={
    getSellerProducts,verifyEmail,editProfileByAdmin,
    removeSeller,getAllSellers,getProfile , editProfile,getSellerData}