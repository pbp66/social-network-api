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
			type: Date,
			default: () => {
				return DateTime.now();
			},
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

thoughtSchema.pre("findOneAndUpdate", function (next) {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } });
	next();
});

thoughtSchema.pre("updateOne", function (next) {
	this.set({ updatedAt: DateTime.now().toISO() });
	this.update({}, { $inc: { __v: 1 } });
	next();
});

const thought = model("thought", thoughtSchema);

export default thought;
