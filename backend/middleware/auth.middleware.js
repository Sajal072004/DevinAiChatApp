import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";


export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token ||  req.header("Authorization").replace("Bearer ", "");

    if(!token) {
      throw new Error("Unauthorised User");
    }

    const isBlacklisted = await redisClient.get(token);

    if(isBlacklisted) {
      res.cookie("token", "");
      return res.status(401).send("Unauthorised User");
    }




    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded
    next();
  } catch (error) {
    res.status(401).send("Unauthorised User");
  }
};