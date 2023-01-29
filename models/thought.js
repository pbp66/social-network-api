import { Schema, model } from "mongoose";
import { DateTime } from "luxon";
import reactionSchema from "reaction.js";
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
		// username: {
		// 	type: String,
		// 	required: true,
		// },
		username: {
			type: Schema.Types.ObjectId,
			ref: "User",
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

const thought = model("thought", thoughtSchema);

export default thought;
