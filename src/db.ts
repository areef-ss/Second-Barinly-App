import mongoose, { Schema, model } from "mongoose";
import { title } from "process";

mongoose.connect("mongodb+srv://areef0463_db_user:Areef1ar%40123@cluster0.8xgb862.mongodb.net/brainly");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true }, // use lowercase
  password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

const ConetentSChema=new Schema({
  title:String,
  link:String,
  tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
  userId:{type: mongoose.Types.ObjectId,ref:'User',required:true},
  Author:{type: mongoose.Types.ObjectId,ref:'User',required:true}
})

export const ConetentModel=model("Conetent",ConetentSChema);
