import { Schema, model } from "mongoose";
import { DateTime } from "luxon";

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
		thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
		friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

// Query middleware to increase version number and set updatedAt with findOneAndUpdate
// https://stackoverflow.com/questions/35288488/easy-way-to-increment-mongoose-document-versions-for-any-update-queries
userSchema.pre("findOneAndUpdate", (next) => {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } }, next);
});

userSchema.pre("updateOne", (next) => {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } }, next);
});

const user = model("user", userSchema);

export default user;
