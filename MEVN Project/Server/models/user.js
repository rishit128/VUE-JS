import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
    phone: { type: Number, required: true },
    Date: { type: String },
    Createdby: {
        type: String
    },
    Updatedby: {
        type: String
    },
    Deletedby: {
        type: String
    },
    Usertype:{
        type:String,
        default:'user'
    },
    Isapproved:{
        type:Boolean,
        default:false
    }
});

export default mongoose.model("User", userSchema);