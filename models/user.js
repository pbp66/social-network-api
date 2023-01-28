import { Schema, model } from "mongoose";
import thoughtSchema from "thought.js";

/*
 * Handles 99 % of emails
 * Cannot start with a symbol
 * Content before the @ sign can be any alphanumeric character as well as the symbols included
 * Only alphanumeric characters are allowed for subdomains (allows multiple)
 * Lastly, email must end in an lower/uppercase top level domain
 */
const emailRegex = /^[a-zA-Z\d][a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: [emailRegex, "Not a valid email address"],
		},
		thoughts: [thoughtSchema],
		friends: [this],
	},
	{
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

userSchema.virtual("friendCount").get(function () {
	return this.friends.length;
});

const user = model("user", userSchema);

export default user;
