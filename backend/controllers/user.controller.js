import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';

import { validationResult } from 'express-validator';

export const createUserController = async (req, res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    console.log("the req body is " , req.body);
    const user = await userService.createUser(req.body);

    const token = await user.generateJWT();

    res.status(201).json({user , token});
  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const loginController = async (req, res) => {  
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    const {email , password} = req.body;
    const user = await userModel.findOne({email});

    if(!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await user.isValidPassword(password);

    if(!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = await user.generateJWT();

    res.status(200).json({user , token});
    
  } catch (error) {
    res.status(400).send(error.message);
  }
}



