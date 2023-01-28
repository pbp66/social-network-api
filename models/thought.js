import { Schema, model } from "mongoose";
import reactionSchema from "reaction.js";

const thoughtSchema = new Schema(
	{
		thoughtText: {
			type: String,
			required: true,
			min: [1, "Cannot create an empty entry"],
			max: [280, "Exceed character limit"],
		},
		createdAt: {
			type: Date,
			default: () => {},
			getter: true,
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
		},
		id: false,
	}
);

thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

const thought = model("thought", thoughtSchema);

export default thought;
