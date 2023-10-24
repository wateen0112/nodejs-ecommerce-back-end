const Product  = require('../models/product')
const Seller  = require('../models/seller')
const extractInfo = require('../middleware/extract-info')
const errorHandler = require('../middleware/error-handler')
const responseHandler =require('../middleware/response-handler')
const fs = require('fs')
const perPage = 8 ;  
const getAllProducts = async (req , res,query)=>{
  if(!query) query={}
    let {page} = req.query||1
 if(!page) page =1
   try {

   const docs = await Product.find({...query}).skip((page-1)*perPage).limit(perPage);
   const count = await Product.find({...query}).countDocuments();
   responseHandler(res , {pagination:{
    total :count , 
    current_page :parseInt(page??1) , 
    
    last_page : Math.ceil(count/page??1) ==0 ?1 :Math.ceil(count/page??1) 
   } , data:docs})
  
   } catch (error) {
    errorHandler(res , 500, {error:error.message})
   }
}
const getPendingProducts = async (req , res,)=>{

    let {page} = req.query||1
 if(!page) page =1
   try {

   const docs = await Product.find({status:{$in :['pending','denied']}}).skip((page-1)*perPage).limit(perPage);
   const count = await Product.find({status:{$in :['pending','denied']}}).countDocuments();
   let pendingArr = [];
for(var i =0 ; i<docs.length ; i++){
  const seller   =await  Seller.findById(docs[i].owner_id).select('first_name last_name email')

  pendingArr .push({
    product:docs[i] , 
seller :seller
  })
}

   responseHandler(res , {pagination:{
    total :count , 
    current_page :parseInt(page??1) , 
    
    last_page : Math.ceil(count/page??1) ==0 ?1 :Math.ceil(count/page??1) 
   } , data:pendingArr})
  
   } catch (error) {
    errorHandler(res , 500, {error:error.message})
   }
}
const getProductByID = async (req , res)=>{
const  {id} = req.params;

try {
  const doc  = await Product.findById(id);
  
  if (doc )
  {
    const seller = await Seller.findById(doc.owner_id)
    responseHandler(res , {product:doc, seller:seller});

  }
  else {
    errorHandler(res ,404 , {message:'product not found !'})
  }
} catch (error) {
  errorHandler(res , 500 ,{error:error})
}
}
const createProduct = async (req , res)=>{
    const body = req.body;
    let path = [];
    req.files.forEach(function(files,index,arr){
        path.push(files.path.replace('\\','/'))
    })
    const productOwner =await extractInfo(req , '-cards -password_code -confirm_code  -email')
   if(productOwner.is_email_verified==true){
    const product  = new Product({
      ...req.body , 
      images:path,
      owner_id:productOwner._id
  })
  try {
     
    const doc =  await    product.save()
      await    responseHandler(res, {
      ...doc._doc,images:path
      })
  
  } catch (error) {
  
      path.forEach(img=>{
  
      fs.unlink(''+img, (err) => {
         
        });
    })
    errorHandler(res,400, {error:error.message})
  }
   
}
else {
  errorHandler(res , 400 , {message: 'please confirm your email at first !'})
}
}
const editProduct = async (req , res)=>{
    const {id} = req.params ; 
    let body = req.body
    try {
    const product = await Product.findById(id)
    const owner = await extractInfo(req);
     const owner_id = owner._id
    if(product){
      if (product.owner_id ==owner_id){
  //removing images deleted by user   . .
  let images = product.images ; 
  const images_to_delete = req.body.images_to_delete||[]
if(images_to_delete.length>0){

  for(var i =0 ; i<images_to_delete.length;i++){
    
     
              
      fs.unlink(''+images_to_delete[i],(err)=>{

      })
      images = images.filter(x=>{
          return x!==images_to_delete[i]
      
      })
  }

}
  if(req.files){
      req.files.forEach(function(files,index,arr){
          images.push(files.path.replace('\\','/'))
      })
  }
  product.images = images

if(body.owner_id){
    delete body.owner_id
}
  const doc  = await Product.updateOne({_id:id},
{
 ...body, 
 images:images
  });
const newProduct  = await Product.findById(id)

  await    responseHandler(res, {   
    ...newProduct._doc })
// res.send(images_to_delete)
      }
      else {
        errorHandler(res , 403 ,{message:'you can not access to this product'})
      }
    }
    else {
      errorHandler(res , 400 ,  {message: 'no product with this id  !'})
    }
    } catch (error) {
        throw(error)
    }
       
       }
const deleteProduct = async (req , res , dontSendData)=>{
  if (!dontSendData) dontSendData = false
    const {id} = req.params;

    try {
      const doc = await Product.findById(id);
    
     if(doc){

const owner = await extractInfo(req , '');
const owner_id = owner._id
const doc_owner_id  =doc.owner_id;

if (doc_owner_id ==owner_id){
  await Product.deleteOne({_id:id});
  const images= doc.images ;
  
  if(images.length > 0){
    images.forEach(image=>{
      fs.unlink(''+image,(err)=>{

      })
    })
    
  }
if(!dontSendData)
responseHandler(res , {message: 'product deleted successfully  !'})
    
}
else {
  errorHandler(res , 401, {message :'not authenticated !'})
}
    }
     else {
      errorHandler(res , 404 , {message :'product not found !'})
     }
  
    } catch (error) {
      errorHandler(res , 500 , {error :error.message})
    }
}
const approveProduct = async (req , res)=>{
  const {id} = req.params
  try {
     const product =  await Product.updateOne({_id:id}, {status:'approved'})
 if(product.modifiedCount==1){
  responseHandler(res , {message : 'product Approved !'})
 }
 else {
  errorHandler(res , 404 , {message :'product not found !'})
 }
   } catch (error) {
    errorHandler(res , 500 , {error :error.message})
   }
}
const denyProduct = async (req , res)=>{
  const {id} = req.params
  try {
     const product =  await Product.updateOne({_id:id}, {status:'denied'})
 if(product.modifiedCount==1){
  responseHandler(res , {message : 'product denied !'})
 }
 else {
  errorHandler(res , 404 , {message :'product not found !'})
 }
   } catch (error) {
    errorHandler(res , 500 , {error :error.message})
   }
}
const getPendingById  =async(req , res)=>{
const {id} = req.params
  try {
    const product  = await Product.findOne({_id:id , status:{$in :['pending','denied']}})
  if(product){
    const seller = await Seller.findById(product.owner_id).select('first_name last_name email');

responseHandler(res ,{
  product :product , 
  seller:seller 
});
  }
  else {
errorHandler(res,404 ,{message : 'product not found !'})
  }
  } catch (error) {
    errorHandler(res  , 500 ,{error :error.message})
  }
}
const changeStatus   = async (req ,res)=>{
  const {id , status} = req.body  
  try {
   const doc  = await Product.updateOne({_id:id}, {status:status})
    if(doc.modifiedCount==1){
responseHandler(res, {message:'product status changed  !'})
    }
    else {
errorHandler(res , 404  ,{message :'product not found !'})
    }
  } catch (error) {
    errorHandler(res  , 500 , {error: error.message})
  }
}
module.exports= {
  changeStatus,
    getAllProducts,getPendingProducts,getProductByID,createProduct,editProduct,deleteProduct,
    denyProduct,
    getPendingById,
    approveProduct
}