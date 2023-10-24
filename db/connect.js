const mongoose  = require('mongoose');
const connectDb = async (uri)=>{
await mongoose.connect(uri);

}
module.exports = connectDb