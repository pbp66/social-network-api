import { Schema, model } from "mongoose";

const thoughtSchema = new Schema({
	// TODO
});

const thought = model("thought", thoughtSchema);

export default thought;
