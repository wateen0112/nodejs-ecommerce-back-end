const responseHandler = (res , data , status) =>{
if(!status)
status =200
    res.status(status).json(data)
}
module.exports = responseHandler