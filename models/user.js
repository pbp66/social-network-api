import { Schema, model } from "mongoose";

const userSchema = new Schema({
	// TODO
});

const user = model("user", userSchema);

export default user;
