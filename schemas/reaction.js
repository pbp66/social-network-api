import { Schema } from "mongoose";
import { DateTime } from "luxon";
import { getDate } from "../utils/getDate.js";

const reactionSchema = new Schema(
	{
		reactionId: {
			type: Schema.type.ObjectId,
			default: new mongoose.Types.ObjectId(),
		},
		reactionBody: {
			type: String,
			required: true,
			minLength: [1, "Cannot create an empty reaction"],
			maxLength: [280, "Exceeded character limit"],
		},
		username: {
			type: String,
			required: true,
		},
		createdAt: {
			type: DateTime,
			default: DateTime.now().toISO(),
			get: getDate,
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
);

export default reactionSchema;
