
const SubCategory = require('../models/sub-category');
const fs = require('fs');

const responseHandler = require('../middleware/response-handler');
const errorHandler = require('../middleware/error-handler');
const subCategory = require('../models/sub-category');

const getAllSubCategories  = async (req , res)=>{
try {
    const perPage = 8 ;
    const {page} = req.query 
    if(!page) page =  1 ; 
const doc  = await SubCategory.find({}).skip((page-1)*perPage).limit(perPage);
const count  =  await SubCategory.find({}).countDocuments();

responseHandler(res , {
pagination:{
    current_page :parseInt(page??1) ,
     total :count , 
     last_page : Math.ceil(count/page??1) ==0 ?1 :Math.ceil(count/page??1) 
},
data :doc
})
} catch (error) {
    errorHandler(res , 500 , {error:error.message})
}
}
const getSubCategoryById = async (req , res)=>{
    const  {id} = req.params;
    try {
        const doc  = await SubCategory.findById(id);
        if (doc){
            responseHandler(res ,doc);
        }
  else      {
            errorHandler(res , 404  , {message :'sub category not found !'})
        }
    } catch (error) {
        errorHandler(res , 500  , {error :error.message})
    }
}
const createSubCategory = async (req, res)=>{
    const body = req.body ; 
    const path = req.file.path.replace('\\','/') ; 

    const subCategory = new SubCategory({
        ...body  ,
        image :path 
    })
    try {
        const doc  = await subCategory.save();
        responseHandler(res , {message : 'sub category created successfully !', 
    data :doc._doc
   
})
    } catch (error) {
        fs.unlink(''+ path , ()=>{

        })
        errorHandler(res , 500, {error :error.message})
    }
}
const deleteSubCategory = async (req , res )=>{
    const  {id} = req.params;

    let image
    try {
        const subToDelete = await SubCategory.findById(id);

        if(subToDelete){
        
             image = subToDelete.image ; 
         
       
    fs.unlink(''+image ,()=>{

    })
    await SubCategory.deleteOne({
        _id:id
    })
}
    responseHandler(res, {message :'sub category deleted successfully  !'})
    } catch (error) {
  errorHandler(res ,500  ,{error :error.message})
    }
}
const editSubCategory = async (req , res)=>{
     const {id}=  req.params;
     const body = req.body ; 

     const file = req.file ; 
    try {
if (file){
    const subToEdit = await  SubCategory.findById(id);
    if(subToEdit){
try {
    fs.unlink(''+subToEdit .image,()=>{

    })
    const    path =file.path.replace('\\','/');
    await SubCategory.updateOne({_id:id},{
        ...body , image:path
    })
    const doc =await subCategory.findById(id)
    responseHandler(res , {message :'sub category updated successfully !', 
    data : doc._doc})
} catch (error) {
    errorHandler(res , 500 , {error :error.message})
   
}
    }
    else {
        errorHandler(res , 404 , {message : 'sub category is not found !'})
    }
}
else {
    const doc = await SubCategory.updateOne ({_id:id},
        {
            ...body 
        })
        responseHandler(res , {message :'sub category updated successfully !', 
    data : doc._doc})
}
    } catch (error) {
        errorHandler(res , 500 , {error :error.message})
    }
}
module.exports= {
    getAllSubCategories,
    getSubCategoryById,
    createSubCategory,
    deleteSubCategory,
    editSubCategory
}