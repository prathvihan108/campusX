import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGO DB CONNECTED !! DB host${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`mongo db connection error ${error}`);
  }
};

export default connectDB;
