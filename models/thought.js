import { Schema, model } from "mongoose";
import { DateTime } from "luxon";
import reactionSchema from "../schemas/reaction.js";
import { getDate } from "../utils/getDate.js";

const thoughtSchema = new Schema(
	{
		thoughtText: {
			type: String,
			required: true,
			minLength: [1, "Cannot create an empty thought"],
			maxLength: [280, "Exceeded character limit"],
		},
		createdAt: {
			type: DateTime,
			default: DateTime.now(),
			get: getDate,
		},
		username: {
			type: String,
			required: true,
		},
		reactions: [reactionSchema],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);

thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

thoughtSchema.pre("findOneAndUpdate", (next) => {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } }, next);
});

thoughtSchema.pre("updateOne", (next) => {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } }, next);
});

// May not be needed if all associated reactions are deleted since no model exists for reactions...
// thoughtSchema.pre("deleteMany", (next) => {

// })

const thought = model("thought", thoughtSchema);

export default thought;
