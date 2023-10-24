require('dotenv').config()
const {MailerSendConfirmationCode,passwordRestoreCodeSending} = require('../services/mailer')
const Admin = require('../models/admin')
const extractInfo = require('../middleware/extract-info')
const Seller = require('../models/seller')
const errorHandler = require('../middleware/error-handler')
const responseHandler =require('../middleware/response-handler')
const jwt = require ('jsonwebtoken')
const perPage = 8;
const getAllAdmins  = async (req ,res)=>{
    const {page} = req.query ;
     if (!page) page=1;

    try {
        const data  = await Admin.find({}).select('-password -token').skip((page-1)*perPage).limit(perPage);
const count = await Admin.find({}).countDocuments()
        responseHandler(res , {
    pagination : {
        current_page : page , 
        total :count , 
        last_page :Math.ceil((count /perPage))
    },
    data :data
})

    } catch (error) {
        
    }
}
const login  =async (req , res,isAdmin)=>{

const {email ,password} = req.body;

    try {
        let doc
    
if(isAdmin){
     doc = await  Admin.findOne({
        email:email,
        password:password
    }).select('-password');
    
}
else {
 
     doc = await  Seller.findOne({
        email:email,
        password:password
    }).select('-password -cards');
    
}
if (doc){
    const date = new Date().getDate()
    const email = doc.email ;
   
    const id = doc._id
const token = jwt.sign({
 date,email ,
 id,
 isAdmin

},
process.env.JWT_SECRET_KEY,
 {expiresIn:'30d'})

    responseHandler(res , { 
        account_data :doc
        , token:token})
}
else {
    errorHandler(res, 400 , {message: 'user not found  !'})
}
} catch (error) {
    errorHandler(res, 500,{error:error.message})
}
}
const register = async(req , res)=>{
    const body = req.body;

    try {
        const doc = await Seller.find({email:body.email});
        if (doc.length>0){
            errorHandler(res,400,{message : 'this email is taken  , please try another one !'} )
        }
        else 
        {
            const r = await Seller.create(body)
            responseHandler(res , {message: 'welcome to our app  !'})
               
        }
    } catch (error) {
     errorHandler(res,500,{error:error.message} )
    }
 
 
}
const sendEmailConfirmCode =async (req , res )=>{
    
    const randomNumber = Math.floor((Math.random()*1000000)+1);
    const rr=randomNumber;
try {
    const docs = await extractInfo(req);
   if(docs){
    if(docs.is_email_verified){
errorHandler(res , 400 , {message : 'this email is verified before  !'})
    }
    else {
        await Seller.updateOne({_id:docs.id}, {confirm_code:rr})
        const {email} =  docs
    const r=  await   MailerSendConfirmationCode(email , rr )
   
       responseHandler(res , 'confirmation code sended successfully  !')
   
     
    }
   }
} catch (error) {
  errorHandler(res, 500,{error:error.message})
}
}
const confirmEmail = async(req , res)=>{
  const {code} = req.body
    try {
    const doc = await extractInfo(req );
    if(!doc.confirm_code ||doc.confirm_code==''){
        errorHandler(res , 400 ,{message:'please send  confirm request at first  !'})

    }
    else if(code!==doc.confirm_code&&doc.confirm_code!==''){
        errorHandler(res , 400 ,{message:'invalid code  !'})

    }
    else {
        try {
            await Seller.updateOne({_id:doc._id}, {is_email_verified:true, email_code: ''});
            responseHandler(res , {message:'email confirmed successfully !'})
        } catch (error) {
            errorHandler (res , 500 , {error:error.message})
        }
    }

  } catch (error) {
    errorHandler (res , 500 , {error:error.message})
     
  }
}
const forgotPassword = async(req , res)=>{
   const {email}= req.body
    try {
        const randomNumber = Math.floor((Math.random()*1000000)+1);
        const rr=randomNumber;
        const doc = await Seller.findOne({email:email});
        if (doc){
            await  passwordRestoreCodeSending(email , rr );
                 await  Seller.updateOne({email:email},{password_code:rr} )
            responseHandler(res , {message :'password recovery email sent  !'})
        }
        else {
            errorHandler(res , 400 , {message:'email not found !'})
        }
        passwordRestoreCodeSending()
   } catch (error) {
    
   }
}
const resetPassword = async(req , res)=>{
   const {code , password} = req.body; 
 
   try {
    const doc = await Seller.findOne({password_code:code});
if(doc){
    if (doc.password_code!==''&&doc.password_code!==null){
      if(doc.password_code ==code){
        await Seller.updateOne({_id:doc._id},{password:password ,password_code:'' })
        responseHandler(res , {message:'password updated successfully !'})
      }
      else {
        errorHandler(res , 400 , {message :'invalid code !'})
      }
    }
    else {
        errorHandler(res , 403 , {message :'method not allowed '})
    }
}
else {
     errorHandler(res , 400 , {message :'invalid code ! '})
}
   } catch (error) {
    errorHandler(res , 400 , {error:error.message})
   } 
}

const logout= async(req ,res)=>{
    res.send('logout test')
}

const createNewAdmin=async (req , res)=>{
    const body = req.body ; 
    try {
        const doc =await Admin.findOne({email:body.email});
        if(doc){
            errorHandler(res,400,{message:'this email is token , please try another one  !'})
        }
        else {
            await Admin.create(body);
            responseHandler(res , {message:'admin created successfully  !'})
        }
      
    } catch (error) {
        errorHandler(res,500,{message:error})
    }
}
const deleteAdmin  = async (req , res)=>{
    const {id} = req.body;


    try {
    if(id){
  const doc = await Admin.deleteOne({
    _id:id
  })
responseHandler(res , {message : 'Admin deleted successfully !',data:doc})
    }  
    else {
        errorHandler(res ,400 , {message: 'invalid id '} )
    }  
    } catch (error) {
        errorHandler(res, 500 , {error:error.message})
    }
}
module.exports = {
    getAllAdmins,
    deleteAdmin,
    sendEmailConfirmCode,   login,createNewAdmin,register,confirmEmail,forgotPassword,resetPassword,logout
}