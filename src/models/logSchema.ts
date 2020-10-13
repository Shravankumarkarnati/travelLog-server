import mongoose from "mongoose";

export interface ILog extends mongoose.Document {
  title: string;
  description?: string;
  visitedDate: Date;
  rating: Number;
  location: {
    type: Coordinates;
    coordinates: [longitude: Number, latitude: Number];
  };
  createdAt: Date;
  updatedAt: Date;
}

export const logSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    visitedDate: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 10,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true, strictQuery: true }
);

const logModel = mongoose.model<ILog>("logs", logSchema);

export default logModel;
