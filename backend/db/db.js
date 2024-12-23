import mongoose from "mongoose";
import 'dotenv/config.js';

function connect() {
  console.log("Connecting to the database..." , process.env.MONGO_URI);
  return mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
    return process.exit(1);
  });
}

export default connect;