import userModel from "../models/user.model";

export const createUser = async ({
  email,password
}) => { 
  if(!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashPassword = await userModel.hashPassword(password);

  
  const newUser = new userModel({
    email,
    hashPassword
  });

  return newUser.save();
}