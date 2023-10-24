const errorHandler = (res,status , error)=>{
    res.status(status).json(error)
}
module.exports = errorHandler