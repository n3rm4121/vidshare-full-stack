import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

let isConnected = false;

export default async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
