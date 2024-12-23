import mongoose from "mongoose";

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
    minLength: [6, "password must be at least 6 characters"],
    maxLength: [50, "password must be at most 50 characters"],
  }

 })

 