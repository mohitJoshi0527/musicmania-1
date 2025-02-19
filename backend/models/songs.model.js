import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true,"Title is required"],
    },
    artist : {
        type : String,
        required : [true,"Artist is required"],
    },
    genre : String,
    duration : Number,
    file_url : String,
    price : Number,
    thumbnail_url : {
        type : String,
        required : true,
    },
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
},{timestamps : true})

const Song = mongoose.model("Song",songSchema)
export default Song