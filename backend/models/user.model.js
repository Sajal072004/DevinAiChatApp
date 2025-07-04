import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config.js';

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    trim:true,
    lowercase:true,
    minLength: [6, "email must be at least 6 characters"],
    maxLength: [50, "email must be at most 50 characters"],
  },

  password : {
    type: String,
    select:false,
    
  }

 })

userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function(password) {
  console.log(password , this.password);
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function() {
  return jwt.sign({email: this.email}, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const User = mongoose.model('User', userSchema);
export default User;
