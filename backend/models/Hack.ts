import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { IHack } from "./Hack.d"
import hackPlugin from "../utils/hack_plugin";

const hackReviewSchema: Schema = new mongoose.Schema({
    reader: { id: String, email: String },
    creativity: Number,
    technicalComplexity: Number,
    socialImpact: Number,
    comments: String
  }, { _id: false });

const hackSchema: Schema = new mongoose.Schema({
    "_id": Number,
    "floor": Number,
    "devpostUrl": String,
    "title": String,
    "categories": [String],
    "table": String,
    "reviews": [hackReviewSchema],
    "disabled": Boolean,
    "numSkips": {type: Number, default: 0}
});

hackSchema.plugin(hackPlugin);

const model: Model<IHack> = mongoose.model("Hack", hackSchema);
export default model; 