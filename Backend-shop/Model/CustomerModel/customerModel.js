const mongoose=require("mongoose")
require("dotenv").config()
const customerSchema=new mongoose.Schema({
    customerof:{
        type:mongoose.Schema.Types.ObjectId,
        ref:process.env.MONGODB_USER_COLLECTION,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    balance:{
        type:Number,
        default:0,
    },
    createdat:{
        type:Date,
        default:Date.now
    }
})
customerSchema.index({customerof:1,phone:1},{unique:true})
const Customer=mongoose.model(process.env.MONGODB_CUSTOMER_COLLECTION,customerSchema)
module.exports=Customer