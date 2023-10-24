const fs = require('fs')
const Product = require('../models/category')
const SubCategory  = require('../models/sub-category')
const responseHandler = require('../middleware/response-handler')
const errorHandler = require('../middleware/error-handler')
const Category = require('../models/category')
const subCategory = require ('../models/sub-category')
const perPage = 8 ; 
const getAllCategories = async (req , res)=>{
    let {page} = req.query;
    if(!page) page =1
try {
    const doc = await Category .find({});
    const count = await Category .find({}).countDocuments();
    responseHandler(res, {
        pagination : {
            current_page :page , 
            total :count , 
            last_page : Math.ceil(count/perPage??1) ==0 ?1 :Math.ceil(count/perPage??1) 
        },
        data :doc
    })
} catch (error) {
    errorHandler(res, 500 ,{error:error.message})
}
}
const getCategoryByID = async (req , res)=>{
    const {id} = req.params;

    try {
      const doc = await Category.findById(id)
      if(doc){

       const subCategories = await SubCategory.find({parent_id:id});
       responseHandler(res  , {...doc._doc , sub_categories:subCategories})
      }
      else {
        errorHandler(res ,404, {message :'category not found  !'} )
      }
    } catch (error) {
        errorHandler(res , 500 , {error :error.message})
    }
}
const createCategory = async (req , res)=>{
    const body = req.body;
    let path = '';
    const file = req.file
let category ; 
if(file){
    path =file.path.replace('\\','/')
    

     category =  new Category ({
        ...body , 
        image:path
    })
}
else 
{
 
    

     category =  new Category ({
        ...body , 
        image:''
  
    })
}
    try {
    if(file){
        const doc = await category.save();
        await responseHandler(res , {
            ...doc._doc ,image:path
        })
        
    }
    else {
        const doc = await category.save();
        await responseHandler(res , {
            ...doc._doc ,
            image:''
        })
        
    }
    } 
    
    catch (error) {
     
    
            fs.unlink(''+path, (err) => {
               
              });
              errorHandler(res,400, {error:error.message})
              
}
}
const editCategory = async (req , res)=>{
    const {id} = req.params;

    let path = '';
    let doc
    const body  = req.body ;
  
try {
 
    const category = await Category.findById(id) 
    if(category){
       if (req.file){
           fs.unlink(''+category.image,(err)=>{
   
           })
           path =req.file.path.replace('\\','/')
            doc = await Category.updateOne(
                {_id:id},
                {
            ...body , 
            image :path
           });
       }
     else {
         doc = await Category.updateOne(
            {_id:id},
            body);
       
     }
     doc =await Category.findById(id)
   responseHandler(res , {message :'category updated successfully !' , 
   category : doc})
    }
    else {
   errorHandler(res , 404 , {message: 'category not found !'})
    }
} catch (error) {
      errorHandler(res, 500 ,{error :error.message})
}
   
}
const deleteCategory = async (req , res)=>{
    const  {id} = req.params ; 
  try {
const productsWithCat = await  Product.find({category_id : id});
if (productsWithCat.length>0){
    errorHandler(res ,400 , {message :'you must delete all products with this category at first'})
}
else {
    const doc = await Category.findById(id);
    if(doc.image){
        fs.unlink(''+doc.image,()=>{

        });
        
    }
await Category.deleteOne({_id:id});

await SubCategory.deleteMany({parent_id:id})
responseHandler(res , {message :'category deleted successfully !'})
 
}

} catch (error) {
    errorHandler(res , 500 , {error :error.message})
  }
}
module.exports= {
    getAllCategories,getCategoryByID,createCategory,editCategory,deleteCategory

}