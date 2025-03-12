const mongoose=require("mongoose");

const AbSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
})
const UserModel=mongoose.model("UserDetails",AbSchema);
module.exports=UserModel;