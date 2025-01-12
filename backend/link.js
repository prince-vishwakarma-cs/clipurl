import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const schema = new Schema({
    url:String,
    shorten_url:String,
    clicks_left:{type:Number,default:process.env.LIMIT || 10}
})

const links=new mongoose.model("link",schema)

export default links