import mongoose from "mongoose";
import { ILog, logSchema } from "./logSchema";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  logs: ILog;
  createdAt: Date;
  visitedAt: Date;
}

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    logs: [logSchema],
  },
  { timestamps: true, strictQuery: true }
);

const userModel = mongoose.model<IUser>("user", userSchema);

export default userModel;
